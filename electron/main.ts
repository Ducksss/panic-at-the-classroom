import { app, BrowserWindow, Tray, Menu, globalShortcut, ipcMain, nativeImage } from 'electron'
import path from 'path'

let mainWindow: BrowserWindow | null = null
let tray: Tray | null = null
let isPanicMode = false
let isMonitoringActive = false

const VITE_DEV_SERVER_URL = process.env.VITE_DEV_SERVER_URL

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        show: false, // Start hidden, show from tray
        frame: true,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: false,
            contextIsolation: true,
            // CRITICAL: Prevent throttling when window is hidden/minimized
            backgroundThrottling: false,
        },
    })

    if (VITE_DEV_SERVER_URL) {
        mainWindow.loadURL(VITE_DEV_SERVER_URL)
        mainWindow.webContents.openDevTools()
    } else {
        mainWindow.loadFile(path.join(__dirname, '../dist/index.html'))
    }

    mainWindow.on('close', (event) => {
        // Minimize to tray instead of closing
        event.preventDefault()
        mainWindow?.hide()

        // Notify user that monitoring continues in background
        if (isMonitoringActive) {
            tray?.setToolTip('Panic at the Classroom - 🟢 Monitoring in Background')
        }
    })

    // Keep window rendering even when hidden (for camera access)
    mainWindow.webContents.setBackgroundThrottling(false)
}

function createTray() {
    // Create a simple tray icon
    const icon = nativeImage.createEmpty()
    tray = new Tray(icon)

    updateTrayMenu()

    tray.on('click', () => {
        mainWindow?.show()
        mainWindow?.focus()
    })
}

function updateTrayMenu() {
    const contextMenu = Menu.buildFromTemplate([
        {
            label: '👁️ Open Dashboard',
            click: () => {
                mainWindow?.show()
                mainWindow?.focus()
            }
        },
        { type: 'separator' },
        {
            label: isMonitoringActive ? '🟢 Monitoring Active' : '⚪ Monitoring Off',
            enabled: false
        },
        {
            label: '🔽 Minimize to Tray (Keep Monitoring)',
            click: () => {
                mainWindow?.hide()
            }
        },
        { type: 'separator' },
        {
            label: '🚨 Panic Mode (Ctrl+Shift+P)',
            click: () => triggerPanicMode()
        },
        { type: 'separator' },
        {
            label: '❌ Quit',
            click: () => {
                mainWindow?.destroy()
                app.quit()
            }
        }
    ])

    tray?.setToolTip(isMonitoringActive
        ? 'Panic at the Classroom - 🟢 Monitoring Active'
        : 'Panic at the Classroom - Ready')
    tray?.setContextMenu(contextMenu)
}

function triggerPanicMode() {
    isPanicMode = !isPanicMode

    if (isPanicMode) {
        // Go fullscreen with Excel overlay
        mainWindow?.show()
        mainWindow?.setFullScreen(true)
        mainWindow?.setAlwaysOnTop(true)
        mainWindow?.webContents.send('panic-mode', true)
    } else {
        // Return to normal
        mainWindow?.setFullScreen(false)
        mainWindow?.setAlwaysOnTop(false)
        mainWindow?.webContents.send('panic-mode', false)
    }
}

function registerGlobalShortcuts() {
    // Register Ctrl+Shift+P as panic hotkey
    globalShortcut.register('CommandOrControl+Shift+P', () => {
        triggerPanicMode()
    })

    // ESC to exit panic mode
    globalShortcut.register('Escape', () => {
        if (isPanicMode) {
            triggerPanicMode()
        }
    })
}

// IPC handlers
ipcMain.on('trigger-panic', () => {
    triggerPanicMode()
})

ipcMain.on('teacher-detected', () => {
    if (!isPanicMode) {
        triggerPanicMode()
    }
})

// Track monitoring state for tray updates
ipcMain.on('monitoring-started', () => {
    isMonitoringActive = true
    updateTrayMenu()
    console.log('📡 Background monitoring started')
})

ipcMain.on('monitoring-stopped', () => {
    isMonitoringActive = false
    updateTrayMenu()
    console.log('📡 Background monitoring stopped')
})

app.whenReady().then(() => {
    createWindow()
    createTray()
    registerGlobalShortcuts()

    // Show window on first launch
    mainWindow?.show()
})

app.on('will-quit', () => {
    globalShortcut.unregisterAll()
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow()
    }
})

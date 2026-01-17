import { app, BrowserWindow, Tray, Menu, globalShortcut, ipcMain, nativeImage } from 'electron'
import path from 'path'

let mainWindow: BrowserWindow | null = null
let tray: Tray | null = null
let isPanicMode = false

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
    })
}

function createTray() {
    // Create a simple tray icon (green circle = protected)
    const icon = nativeImage.createEmpty()
    tray = new Tray(icon)

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

    tray.setToolTip('Panic at the Classroom - Protected')
    tray.setContextMenu(contextMenu)

    tray.on('click', () => {
        mainWindow?.show()
        mainWindow?.focus()
    })
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

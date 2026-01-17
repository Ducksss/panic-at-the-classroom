import { contextBridge, ipcRenderer } from 'electron'

// Expose protected methods to renderer process
contextBridge.exposeInMainWorld('electronAPI', {
    // Trigger panic mode from renderer
    triggerPanic: () => ipcRenderer.send('trigger-panic'),

    // Notify main process when teacher is detected
    teacherDetected: () => ipcRenderer.send('teacher-detected'),

    // Notify main process about monitoring state (for tray updates)
    monitoringStarted: () => ipcRenderer.send('monitoring-started'),
    monitoringStopped: () => ipcRenderer.send('monitoring-stopped'),

    // Listen for panic mode changes
    onPanicMode: (callback: (isPanic: boolean) => void) => {
        ipcRenderer.on('panic-mode', (_event, isPanic) => callback(isPanic))
    },

    // Remove listeners
    removeAllListeners: () => {
        ipcRenderer.removeAllListeners('panic-mode')
    }
})

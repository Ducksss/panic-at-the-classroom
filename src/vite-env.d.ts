/// <reference types="vite/client" />

interface ElectronAPI {
    triggerPanic: () => void
    teacherDetected: () => void
    monitoringStarted: () => void
    monitoringStopped: () => void
    onPanicMode: (callback: (isPanic: boolean) => void) => void
    removeAllListeners: () => void
}

declare global {
    interface Window {
        electronAPI?: ElectronAPI
    }
}

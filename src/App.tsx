import { useState, useEffect, useCallback } from 'react'
import { Dashboard } from './components/Dashboard'
import { ExcelView } from './components/ExcelView'
import { FaceDetector } from './components/FaceDetector'
import './App.css'

export interface RegisteredFace {
    id: string
    descriptor: Float32Array
    imageData: string // Base64 image
    name: string
    registeredAt: Date
}

function App() {
    const [isPanicMode, setIsPanicMode] = useState(false)
    const [isMonitoring, setIsMonitoring] = useState(false)
    const [isRegistering, setIsRegistering] = useState(false)
    const [registeredFaces, setRegisteredFaces] = useState<RegisteredFace[]>([])

    // Listen for panic mode changes from Electron
    useEffect(() => {
        if (window.electronAPI) {
            window.electronAPI.onPanicMode((isPanic) => {
                setIsPanicMode(isPanic)
            })

            return () => {
                window.electronAPI?.removeAllListeners()
            }
        }
    }, [])

    // Handle keyboard shortcut for web testing
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.ctrlKey && e.shiftKey && e.key === 'P') {
                e.preventDefault()
                setIsPanicMode(prev => !prev)
            }
            if (e.key === 'Escape' && isPanicMode) {
                setIsPanicMode(false)
            }
        }

        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [isPanicMode])

    const handleTeacherDetected = useCallback(() => {
        console.log('🚨 TEACHER DETECTED!')
        setIsPanicMode(true)

        // Notify Electron to go fullscreen
        if (window.electronAPI) {
            window.electronAPI.teacherDetected()
        }
    }, [])

    const handleFaceRegistered = useCallback((face: RegisteredFace) => {
        setRegisteredFaces(prev => [...prev, face])
        setIsRegistering(false) // Exit registration mode after capture
        console.log('✅ Teacher face registered!')
    }, [])

    const handleDeleteFace = useCallback((id: string) => {
        setRegisteredFaces(prev => prev.filter(f => f.id !== id))
    }, [])

    const handleExitPanic = useCallback(() => {
        setIsPanicMode(false)
        if (window.electronAPI) {
            window.electronAPI.triggerPanic() // Toggle off
        }
    }, [])

    return (
        <div className="app">
            {isPanicMode ? (
                <ExcelView onExit={handleExitPanic} />
            ) : (
                <>
                    <Dashboard
                        isMonitoring={isMonitoring}
                        isRegistering={isRegistering}
                        setIsMonitoring={setIsMonitoring}
                        setIsRegistering={setIsRegistering}
                        registeredFaces={registeredFaces}
                        onDeleteFace={handleDeleteFace}
                        onManualPanic={() => setIsPanicMode(true)}
                    />
                    <FaceDetector
                        isMonitoring={isMonitoring}
                        isRegistering={isRegistering}
                        registeredFaces={registeredFaces}
                        onTeacherDetected={handleTeacherDetected}
                        onFaceRegistered={handleFaceRegistered}
                    />
                </>
            )}
        </div>
    )
}

export default App

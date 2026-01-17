import { useState, useEffect, useCallback } from 'react'
import { Dashboard } from './components/Dashboard'
import { ExcelView } from './components/ExcelView'
import { VSCodeView } from './components/VSCodeView'
import { OutlookView } from './components/OutlookView'
import { NotionView } from './components/NotionView'
import { CanvasView } from './components/CanvasView'
import { FaceDetector } from './components/FaceDetector'
import './App.css'

export interface RegisteredFace {
    id: string
    descriptor: Float32Array
    imageData: string // Base64 image
    name: string
    registeredAt: Date
}

export type PanicInterface = 'excel' | 'vscode' | 'outlook' | 'notion' | 'canvas'

export const PANIC_INTERFACES: { id: PanicInterface; name: string; icon: string }[] = [
    { id: 'excel', name: 'Microsoft Excel', icon: '📊' },
    { id: 'vscode', name: 'Visual Studio Code', icon: '💻' },
    { id: 'outlook', name: 'Microsoft Outlook', icon: '📧' },
    { id: 'notion', name: 'Notion', icon: '📝' },
    { id: 'canvas', name: 'Canvas LMS', icon: '🎓' },
]

function App() {
    const [isPanicMode, setIsPanicMode] = useState(false)
    const [isMonitoring, setIsMonitoring] = useState(false)
    const [isRegistering, setIsRegistering] = useState(false)
    const [registeredFaces, setRegisteredFaces] = useState<RegisteredFace[]>([])
    const [selectedInterface, setSelectedInterface] = useState<PanicInterface>('excel')

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

    // Notify Electron about monitoring state (for background tray updates)
    useEffect(() => {
        if (window.electronAPI) {
            if (isMonitoring) {
                window.electronAPI.monitoringStarted()
            } else {
                window.electronAPI.monitoringStopped()
            }
        }
    }, [isMonitoring])

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

    // Handle image upload for face registration
    const handleImageUpload = useCallback(async (file: File) => {
        try {
            // Import face-api dynamically to avoid SSR issues
            const faceapi = await import('@vladmandic/face-api')

            // Create image element from file
            const img = document.createElement('img')
            const imageUrl = URL.createObjectURL(file)

            img.onload = async () => {
                try {
                    // Detect face in uploaded image
                    const detection = await faceapi
                        .detectSingleFace(img, new faceapi.TinyFaceDetectorOptions())
                        .withFaceLandmarks()
                        .withFaceDescriptor()

                    if (detection) {
                        // Create canvas to get image data
                        const canvas = document.createElement('canvas')
                        canvas.width = 120
                        canvas.height = 120
                        const ctx = canvas.getContext('2d')

                        if (ctx) {
                            // Center crop the image
                            const size = Math.min(img.width, img.height)
                            const x = (img.width - size) / 2
                            const y = (img.height - size) / 2
                            ctx.drawImage(img, x, y, size, size, 0, 0, 120, 120)

                            const imageData = canvas.toDataURL('image/jpeg', 0.8)

                            const newFace: RegisteredFace = {
                                id: `teacher-${Date.now()}`,
                                descriptor: detection.descriptor,
                                imageData,
                                name: `Teacher ${registeredFaces.length + 1}`,
                                registeredAt: new Date()
                            }

                            setRegisteredFaces(prev => [...prev, newFace])
                            console.log('✅ Face registered from uploaded image!')
                        }
                    } else {
                        alert('No face detected in the uploaded image. Please try another photo with a clear face.')
                    }
                } catch (err) {
                    console.error('Face detection error:', err)
                    alert('Error processing image. Please try again.')
                } finally {
                    URL.revokeObjectURL(imageUrl)
                }
            }

            img.onerror = () => {
                alert('Error loading image. Please try a different file.')
                URL.revokeObjectURL(imageUrl)
            }

            img.src = imageUrl
        } catch (error) {
            console.error('Image upload error:', error)
            alert('Error processing image. Please try again.')
        }
    }, [registeredFaces.length])

    // Render the selected panic interface
    const renderPanicView = () => {
        const props = { onExit: handleExitPanic }
        switch (selectedInterface) {
            case 'vscode':
                return <VSCodeView {...props} />
            case 'outlook':
                return <OutlookView {...props} />
            case 'notion':
                return <NotionView {...props} />
            case 'canvas':
                return <CanvasView {...props} />
            case 'excel':
            default:
                return <ExcelView {...props} />
        }
    }

    return (
        <div className="app">
            {isPanicMode ? (
                renderPanicView()
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
                        selectedInterface={selectedInterface}
                        setSelectedInterface={setSelectedInterface}
                        onImageUpload={handleImageUpload}
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

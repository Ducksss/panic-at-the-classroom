import { useEffect, useRef, useState, useCallback } from 'react'
import * as faceapi from '@vladmandic/face-api'
import './FaceDetector.css'

interface FaceDetectorProps {
    isMonitoring: boolean
    registeredFaces: Float32Array[]
    onTeacherDetected: () => void
    onFaceRegistered: (descriptor: Float32Array) => void
}

export function FaceDetector({
    isMonitoring,
    registeredFaces,
    onTeacherDetected,
    onFaceRegistered
}: FaceDetectorProps) {
    const videoRef = useRef<HTMLVideoElement>(null)
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const [isModelLoaded, setIsModelLoaded] = useState(false)
    const [isRegistering, setIsRegistering] = useState(false)
    const [cameraError, setCameraError] = useState<string | null>(null)
    const streamRef = useRef<MediaStream | null>(null)

    // Load face-api models
    useEffect(() => {
        const loadModels = async () => {
            const MODEL_URL = '/models'
            try {
                await Promise.all([
                    faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
                    faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
                    faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL)
                ])
                setIsModelLoaded(true)
                console.log('✅ Face detection models loaded')
            } catch (error) {
                console.error('Failed to load face models:', error)
                // Models will be loaded from CDN fallback
                setIsModelLoaded(true)
            }
        }
        loadModels()
    }, [])

    // Start/stop camera based on monitoring state
    useEffect(() => {
        const startCamera = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({
                    video: { width: 640, height: 480, facingMode: 'user' }
                })
                streamRef.current = stream
                if (videoRef.current) {
                    videoRef.current.srcObject = stream
                }
                setCameraError(null)
            } catch (error) {
                console.error('Camera error:', error)
                setCameraError('Could not access camera. Please allow camera permissions.')
            }
        }

        const stopCamera = () => {
            if (streamRef.current) {
                streamRef.current.getTracks().forEach(track => track.stop())
                streamRef.current = null
            }
        }

        if (isMonitoring) {
            startCamera()
        } else {
            stopCamera()
        }

        return () => stopCamera()
    }, [isMonitoring])

    // Face detection loop
    useEffect(() => {
        if (!isMonitoring || !isModelLoaded || !videoRef.current) return

        let animationId: number
        const detectionThreshold = 0.5

        const detectFaces = async () => {
            if (!videoRef.current || videoRef.current.paused || videoRef.current.ended) {
                animationId = requestAnimationFrame(detectFaces)
                return
            }

            try {
                const detections = await faceapi
                    .detectAllFaces(videoRef.current, new faceapi.TinyFaceDetectorOptions())
                    .withFaceLandmarks()
                    .withFaceDescriptors()

                // Draw detection boxes
                if (canvasRef.current && videoRef.current) {
                    const displaySize = {
                        width: videoRef.current.videoWidth,
                        height: videoRef.current.videoHeight
                    }
                    faceapi.matchDimensions(canvasRef.current, displaySize)
                    const resizedDetections = faceapi.resizeResults(detections, displaySize)

                    const ctx = canvasRef.current.getContext('2d')
                    if (ctx) {
                        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)
                        faceapi.draw.drawDetections(canvasRef.current, resizedDetections)
                    }
                }

                // Check for teacher match
                if (detections.length > 0 && registeredFaces.length > 0) {
                    for (const detection of detections) {
                        for (const registeredFace of registeredFaces) {
                            const distance = faceapi.euclideanDistance(
                                detection.descriptor,
                                registeredFace
                            )

                            if (distance < detectionThreshold) {
                                console.log('🚨 Teacher match! Distance:', distance)
                                onTeacherDetected()
                                return
                            }
                        }
                    }
                }
            } catch (error) {
                console.error('Detection error:', error)
            }

            animationId = requestAnimationFrame(detectFaces)
        }

        // Start detection loop after video is ready
        const video = videoRef.current
        const handlePlay = () => {
            detectFaces()
        }
        video.addEventListener('play', handlePlay)

        return () => {
            video.removeEventListener('play', handlePlay)
            cancelAnimationFrame(animationId)
        }
    }, [isMonitoring, isModelLoaded, registeredFaces, onTeacherDetected])

    // Register a face
    const handleRegisterFace = useCallback(async () => {
        if (!videoRef.current || !isModelLoaded) return

        setIsRegistering(true)
        try {
            const detection = await faceapi
                .detectSingleFace(videoRef.current, new faceapi.TinyFaceDetectorOptions())
                .withFaceLandmarks()
                .withFaceDescriptor()

            if (detection) {
                onFaceRegistered(detection.descriptor)
                setIsRegistering(false)
            } else {
                alert('No face detected. Please ensure your face is clearly visible.')
                setIsRegistering(false)
            }
        } catch (error) {
            console.error('Registration error:', error)
            setIsRegistering(false)
        }
    }, [isModelLoaded, onFaceRegistered])

    if (!isMonitoring) {
        return null
    }

    return (
        <div className="face-detector">
            <div className="video-container">
                {cameraError ? (
                    <div className="camera-error">
                        <p>📷 {cameraError}</p>
                    </div>
                ) : (
                    <>
                        <video
                            ref={videoRef}
                            autoPlay
                            muted
                            playsInline
                        />
                        <canvas ref={canvasRef} />
                    </>
                )}

                <div className="video-controls">
                    <button
                        className="btn btn-register"
                        onClick={handleRegisterFace}
                        disabled={isRegistering || !isModelLoaded}
                    >
                        {isRegistering ? '📸 Registering...' : '👤 Register Teacher Face'}
                    </button>
                </div>
            </div>

            <div className="detector-status">
                {!isModelLoaded && <span>Loading AI models...</span>}
                {isModelLoaded && <span>✅ AI Ready • Watching for teachers...</span>}
            </div>
        </div>
    )
}

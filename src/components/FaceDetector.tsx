import { useEffect, useRef, useState, useCallback } from 'react'
import * as faceapi from '@vladmandic/face-api'
import { RegisteredFace } from '../App'
import './FaceDetector.css'

interface FaceDetectorProps {
    isMonitoring: boolean
    isRegistering: boolean
    registeredFaces: RegisteredFace[]
    onTeacherDetected: () => void
    onFaceRegistered: (face: RegisteredFace) => void
}

export function FaceDetector({
    isMonitoring,
    isRegistering,
    registeredFaces,
    onTeacherDetected,
    onFaceRegistered
}: FaceDetectorProps) {
    const videoRef = useRef<HTMLVideoElement>(null)
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const [isModelLoaded, setIsModelLoaded] = useState(false)
    const [cameraError, setCameraError] = useState<string | null>(null)
    const [faceDetected, setFaceDetected] = useState(false)
    const streamRef = useRef<MediaStream | null>(null)
    const teacherCount = useRef(registeredFaces.length)

    // Update teacher count
    useEffect(() => {
        teacherCount.current = registeredFaces.length
    }, [registeredFaces])

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
                setIsModelLoaded(true)
            }
        }
        loadModels()
    }, [])

    // Start/stop camera based on monitoring or registering state
    const isCameraNeeded = isMonitoring || isRegistering

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

        if (isCameraNeeded) {
            startCamera()
        } else {
            stopCamera()
        }

        return () => stopCamera()
    }, [isCameraNeeded])

    // Capture face snapshot
    const captureFaceSnapshot = useCallback((): string | null => {
        if (!videoRef.current) return null

        const canvas = document.createElement('canvas')
        canvas.width = 120
        canvas.height = 120

        const ctx = canvas.getContext('2d')
        if (!ctx) return null

        // Center crop from video
        const video = videoRef.current
        const size = Math.min(video.videoWidth, video.videoHeight)
        const x = (video.videoWidth - size) / 2
        const y = (video.videoHeight - size) / 2

        ctx.drawImage(video, x, y, size, size, 0, 0, 120, 120)
        return canvas.toDataURL('image/jpeg', 0.8)
    }, [])

    // Registration mode - detect and register on click
    const handleRegisterClick = useCallback(async () => {
        if (!videoRef.current || !isModelLoaded) return

        try {
            const detection = await faceapi
                .detectSingleFace(videoRef.current, new faceapi.TinyFaceDetectorOptions())
                .withFaceLandmarks()
                .withFaceDescriptor()

            if (detection) {
                const imageData = captureFaceSnapshot()
                if (imageData) {
                    const newFace: RegisteredFace = {
                        id: `teacher-${Date.now()}`,
                        descriptor: detection.descriptor,
                        imageData,
                        name: `Teacher ${teacherCount.current + 1}`,
                        registeredAt: new Date()
                    }
                    onFaceRegistered(newFace)
                }
            } else {
                alert('No face detected. Please position your face clearly in the camera.')
            }
        } catch (error) {
            console.error('Registration error:', error)
        }
    }, [isModelLoaded, captureFaceSnapshot, onFaceRegistered])

    // Monitoring mode - face detection loop
    useEffect(() => {
        if (!isMonitoring || !isModelLoaded || !videoRef.current) return

        let animationId: number
        // Stricter threshold - lower = stricter matching
        // 0.4 = very strict (high confidence required)
        // 0.5 = moderate 
        // 0.6 = loose (more false positives)
        const MATCH_THRESHOLD = 0.4

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

                setFaceDetected(detections.length > 0)

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

                // Check for teacher match - ONLY trigger if we have a confident match
                if (detections.length > 0 && registeredFaces.length > 0) {
                    let bestMatch = { distance: Infinity, name: '' }

                    for (const detection of detections) {
                        for (const registeredFace of registeredFaces) {
                            const distance = faceapi.euclideanDistance(
                                detection.descriptor,
                                registeredFace.descriptor
                            )

                            // Track best match for logging
                            if (distance < bestMatch.distance) {
                                bestMatch = { distance, name: registeredFace.name }
                            }

                            // Only trigger if distance is below strict threshold
                            if (distance < MATCH_THRESHOLD) {
                                console.log(`🚨 TEACHER MATCH! ${registeredFace.name} - Distance: ${distance.toFixed(3)} (threshold: ${MATCH_THRESHOLD})`)
                                onTeacherDetected()
                                return // Exit the detection loop
                            }
                        }
                    }

                    // Log non-matches for debugging (only occasionally to avoid spam)
                    if (Math.random() < 0.1) { // 10% of frames
                        console.log(`👤 Face detected but no match. Best distance: ${bestMatch.distance.toFixed(3)} to ${bestMatch.name} (need < ${MATCH_THRESHOLD})`)
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

    if (!isCameraNeeded) {
        return null
    }

    return (
        <div className={`face-detector ${isRegistering ? 'registering' : 'monitoring'}`}>
            <div className="detector-header">
                {isRegistering ? '📸 Registration Mode' : '👁️ Monitoring Mode'}
            </div>
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
                        {isRegistering && (
                            <div className="registration-overlay">
                                <div className="face-guide" />
                            </div>
                        )}
                    </>
                )}

                {isRegistering && (
                    <div className="video-controls">
                        <button
                            className="btn btn-capture"
                            onClick={handleRegisterClick}
                            disabled={!isModelLoaded}
                        >
                            📷 Capture Face
                        </button>
                    </div>
                )}
            </div>

            <div className="detector-status">
                {!isModelLoaded && <span>Loading AI models...</span>}
                {isModelLoaded && isRegistering && <span>✅ Position face in circle, then click Capture</span>}
                {isModelLoaded && isMonitoring && (
                    <span className={faceDetected ? 'face-found' : ''}>
                        {faceDetected ? '👤 Face detected - checking...' : '🔍 Scanning for faces...'}
                    </span>
                )}
            </div>
        </div>
    )
}

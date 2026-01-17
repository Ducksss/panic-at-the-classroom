import { RegisteredFace } from '../App'
import './Dashboard.css'

interface DashboardProps {
    isMonitoring: boolean
    isRegistering: boolean
    setIsMonitoring: (value: boolean) => void
    setIsRegistering: (value: boolean) => void
    registeredFaces: RegisteredFace[]
    onDeleteFace: (id: string) => void
    onManualPanic: () => void
}

export function Dashboard({
    isMonitoring,
    isRegistering,
    setIsMonitoring,
    setIsRegistering,
    registeredFaces,
    onDeleteFace,
    onManualPanic
}: DashboardProps) {
    // Determine current mode for status display
    const getStatus = () => {
        if (isRegistering) return { text: 'Registration Mode - Look at camera', class: 'registering' }
        if (isMonitoring) return { text: 'Protected - Monitoring Active', class: 'active' }
        return { text: 'Protection Disabled', class: 'inactive' }
    }
    const status = getStatus()

    return (
        <div className="dashboard">
            <h1>🚨 Panic at the Classroom</h1>
            <p className="subtitle">Your AI-powered teacher detection system</p>

            <div className="status-card">
                <h2>🛡️ Protection Status</h2>
                <div className={`status-indicator ${status.class}`}>
                    {(isMonitoring || isRegistering) && <div className="pulse" />}
                    {status.text}
                </div>

                <div className="info-grid">
                    <div className="info-item">
                        <div className="value">{registeredFaces.length}</div>
                        <div className="label">Teachers Registered</div>
                    </div>
                    <div className="info-item">
                        <div className="value">{isMonitoring ? '30' : '0'}</div>
                        <div className="label">FPS Monitoring</div>
                    </div>
                    <div className="info-item">
                        <div className="value">0</div>
                        <div className="label">Detections Today</div>
                    </div>
                </div>

                {/* Clear separate buttons */}
                <div className="controls">
                    <button
                        className={`btn ${isRegistering ? 'btn-active' : 'btn-secondary'}`}
                        onClick={() => {
                            setIsRegistering(!isRegistering)
                            if (!isRegistering) setIsMonitoring(false)
                        }}
                        disabled={isMonitoring}
                    >
                        {isRegistering ? '📸 Registering...' : '👤 Register Teacher'}
                    </button>

                    <button
                        className={`btn ${isMonitoring ? 'btn-danger' : 'btn-primary'}`}
                        onClick={() => {
                            setIsMonitoring(!isMonitoring)
                            if (!isMonitoring) setIsRegistering(false)
                        }}
                        disabled={isRegistering || registeredFaces.length === 0}
                        title={registeredFaces.length === 0 ? 'Register a teacher first' : ''}
                    >
                        {isMonitoring ? '⏹️ Stop Monitoring' : '▶️ Start Monitoring'}
                    </button>

                    <button
                        className="btn btn-panic"
                        onClick={onManualPanic}
                    >
                        🚨 Panic!
                    </button>
                </div>

                {registeredFaces.length === 0 && !isRegistering && (
                    <p className="hint">👆 Register a teacher's face to enable monitoring</p>
                )}
            </div>

            {/* Registered Faces Gallery */}
            <div className="status-card">
                <h2>👥 Registered Faces ({registeredFaces.length})</h2>
                {registeredFaces.length === 0 ? (
                    <div className="empty-gallery">
                        <p>No teachers registered yet</p>
                        <p className="hint">Click "Register Teacher" and look at the camera</p>
                    </div>
                ) : (
                    <div className="face-gallery">
                        {registeredFaces.map((face) => (
                            <div key={face.id} className="face-card">
                                <img src={face.imageData} alt={face.name} />
                                <div className="face-info">
                                    <span className="face-name">{face.name}</span>
                                    <span className="face-date">
                                        {face.registeredAt.toLocaleTimeString()}
                                    </span>
                                </div>
                                <button
                                    className="delete-btn"
                                    onClick={() => onDeleteFace(face.id)}
                                    title="Remove this face"
                                >
                                    ✕
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="hotkey-hint">
                💡 <strong>Pro Tip:</strong> Use <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>P</kbd> anytime for instant panic mode!
            </div>
        </div>
    )
}

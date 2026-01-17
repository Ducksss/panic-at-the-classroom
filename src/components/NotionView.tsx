import './NotionView.css'

interface NotionViewProps {
    onExit: () => void
}

export function NotionView({ onExit }: NotionViewProps) {
    return (
        <div className="notion-view" onClick={onExit}>
            {/* Sidebar */}
            <div className="notion-sidebar">
                <div className="workspace">
                    <span className="workspace-icon">📚</span>
                    <span className="workspace-name">University Notes</span>
                </div>

                <div className="sidebar-section">
                    <div className="page-item">🔍 Quick Find</div>
                    <div className="page-item">⏰ All Updates</div>
                    <div className="page-item">⚙️ Settings</div>
                </div>

                <div className="sidebar-section">
                    <div className="section-header">Favorites</div>
                    <div className="page-item active">📖 CS301 Notes</div>
                    <div className="page-item">📊 Data Structures</div>
                    <div className="page-item">🧮 Algorithms</div>
                </div>

                <div className="sidebar-section">
                    <div className="section-header">Private</div>
                    <div className="page-item">📝 To-Do List</div>
                    <div className="page-item">💡 Project Ideas</div>
                    <div className="page-item">📅 Schedule</div>
                    <div className="page-item">📁 Resources</div>
                </div>
            </div>

            {/* Main Content */}
            <div className="notion-content">
                {/* Top Bar */}
                <div className="notion-topbar">
                    <div className="breadcrumb">
                        <span>University Notes</span>
                        <span>/</span>
                        <span>CS301 Notes</span>
                    </div>
                    <div className="topbar-actions">
                        <button>Share</button>
                        <button>⭐</button>
                        <button>•••</button>
                    </div>
                </div>

                {/* Page Content */}
                <div className="notion-page">
                    <div className="page-icon">📖</div>
                    <h1 className="page-title">CS301 - Database Systems</h1>
                    <div className="page-properties">
                        <div className="property">
                            <span className="property-name">Professor</span>
                            <span className="property-value">Dr. Williams</span>
                        </div>
                        <div className="property">
                            <span className="property-name">Status</span>
                            <span className="property-value status-progress">In Progress</span>
                        </div>
                        <div className="property">
                            <span className="property-name">Last Edited</span>
                            <span className="property-value">Today, 2:30 PM</span>
                        </div>
                    </div>

                    <div className="notion-content-area">
                        <h2>Week 8: Database Normalization</h2>

                        <div className="callout">
                            💡 <strong>Key Concept:</strong> Normalization reduces data redundancy and improves data integrity.
                        </div>

                        <h3>1. First Normal Form (1NF)</h3>
                        <ul>
                            <li>Eliminate repeating groups</li>
                            <li>Create separate tables for related data</li>
                            <li>Identify each set of related data with a primary key</li>
                        </ul>

                        <h3>2. Second Normal Form (2NF)</h3>
                        <ul>
                            <li>Must be in 1NF</li>
                            <li>Remove subsets of data that apply to multiple rows</li>
                            <li>Create separate tables and relationships</li>
                        </ul>

                        <h3>3. Third Normal Form (3NF)</h3>
                        <ul>
                            <li>Must be in 2NF</li>
                            <li>Remove columns not dependent on primary key</li>
                        </ul>

                        <div className="toggle-block">
                            <div className="toggle-header">
                                <span>▶</span> Example: Normalizing a Student Database
                            </div>
                        </div>

                        <h2>Practice Problems</h2>
                        <div className="todo-list">
                            <div className="todo-item done">
                                <span className="checkbox">☑️</span>
                                <span>Read Chapter 7.1 - 7.3</span>
                            </div>
                            <div className="todo-item done">
                                <span className="checkbox">☑️</span>
                                <span>Complete Worksheet 8A</span>
                            </div>
                            <div className="todo-item">
                                <span className="checkbox">⬜</span>
                                <span>Practice normalization exercises</span>
                            </div>
                            <div className="todo-item">
                                <span className="checkbox">⬜</span>
                                <span>Review for Quiz 4</span>
                            </div>
                        </div>

                        <h2>Resources</h2>
                        <div className="bookmark">
                            <div className="bookmark-icon">🔗</div>
                            <div className="bookmark-content">
                                <div className="bookmark-title">Database Normalization Tutorial</div>
                                <div className="bookmark-url">www.tutorialspoint.com/dbms</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="exit-hint">Press ESC or click anywhere to exit</div>
        </div>
    )
}

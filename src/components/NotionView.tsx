import { useState } from 'react'
import './NotionView.css'

interface NotionViewProps {
    onExit: () => void
}

export function NotionView({ onExit }: NotionViewProps) {
    const [activePage, setActivePage] = useState('CS301 Notes')
    const [expandedToggles, setExpandedToggles] = useState<string[]>([])
    const [checkedItems, setCheckedItems] = useState<string[]>(['item1', 'item2'])

    const handlePageClick = (e: React.MouseEvent, page: string) => {
        e.stopPropagation()
        setActivePage(page)
    }

    const handleToggle = (e: React.MouseEvent, id: string) => {
        e.stopPropagation()
        setExpandedToggles(prev =>
            prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id]
        )
    }

    const handleCheckItem = (e: React.MouseEvent, id: string) => {
        e.stopPropagation()
        setCheckedItems(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        )
    }

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
                    <div
                        className={`page-item ${activePage === 'CS301 Notes' ? 'active' : ''}`}
                        onClick={(e) => handlePageClick(e, 'CS301 Notes')}
                    >
                        📖 CS301 Notes
                    </div>
                    <div
                        className={`page-item ${activePage === 'Data Structures' ? 'active' : ''}`}
                        onClick={(e) => handlePageClick(e, 'Data Structures')}
                    >
                        📊 Data Structures
                    </div>
                    <div
                        className={`page-item ${activePage === 'Algorithms' ? 'active' : ''}`}
                        onClick={(e) => handlePageClick(e, 'Algorithms')}
                    >
                        🧮 Algorithms
                    </div>
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
                        <span>{activePage}</span>
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
                            <span className="property-value editing-indicator">Just now ✍️</span>
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

                        <div
                            className={`toggle-block ${expandedToggles.includes('example') ? 'expanded' : ''}`}
                            onClick={(e) => handleToggle(e, 'example')}
                        >
                            <div className="toggle-header">
                                <span className="toggle-icon">
                                    {expandedToggles.includes('example') ? '▼' : '▶'}
                                </span>
                                Example: Normalizing a Student Database
                            </div>
                            {expandedToggles.includes('example') && (
                                <div className="toggle-content">
                                    <p>Consider a table with repeating groups:</p>
                                    <code>Student(ID, Name, Course1, Grade1, Course2, Grade2)</code>
                                    <p>After 1NF:</p>
                                    <code>Student(ID, Name), Enrollment(StudentID, Course, Grade)</code>
                                </div>
                            )}
                        </div>

                        <h2>Practice Problems</h2>
                        <div className="todo-list">
                            <div
                                className={`todo-item ${checkedItems.includes('item1') ? 'done' : ''}`}
                                onClick={(e) => handleCheckItem(e, 'item1')}
                            >
                                <span className="checkbox">
                                    {checkedItems.includes('item1') ? '☑️' : '⬜'}
                                </span>
                                <span>Read Chapter 7.1 - 7.3</span>
                            </div>
                            <div
                                className={`todo-item ${checkedItems.includes('item2') ? 'done' : ''}`}
                                onClick={(e) => handleCheckItem(e, 'item2')}
                            >
                                <span className="checkbox">
                                    {checkedItems.includes('item2') ? '☑️' : '⬜'}
                                </span>
                                <span>Complete Worksheet 8A</span>
                            </div>
                            <div
                                className={`todo-item ${checkedItems.includes('item3') ? 'done' : ''}`}
                                onClick={(e) => handleCheckItem(e, 'item3')}
                            >
                                <span className="checkbox">
                                    {checkedItems.includes('item3') ? '☑️' : '⬜'}
                                </span>
                                <span>Practice normalization exercises</span>
                            </div>
                            <div
                                className={`todo-item ${checkedItems.includes('item4') ? 'done' : ''}`}
                                onClick={(e) => handleCheckItem(e, 'item4')}
                            >
                                <span className="checkbox">
                                    {checkedItems.includes('item4') ? '☑️' : '⬜'}
                                </span>
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

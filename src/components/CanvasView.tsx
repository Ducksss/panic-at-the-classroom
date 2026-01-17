import { useState } from 'react'
import './CanvasView.css'

interface CanvasViewProps {
    onExit: () => void
}

export function CanvasView({ onExit }: CanvasViewProps) {
    const [activeCourse, setActiveCourse] = useState('CS 301 Database Systems')
    const [expandedModules, setExpandedModules] = useState<string[]>(['week8'])
    const [activeTab, setActiveTab] = useState('Modules')

    const handleCourseClick = (e: React.MouseEvent, course: string) => {
        e.stopPropagation()
        setActiveCourse(course)
    }

    const handleModuleToggle = (e: React.MouseEvent, id: string) => {
        e.stopPropagation()
        setExpandedModules(prev =>
            prev.includes(id) ? prev.filter(m => m !== id) : [...prev, id]
        )
    }

    const handleTabClick = (e: React.MouseEvent, tab: string) => {
        e.stopPropagation()
        setActiveTab(tab)
    }

    return (
        <div className="canvas-view" onClick={onExit}>
            {/* Header */}
            <div className="canvas-header">
                <div className="header-left">
                    <span className="canvas-logo">🎓</span>
                    <span className="nav-item active">Dashboard</span>
                    <span className="nav-item">Courses</span>
                    <span className="nav-item">Calendar</span>
                    <span className="nav-item notification-dot">Inbox</span>
                </div>
                <div className="header-right">
                    <span className="header-icon notification">🔔<span className="notif-badge">3</span></span>
                    <span className="avatar">JS</span>
                </div>
            </div>

            {/* Main Content */}
            <div className="canvas-main">
                {/* Sidebar */}
                <div className="canvas-sidebar">
                    <div className="sidebar-title">Courses</div>
                    {[
                        { name: 'CS 301 Database Systems', color: '#2196f3' },
                        { name: 'CS 350 Operating Systems', color: '#4caf50' },
                        { name: 'MATH 240 Linear Algebra', color: '#ff9800' },
                        { name: 'CS 320 Software Engineering', color: '#9c27b0' },
                    ].map(course => (
                        <div
                            key={course.name}
                            className={`course-item ${activeCourse === course.name ? 'active' : ''}`}
                            onClick={(e) => handleCourseClick(e, course.name)}
                        >
                            <span className="course-color" style={{ background: course.color }}></span>
                            {course.name}
                        </div>
                    ))}
                </div>

                {/* Content Area */}
                <div className="canvas-content">
                    <div className="course-header">
                        <h1>{activeCourse}</h1>
                        <p>Fall 2024 | Dr. Williams | Section 001</p>
                    </div>

                    <div className="course-nav">
                        {['Modules', 'Assignments', 'Grades', 'Discussions', 'Syllabus'].map(tab => (
                            <span
                                key={tab}
                                className={`nav-tab ${activeTab === tab ? 'active' : ''}`}
                                onClick={(e) => handleTabClick(e, tab)}
                            >
                                {tab}
                            </span>
                        ))}
                    </div>

                    <div className="modules-list">
                        <div className="module">
                            <div
                                className="module-header"
                                onClick={(e) => handleModuleToggle(e, 'week8')}
                            >
                                <span className="expand-icon">
                                    {expandedModules.includes('week8') ? '▼' : '▶'}
                                </span>
                                <span className="module-title">Week 8: Database Normalization</span>
                                <span className="module-status published">Published</span>
                            </div>
                            {expandedModules.includes('week8') && (
                                <div className="module-items">
                                    <div className="module-item">
                                        <span className="item-icon">📄</span>
                                        <span className="item-title">Lecture Notes: Normalization</span>
                                        <span className="item-date">Due Oct 28</span>
                                    </div>
                                    <div className="module-item highlight">
                                        <span className="item-icon">📝</span>
                                        <span className="item-title">Assignment 8: Normalization Practice</span>
                                        <span className="item-due">Due Oct 30</span>
                                    </div>
                                    <div className="module-item">
                                        <span className="item-icon">💬</span>
                                        <span className="item-title">Discussion: Real-world Normalization</span>
                                        <span className="item-date"></span>
                                    </div>
                                    <div className="module-item">
                                        <span className="item-icon">📊</span>
                                        <span className="item-title">Quiz 4: Normalization</span>
                                        <span className="item-due">Due Nov 1</span>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="module">
                            <div
                                className="module-header"
                                onClick={(e) => handleModuleToggle(e, 'week7')}
                            >
                                <span className="expand-icon">
                                    {expandedModules.includes('week7') ? '▼' : '▶'}
                                </span>
                                <span className="module-title">Week 7: SQL Advanced Queries</span>
                                <span className="module-status completed">Completed</span>
                            </div>
                            {expandedModules.includes('week7') && (
                                <div className="module-items">
                                    <div className="module-item completed">
                                        <span className="item-icon">✅</span>
                                        <span className="item-title">Lecture Notes: Joins & Subqueries</span>
                                        <span className="item-date">Completed</span>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="module">
                            <div
                                className="module-header"
                                onClick={(e) => handleModuleToggle(e, 'week6')}
                            >
                                <span className="expand-icon">
                                    {expandedModules.includes('week6') ? '▼' : '▶'}
                                </span>
                                <span className="module-title">Week 6: SQL Basics</span>
                                <span className="module-status completed">Completed</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Sidebar - To Do */}
                <div className="canvas-todo">
                    <h3>To Do</h3>
                    <div className="todo-item urgent">
                        <div className="todo-course">CS 301</div>
                        <div className="todo-title">Assignment 8: Normalization</div>
                        <div className="todo-due">Due Oct 30 at 11:59pm</div>
                    </div>
                    <div className="todo-item">
                        <div className="todo-course">CS 350</div>
                        <div className="todo-title">Lab 6: Process Scheduling</div>
                        <div className="todo-due">Due Oct 31 at 11:59pm</div>
                    </div>
                    <div className="todo-item">
                        <div className="todo-course">CS 301</div>
                        <div className="todo-title">Quiz 4: Normalization</div>
                        <div className="todo-due">Due Nov 1 at 11:59pm</div>
                    </div>

                    <h3>Upcoming</h3>
                    <div className="upcoming-item">
                        <div className="upcoming-date">Oct 28</div>
                        <div className="upcoming-title">Lecture: Advanced Normalization</div>
                    </div>
                    <div className="upcoming-item">
                        <div className="upcoming-date">Oct 30</div>
                        <div className="upcoming-title">Lab Session: SQL Practice</div>
                    </div>

                    <div className="recent-grades">
                        <h3>Recent Grades</h3>
                        <div className="grade-item">
                            <span>Quiz 3</span>
                            <span className="grade good">92%</span>
                        </div>
                        <div className="grade-item">
                            <span>Assignment 7</span>
                            <span className="grade good">88%</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="exit-hint">Press ESC or click anywhere to exit</div>
        </div>
    )
}

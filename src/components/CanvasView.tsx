import './CanvasView.css'

interface CanvasViewProps {
    onExit: () => void
}

export function CanvasView({ onExit }: CanvasViewProps) {
    return (
        <div className="canvas-view" onClick={onExit}>
            {/* Header */}
            <div className="canvas-header">
                <div className="header-left">
                    <span className="canvas-logo">🎓</span>
                    <span className="nav-item active">Dashboard</span>
                    <span className="nav-item">Courses</span>
                    <span className="nav-item">Calendar</span>
                    <span className="nav-item">Inbox</span>
                </div>
                <div className="header-right">
                    <span className="header-icon">🔔</span>
                    <span className="avatar">JS</span>
                </div>
            </div>

            {/* Main Content */}
            <div className="canvas-main">
                {/* Sidebar */}
                <div className="canvas-sidebar">
                    <div className="sidebar-title">Courses</div>
                    <div className="course-item active">
                        <span className="course-color" style={{ background: '#2196f3' }}></span>
                        CS 301 Database Systems
                    </div>
                    <div className="course-item">
                        <span className="course-color" style={{ background: '#4caf50' }}></span>
                        CS 350 Operating Systems
                    </div>
                    <div className="course-item">
                        <span className="course-color" style={{ background: '#ff9800' }}></span>
                        MATH 240 Linear Algebra
                    </div>
                    <div className="course-item">
                        <span className="course-color" style={{ background: '#9c27b0' }}></span>
                        CS 320 Software Engineering
                    </div>
                </div>

                {/* Content Area */}
                <div className="canvas-content">
                    <div className="course-header">
                        <h1>CS 301: Database Systems</h1>
                        <p>Fall 2024 | Dr. Williams | Section 001</p>
                    </div>

                    <div className="course-nav">
                        <span className="nav-tab active">Modules</span>
                        <span className="nav-tab">Assignments</span>
                        <span className="nav-tab">Grades</span>
                        <span className="nav-tab">Discussions</span>
                        <span className="nav-tab">Syllabus</span>
                    </div>

                    <div className="modules-list">
                        <div className="module">
                            <div className="module-header">
                                <span className="expand-icon">▼</span>
                                <span className="module-title">Week 8: Database Normalization</span>
                                <span className="module-status published">Published</span>
                            </div>
                            <div className="module-items">
                                <div className="module-item">
                                    <span className="item-icon">📄</span>
                                    <span className="item-title">Lecture Notes: Normalization</span>
                                    <span className="item-date">Due Oct 28</span>
                                </div>
                                <div className="module-item">
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
                        </div>

                        <div className="module">
                            <div className="module-header">
                                <span className="expand-icon">▶</span>
                                <span className="module-title">Week 7: SQL Advanced Queries</span>
                                <span className="module-status completed">Completed</span>
                            </div>
                        </div>

                        <div className="module">
                            <div className="module-header">
                                <span className="expand-icon">▶</span>
                                <span className="module-title">Week 6: SQL Basics</span>
                                <span className="module-status completed">Completed</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Sidebar - To Do */}
                <div className="canvas-todo">
                    <h3>To Do</h3>
                    <div className="todo-item">
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
                </div>
            </div>

            <div className="exit-hint">Press ESC or click anywhere to exit</div>
        </div>
    )
}

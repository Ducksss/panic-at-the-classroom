import { useMemo } from 'react'
import './OutlookView.css'

interface OutlookViewProps {
    onExit: () => void
}

function generateEmails() {
    const senders = [
        { name: 'Prof. Johnson', email: 'johnson@university.edu' },
        { name: 'Academic Office', email: 'academics@university.edu' },
        { name: 'Library Services', email: 'library@university.edu' },
        { name: 'IT Help Desk', email: 'ithelp@university.edu' },
        { name: 'Career Center', email: 'careers@university.edu' },
        { name: 'Student Council', email: 'council@university.edu' },
    ]

    const subjects = [
        { subject: 'RE: Assignment 3 Deadline Extension', preview: 'Thank you for your email. I can grant a 2-day extension...' },
        { subject: 'Important: Final Exam Schedule Update', preview: 'Please note the following changes to the exam schedule...' },
        { subject: 'Library Book Due Reminder', preview: 'This is a reminder that the following items are due...' },
        { subject: 'Password Reset Confirmation', preview: 'Your password has been successfully reset. If you did not...' },
        { subject: 'Career Fair Registration Open', preview: 'Register now for the upcoming Spring Career Fair featuring...' },
        { subject: 'Weekly Newsletter - Campus Events', preview: 'Check out this week\'s exciting events happening on campus...' },
    ]

    return senders.map((sender, i) => ({
        ...sender,
        ...subjects[i],
        time: `${9 + i}:${(i * 7) % 60 < 10 ? '0' : ''}${(i * 7) % 60} AM`,
        unread: i < 2,
        flagged: i === 0,
    }))
}

export function OutlookView({ onExit }: OutlookViewProps) {
    const emails = useMemo(generateEmails, [])

    return (
        <div className="outlook-view" onClick={onExit}>
            {/* Title Bar */}
            <div className="outlook-titlebar">
                <div className="titlebar-left">
                    <span className="outlook-logo">📧</span>
                    <span>Mail - Student Email - Outlook</span>
                </div>
                <div className="titlebar-right">
                    <span className="titlebar-btn">─</span>
                    <span className="titlebar-btn">□</span>
                    <span className="titlebar-btn close">✕</span>
                </div>
            </div>

            {/* Ribbon */}
            <div className="outlook-ribbon">
                <div className="ribbon-tabs">
                    <span className="ribbon-tab active">Home</span>
                    <span className="ribbon-tab">Send / Receive</span>
                    <span className="ribbon-tab">Folder</span>
                    <span className="ribbon-tab">View</span>
                </div>
                <div className="ribbon-toolbar">
                    <button className="ribbon-btn primary">📝 New Email</button>
                    <div className="ribbon-separator"></div>
                    <button className="ribbon-btn">🗑️ Delete</button>
                    <button className="ribbon-btn">📁 Archive</button>
                    <button className="ribbon-btn">🚫 Junk</button>
                    <div className="ribbon-separator"></div>
                    <button className="ribbon-btn">↩️ Reply</button>
                    <button className="ribbon-btn">↩️ Reply All</button>
                    <button className="ribbon-btn">➡️ Forward</button>
                </div>
            </div>

            {/* Main Content */}
            <div className="outlook-content">
                {/* Folder Pane */}
                <div className="folder-pane">
                    <div className="folder-section">
                        <div className="folder-header">Favorites</div>
                        <div className="folder-item active">
                            <span>📥</span> Inbox
                            <span className="unread-badge">12</span>
                        </div>
                        <div className="folder-item">
                            <span>📤</span> Sent Items
                        </div>
                        <div className="folder-item">
                            <span>📝</span> Drafts
                            <span className="unread-badge">2</span>
                        </div>
                    </div>
                    <div className="folder-section">
                        <div className="folder-header">student@university.edu</div>
                        <div className="folder-item">
                            <span>📥</span> Inbox
                        </div>
                        <div className="folder-item">
                            <span>🗑️</span> Deleted Items
                        </div>
                        <div className="folder-item">
                            <span>📁</span> Archive
                        </div>
                        <div className="folder-item">
                            <span>🚫</span> Junk Email
                        </div>
                    </div>
                </div>

                {/* Email List */}
                <div className="email-list">
                    <div className="email-list-header">
                        <span className="search-box">🔍 Search Current Mailbox</span>
                        <span className="filter">All ▼</span>
                    </div>
                    <div className="email-list-title">
                        Inbox <span className="email-count">12 items</span>
                    </div>
                    {emails.map((email, i) => (
                        <div key={i} className={`email-item ${email.unread ? 'unread' : ''} ${i === 0 ? 'selected' : ''}`}>
                            <div className="email-flag">{email.flagged ? '🚩' : ''}</div>
                            <div className="email-content">
                                <div className="email-sender">{email.name}</div>
                                <div className="email-subject">{email.subject}</div>
                                <div className="email-preview">{email.preview}</div>
                            </div>
                            <div className="email-time">{email.time}</div>
                        </div>
                    ))}
                </div>

                {/* Reading Pane */}
                <div className="reading-pane">
                    <div className="email-header">
                        <div className="email-sender-large">Prof. Johnson</div>
                        <div className="email-subject-large">RE: Assignment 3 Deadline Extension</div>
                        <div className="email-meta">
                            <span>To: You</span>
                            <span className="email-date">Today, 9:00 AM</span>
                        </div>
                    </div>
                    <div className="email-body">
                        <p>Dear Student,</p>
                        <p>Thank you for your email regarding the Assignment 3 deadline. I understand that you've been dealing with technical difficulties.</p>
                        <p>I can grant you a 2-day extension. Please submit your assignment by Friday, 11:59 PM.</p>
                        <p>Make sure to document your work properly and include all required citations.</p>
                        <p>Best regards,<br />Prof. Johnson</p>
                        <p className="email-signature">
                            <strong>Dr. Sarah Johnson</strong><br />
                            Associate Professor, Computer Science<br />
                            University of Technology<br />
                            Office: Room 412, Science Building
                        </p>
                    </div>
                </div>
            </div>

            {/* Status Bar */}
            <div className="outlook-statusbar">
                <span>Connected to Exchange</span>
                <span>All folders are up to date</span>
            </div>

            <div className="exit-hint">Press ESC or click anywhere to exit</div>
        </div>
    )
}

import { useMemo, useState, useEffect } from 'react'
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
        { name: 'Prof. Smith', email: 'smith@university.edu' },
        { name: 'Financial Aid', email: 'finaid@university.edu' },
    ]

    const subjects = [
        { subject: 'RE: Assignment 3 Deadline Extension', preview: 'Thank you for your email. I can grant a 2-day extension...', body: 'Dear Student,\n\nThank you for your email regarding the Assignment 3 deadline. I understand that you\'ve been dealing with technical difficulties.\n\nI can grant you a 2-day extension. Please submit your assignment by Friday, 11:59 PM.\n\nMake sure to document your work properly and include all required citations.\n\nBest regards,\nProf. Johnson' },
        { subject: 'Important: Final Exam Schedule Update', preview: 'Please note the following changes to the exam schedule...', body: 'Dear Students,\n\nPlease note that the final exam schedule has been updated. Your CS301 exam will now be held on December 15th at 2:00 PM in Hall A.\n\nPlease arrive 15 minutes early.\n\nAcademic Office' },
        { subject: 'Library Book Due Reminder', preview: 'This is a reminder that the following items are due...', body: 'Hello,\n\nThis is a friendly reminder that the following items are due for return:\n\n- "Data Structures and Algorithms" - Due: Tomorrow\n- "Introduction to Machine Learning" - Due: Next Week\n\nPlease return or renew these items to avoid late fees.\n\nLibrary Services' },
        { subject: 'Password Reset Confirmation', preview: 'Your password has been successfully reset. If you did not...', body: 'Your university account password has been successfully reset.\n\nIf you did not request this change, please contact IT Help Desk immediately.\n\nIT Help Desk\nPhone: (555) 123-4567' },
        { subject: 'Career Fair Registration Open', preview: 'Register now for the upcoming Spring Career Fair featuring...', body: 'Dear Student,\n\nThe Spring Career Fair is coming! Over 50 companies will be participating.\n\nDate: March 15th\nTime: 10:00 AM - 4:00 PM\nLocation: University Center\n\nRegister now to secure your spot!\n\nCareer Center' },
        { subject: 'Weekly Newsletter - Campus Events', preview: 'Check out this week\'s exciting events happening on campus...', body: 'This Week on Campus:\n\n• Monday: Guest Lecture on AI Ethics\n• Wednesday: Club Fair\n• Friday: Movie Night\n\nStudent Council' },
        { subject: 'Office Hours This Week', preview: 'My office hours have been rescheduled to Thursday...', body: 'Dear Students,\n\nPlease note that my office hours this week have been rescheduled to Thursday 2-4 PM due to a faculty meeting.\n\nProf. Smith' },
        { subject: 'Financial Aid Application Status', preview: 'Your financial aid application has been received...', body: 'Your financial aid application for the upcoming semester has been received and is under review.\n\nExpected decision: Within 2-3 weeks.\n\nFinancial Aid Office' },
    ]

    return senders.map((sender, i) => ({
        ...sender,
        ...subjects[i],
        time: `${9 + i}:${(i * 7) % 60 < 10 ? '0' : ''}${(i * 7) % 60} AM`,
        unread: i < 3,
        flagged: i === 0,
        id: i,
    }))
}

export function OutlookView({ onExit }: OutlookViewProps) {
    const emails = useMemo(generateEmails, [])
    const [selectedEmail, setSelectedEmail] = useState(0)
    const [activeFolder, setActiveFolder] = useState('Inbox')
    const [isTyping, setIsTyping] = useState(false)

    // Simulate typing in the reading pane
    useEffect(() => {
        const interval = setInterval(() => {
            setIsTyping(true)
            setTimeout(() => setIsTyping(false), 2000)
        }, 8000)
        return () => clearInterval(interval)
    }, [])

    const handleEmailClick = (e: React.MouseEvent, id: number) => {
        e.stopPropagation()
        setSelectedEmail(id)
    }

    const handleFolderClick = (e: React.MouseEvent, folder: string) => {
        e.stopPropagation()
        setActiveFolder(folder)
    }

    const currentEmail = emails[selectedEmail]

    return (
        <div className="outlook-view" onClick={onExit}>
            {/* Title Bar */}
            <div className="outlook-titlebar">
                <div className="titlebar-left">
                    <span className="outlook-logo">📧</span>
                    <span>Mail - Student Email - Outlook</span>
                </div>
                <div className="titlebar-right">
                    <span className="sync-status">🔄 Synced</span>
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
                        <div
                            className={`folder-item ${activeFolder === 'Inbox' ? 'active' : ''}`}
                            onClick={(e) => handleFolderClick(e, 'Inbox')}
                        >
                            <span>📥</span> Inbox
                            <span className="unread-badge">12</span>
                        </div>
                        <div
                            className={`folder-item ${activeFolder === 'Sent' ? 'active' : ''}`}
                            onClick={(e) => handleFolderClick(e, 'Sent')}
                        >
                            <span>📤</span> Sent Items
                        </div>
                        <div
                            className={`folder-item ${activeFolder === 'Drafts' ? 'active' : ''}`}
                            onClick={(e) => handleFolderClick(e, 'Drafts')}
                        >
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
                        {activeFolder} <span className="email-count">{emails.length} items</span>
                    </div>
                    {emails.map((email) => (
                        <div
                            key={email.id}
                            className={`email-item ${email.unread ? 'unread' : ''} ${selectedEmail === email.id ? 'selected' : ''}`}
                            onClick={(e) => handleEmailClick(e, email.id)}
                        >
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
                        <div className="email-sender-large">{currentEmail.name}</div>
                        <div className="email-subject-large">{currentEmail.subject}</div>
                        <div className="email-meta">
                            <span>To: You &lt;student@university.edu&gt;</span>
                            <span className="email-date">Today, {currentEmail.time}</span>
                        </div>
                    </div>
                    <div className="email-body">
                        {currentEmail.body.split('\n').map((line, i) => (
                            <p key={i}>{line || <br />}</p>
                        ))}
                        <div className="email-signature">
                            <strong>{currentEmail.name}</strong><br />
                            {currentEmail.email}
                        </div>
                    </div>
                    {isTyping && (
                        <div className="typing-indicator">
                            <span className="typing-dot"></span>
                            <span className="typing-dot"></span>
                            <span className="typing-dot"></span>
                            Composing reply...
                        </div>
                    )}
                </div>
            </div>

            {/* Status Bar */}
            <div className="outlook-statusbar">
                <span>Connected to Exchange</span>
                <span className="status-sync">✓ All folders are up to date</span>
            </div>

            <div className="exit-hint">Press ESC or click anywhere to exit</div>
        </div>
    )
}

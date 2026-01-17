# 🚨 Panic at the Classroom

> AI-powered teacher detection that instantly switches your screen to a convincing "work" interface!

![Dashboard](docs/dashboard.png)

## 🎯 What is this?

An Electron desktop app that:
1. **Monitors your webcam** in the background
2. **Detects registered teacher faces** using AI (face-api.js)
3. **Instantly switches** to a fake "productive" interface when detected
4. **Covers ALL applications** with a fullscreen overlay

## ✨ Features

### 👁️ Face Detection
- Register multiple teacher faces
- Real-time face recognition at 30 FPS
- Adjustable detection threshold (0.4 = strict)
- Background monitoring (works when minimized)

### 🎭 5 Panic Interfaces

| Interface | Description |
|-----------|-------------|
| 📊 **Excel** | Financial spreadsheet with live charts |
| 💻 **VS Code** | Python ML code with blinking cursor |
| 📧 **Outlook** | Email inbox with reading pane |
| 📝 **Notion** | Study notes with checkboxes |
| 🎓 **Canvas** | LMS with assignments and grades |

All interfaces are **interactive** with:
- Cursor animations
- Clickable elements
- Simulated activity
- Realistic styling

### ⚡ Quick Access
- **Global hotkey**: `Ctrl+Shift+P` for instant panic
- **System tray**: Runs in background
- **Manual button**: Emergency panic button in dashboard

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Run in development
npm run dev

# Build for production
npm run build
```

## 🎮 Usage

1. **Launch the app**
2. Click **"Register Teacher"** and capture a face
3. Select your preferred **panic interface** (Excel, VS Code, etc.)
4. Click **"Start Monitoring"**
5. **Minimize** - monitoring continues in background!

When a registered face is detected → Screen instantly switches!

## 🛠️ Tech Stack

- **Electron** - Desktop app framework
- **React + TypeScript** - Frontend
- **face-api.js** - Face detection/recognition
- **Recharts** - Excel charts
- **Vite** - Build tool

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl+Shift+P` | Toggle panic mode |
| `Escape` | Exit panic mode |

## 📁 Project Structure

```
src/
├── components/
│   ├── Dashboard.tsx      # Main control panel
│   ├── FaceDetector.tsx   # Camera & face recognition
│   ├── ExcelView.tsx      # Fake Excel interface
│   ├── VSCodeView.tsx     # Fake VS Code interface
│   ├── OutlookView.tsx    # Fake Outlook interface
│   ├── NotionView.tsx     # Fake Notion interface
│   └── CanvasView.tsx     # Fake Canvas LMS interface
├── App.tsx                # Main app component
└── main.tsx              # React entry point

electron/
├── main.ts               # Electron main process
└── preload.ts           # IPC bridge
```

## 🎓 Hackathon Project

Built for maximum panic-prevention efficiency! 🏃‍♂️💨

---

*Made with 💚 and a lot of caffeine*

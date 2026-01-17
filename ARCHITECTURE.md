# 🏗️ Panic at the Classroom - System Architecture

> **Platform:** Electron Desktop App - Covers ALL applications with fullscreen overlay

## High-Level Architecture

```mermaid
flowchart TB
    subgraph Client["🖥️ Client Application (Electron/Web)"]
        subgraph UI["User Interface Layer"]
            MainView["Main Dashboard"]
            subgraph PanicViews["🎭 Panic Interfaces"]
                ExcelView["📊 Excel"]
                VSCodeView["💻 VS Code"]
                OutlookView["📧 Outlook"]
                NotionView["📝 Notion"]
                CanvasView["🎓 Canvas LMS"]
            end
            Settings["⚙️ Interface Selector"]
            FaceReg["👤 Face Registration"]
        end
        
        subgraph Core["Core Logic Layer"]
            StateManager["State Manager"]
            PanicController["🚨 Panic Controller"]
            HotkeyHandler["⌨️ Hotkey Handler"]
            InterfaceSelector["Interface Selector"]
        end
        
        subgraph AI["AI/Camera Layer"]
            CameraService["📷 Camera Service"]
            FaceDetector["Face Detector"]
            FaceRecognizer["Face Recognizer"]
            ModelStore["📁 Model Storage"]
        end
    end
    
    subgraph External["External Libraries"]
        TensorFlow["TensorFlow.js"]
        FaceAPI["face-api.js"]
        Recharts["Recharts"]
        WebRTC["WebRTC API"]
    end
    
    CameraService --> WebRTC
    FaceDetector --> TensorFlow
    FaceRecognizer --> FaceAPI
    PanicViews --> Recharts
    
    CameraService --> FaceDetector
    FaceDetector --> FaceRecognizer
    FaceRecognizer --> PanicController
    PanicController --> InterfaceSelector
    InterfaceSelector --> PanicViews
    HotkeyHandler --> PanicController
    ModelStore --> FaceRecognizer
```

---

## Detection Flow Architecture

```mermaid
flowchart LR
    subgraph Input["📷 Input"]
        Webcam["Webcam"]
    end
    
    subgraph Processing["🧠 Processing Pipeline"]
        direction TB
        Frame["Capture Frame<br/>(30 FPS)"]
        Resize["Resize & Optimize<br/>(320x240)"]
        Detect["Face Detection<br/>(TinyFace)"]
        Extract["Extract Face<br/>Landmarks"]
        Encode["Generate Face<br/>Descriptor"]
        Compare["Compare Against<br/>Registered Faces<br/>(Threshold: 0.4)"]
    end
    
    subgraph Decision["⚡ Decision"]
        Threshold{"Match<br/>Distance?"}
        Teacher["🚨 TEACHER<br/>DETECTED"]
        Safe["✅ SAFE"]
    end
    
    subgraph Action["🎬 Action"]
        SelectView["Select<br/>Interface"]
        Switch["Switch to<br/>Panic View"]
        Continue["Continue<br/>Monitoring"]
    end
    
    Webcam --> Frame --> Resize --> Detect --> Extract --> Encode --> Compare
    Compare --> Threshold
    Threshold -->|< 0.4| Teacher --> SelectView --> Switch
    Threshold -->|>= 0.4| Safe --> Continue
    Continue -.->|Loop| Frame
```

---

## Panic Interface Components

```mermaid
flowchart TB
    subgraph InterfaceSelector["🎨 Interface Selector"]
        Excel["📊 Excel"]
        VSCode["💻 VS Code"]
        Outlook["📧 Outlook"]
        Notion["📝 Notion"]
        Canvas["🎓 Canvas"]
    end
    
    subgraph ExcelInterface["📊 Excel Interface"]
        direction TB
        ExcelGrid["Cell Grid + Selection"]
        ExcelCharts["Bar/Line/Pie Charts"]
        ExcelTabs["Sheet Tabs"]
        ExcelFormula["Formula Bar + Cursor"]
    end
    
    subgraph VSCodeInterface["💻 VS Code Interface"]
        direction TB
        VSCodeExplorer["File Explorer"]
        VSCodeEditor["Code Editor + Cursor"]
        VSCodeMinimap["Minimap"]
        VSCodeStatus["Status Bar + Sync"]
    end
    
    subgraph OutlookInterface["📧 Outlook Interface"]
        direction TB
        OutlookFolders["Folder Pane"]
        OutlookList["Email List"]
        OutlookReading["Reading Pane"]
        OutlookTyping["Typing Indicator"]
    end
    
    subgraph NotionInterface["📝 Notion Interface"]
        direction TB
        NotionSidebar["Page Sidebar"]
        NotionContent["Notes Content"]
        NotionTodos["Interactive Checkboxes"]
        NotionToggles["Expandable Toggles"]
    end
    
    subgraph CanvasInterface["🎓 Canvas Interface"]
        direction TB
        CanvasCourses["Course Sidebar"]
        CanvasModules["Expandable Modules"]
        CanvasTodo["To-Do List"]
        CanvasGrades["Recent Grades"]
    end
    
    Excel --> ExcelInterface
    VSCode --> VSCodeInterface
    Outlook --> OutlookInterface
    Notion --> NotionInterface
    Canvas --> CanvasInterface
```

---

## State Machine

```mermaid
stateDiagram-v2
    [*] --> Idle: App Launch
    
    Idle --> Registering: Register Teacher
    Registering --> Idle: Face Captured
    
    Idle --> Monitoring: Start Protection
    Monitoring --> Idle: Stop Protection
    
    Monitoring --> Analyzing: Face Detected
    Analyzing --> Monitoring: Unknown Face
    Analyzing --> PanicMode: Teacher Match!
    
    PanicMode --> SelectedView: Load Interface
    SelectedView --> Monitoring: ESC / Click
    
    state SelectedView {
        [*] --> Excel
        Excel --> VSCode: User Preference
        VSCode --> Outlook: User Preference
        Outlook --> Notion: User Preference
        Notion --> Canvas: User Preference
    }
    
    state Monitoring {
        [*] --> CameraActive
        CameraActive --> FrameCapture
        FrameCapture --> FaceDetection
        FaceDetection --> CameraActive
    }
```

---

## Interactive Features

```mermaid
flowchart TB
    subgraph Animations["🎬 Animations & Interactivity"]
        subgraph ExcelAnim["Excel"]
            CellSelect["Cell Selection"]
            FormulaCursor["Formula Cursor Blink"]
            Saving["Saving... Animation"]
            SheetSwitch["Sheet Tab Switch"]
        end
        
        subgraph VSCodeAnim["VS Code"]
            CodeCursor["Blinking Cursor"]
            LineHighlight["Current Line"]
            FileSelect["File Selection"]
            SyncAnim["Syncing Animation"]
        end
        
        subgraph OutlookAnim["Outlook"]
            EmailSelect["Email Selection"]
            TypingDots["Typing Indicator"]
            FolderNav["Folder Navigation"]
            SyncStatus["Sync Status"]
        end
        
        subgraph NotionAnim["Notion"]
            TodoCheck["Checkbox Toggle"]
            ToggleExpand["Block Expand/Collapse"]
            PageNav["Page Navigation"]
            EditIndicator["Editing Indicator"]
        end
        
        subgraph CanvasAnim["Canvas"]
            ModuleExpand["Module Expand"]
            TabSwitch["Tab Navigation"]
            UrgentPulse["Urgent Item Pulse"]
            GradeDisplay["Grade Display"]
        end
    end
```

---

## Technology Stack

```mermaid
flowchart TB
    subgraph Frontend["Frontend Stack"]
        direction LR
        React["⚛️ React 18"]
        TypeScript["📘 TypeScript"]
        CSS["🎨 CSS Modules"]
    end
    
    subgraph Desktop["Electron Desktop App"]
        Electron["⚡ Electron"]
        Tray["🔲 System Tray"]
        Overlay["📺 Fullscreen Overlay"]
        Hotkeys["⌨️ Global Hotkeys"]
        Background["🔄 Background Monitoring"]
    end
    
    subgraph AI_ML["AI/ML Stack"]
        direction LR
        TF["TensorFlow.js"]
        FaceAPI["face-api.js"]
        WebGL["WebGL Backend"]
    end
    
    subgraph Visualization["Data Visualization"]
        direction LR
        Recharts["Recharts"]
        Canvas["HTML5 Canvas"]
    end
    
    subgraph Media["Media APIs"]
        direction LR
        WebRTC["WebRTC"]
        MediaDevices["MediaDevices API"]
    end
    
    Frontend --> Desktop
    Desktop --> AI_ML
    Desktop --> Visualization
    Desktop --> Media
```

---

## Sequence Diagram - Full Flow

```mermaid
sequenceDiagram
    autonumber
    participant U as 👤 User
    participant A as 📱 App
    participant C as 📷 Camera
    participant D as 🧠 Detector
    participant R as 🔍 Recognizer
    participant I as 🎨 Interface Selector
    participant V as 📊 Panic View
    
    Note over U,V: 🎬 Initial Setup
    U->>A: Launch Application
    A->>C: Request Camera Access
    C-->>A: Permission Granted
    U->>A: Register Teacher's Face
    A->>D: Capture Face Frames
    D->>R: Generate Face Descriptor
    R-->>A: Face Registered ✅
    U->>I: Select Panic Interface (e.g., VS Code)
    
    Note over U,V: 🔄 Monitoring Loop
    loop Every 33ms (30 FPS)
        C->>D: Send Video Frame
        D->>D: Detect Faces in Frame
        alt Face Found
            D->>R: Extract & Compare
            alt Teacher Match (< 0.4 distance)
                R->>A: 🚨 ALERT: Teacher Detected!
                A->>I: Get Selected Interface
                I->>V: Activate Panic View
                V-->>U: Display Selected Interface
                Note over V: User sees "work"<br/>with animations
            else Unknown Face
                R-->>A: Safe, Continue
            end
        else No Face
            D-->>A: No Detection
        end
    end
    
    Note over U,V: 🔙 Return to Normal
    U->>V: Press ESC / Click
    V->>A: Exit Panic Mode
    A-->>U: Return to Dashboard
```

---

*📐 Architecture designed for speed, reliability, and maximum panic-prevention efficiency!*

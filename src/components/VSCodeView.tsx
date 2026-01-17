import { useMemo } from 'react'
import './VSCodeView.css'

interface VSCodeViewProps {
    onExit: () => void
}

// Generate realistic Python code
function generateCode() {
    return `import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report

# Load and preprocess the dataset
def load_data(filepath: str) -> pd.DataFrame:
    """Load dataset from CSV file and perform initial cleaning."""
    df = pd.read_csv(filepath)
    df = df.dropna()
    df = df.drop_duplicates()
    return df

def preprocess_features(df: pd.DataFrame) -> tuple:
    """Extract features and target variable."""
    X = df.drop(['target', 'id'], axis=1)
    y = df['target']
    
    # Normalize numerical features
    numerical_cols = X.select_dtypes(include=[np.number]).columns
    X[numerical_cols] = (X[numerical_cols] - X[numerical_cols].mean()) / X[numerical_cols].std()
    
    return X, y

def train_model(X_train, y_train, n_estimators=100):
    """Train a Random Forest classifier."""
    model = RandomForestClassifier(
        n_estimators=n_estimators,
        max_depth=10,
        random_state=42,
        n_jobs=-1
    )
    model.fit(X_train, y_train)
    return model

def evaluate_model(model, X_test, y_test):
    """Evaluate model performance."""
    predictions = model.predict(X_test)
    accuracy = accuracy_score(y_test, predictions)
    report = classification_report(y_test, predictions)
    
    print(f"Model Accuracy: {accuracy:.4f}")
    print("\\nClassification Report:")
    print(report)
    
    return accuracy, report

if __name__ == "__main__":
    # Main execution
    df = load_data("data/training_data.csv")
    X, y = preprocess_features(df)
    
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42
    )
    
    model = train_model(X_train, y_train)
    accuracy, report = evaluate_model(model, X_test, y_test)
    
    # Save model
    import joblib
    joblib.dump(model, "models/classifier_v1.pkl")
    print("Model saved successfully!")`
}

export function VSCodeView({ onExit }: VSCodeViewProps) {
    const code = useMemo(generateCode, [])
    const lines = code.split('\n')

    return (
        <div className="vscode-view" onClick={onExit}>
            {/* Title Bar */}
            <div className="vscode-titlebar">
                <div className="titlebar-left">
                    <span className="vscode-logo">⬡</span>
                    <span className="menu-item">File</span>
                    <span className="menu-item">Edit</span>
                    <span className="menu-item">Selection</span>
                    <span className="menu-item">View</span>
                    <span className="menu-item">Go</span>
                    <span className="menu-item">Run</span>
                    <span className="menu-item">Terminal</span>
                    <span className="menu-item">Help</span>
                </div>
                <div className="titlebar-center">
                    ml_classifier.py - data_analysis - Visual Studio Code
                </div>
                <div className="titlebar-right">
                    <span className="titlebar-btn">─</span>
                    <span className="titlebar-btn">□</span>
                    <span className="titlebar-btn close">✕</span>
                </div>
            </div>

            {/* Main Content */}
            <div className="vscode-content">
                {/* Activity Bar */}
                <div className="activity-bar">
                    <div className="activity-icon active">📁</div>
                    <div className="activity-icon">🔍</div>
                    <div className="activity-icon">⎇</div>
                    <div className="activity-icon">🐛</div>
                    <div className="activity-icon">📦</div>
                    <div className="activity-spacer"></div>
                    <div className="activity-icon">⚙️</div>
                </div>

                {/* Sidebar */}
                <div className="sidebar">
                    <div className="sidebar-header">EXPLORER</div>
                    <div className="folder open">
                        <span>📂 data_analysis</span>
                    </div>
                    <div className="file">📄 .gitignore</div>
                    <div className="file">📄 README.md</div>
                    <div className="file">📄 requirements.txt</div>
                    <div className="folder">
                        <span>📁 data</span>
                    </div>
                    <div className="folder">
                        <span>📁 models</span>
                    </div>
                    <div className="folder open">
                        <span>📂 src</span>
                    </div>
                    <div className="file nested">📄 __init__.py</div>
                    <div className="file nested active">🐍 ml_classifier.py</div>
                    <div className="file nested">📄 data_loader.py</div>
                    <div className="file nested">📄 utils.py</div>
                </div>

                {/* Editor */}
                <div className="editor-area">
                    {/* Tabs */}
                    <div className="editor-tabs">
                        <div className="tab active">
                            <span>🐍</span> ml_classifier.py
                            <span className="tab-close">×</span>
                        </div>
                        <div className="tab">
                            <span>📄</span> utils.py
                        </div>
                    </div>

                    {/* Breadcrumb */}
                    <div className="breadcrumb">
                        src › ml_classifier.py › train_model
                    </div>

                    {/* Code Editor */}
                    <div className="code-editor">
                        <div className="line-numbers">
                            {lines.map((_, i) => (
                                <div key={i} className="line-number">{i + 1}</div>
                            ))}
                        </div>
                        <pre className="code-content">
                            <code>{code}</code>
                        </pre>
                    </div>
                </div>

                {/* Minimap */}
                <div className="minimap">
                    <div className="minimap-content"></div>
                </div>
            </div>

            {/* Status Bar */}
            <div className="vscode-statusbar">
                <div className="status-left">
                    <span className="status-item">⎇ main</span>
                    <span className="status-item">🔄 0</span>
                    <span className="status-item">⚠️ 0</span>
                </div>
                <div className="status-right">
                    <span className="status-item">Ln 42, Col 18</span>
                    <span className="status-item">Spaces: 4</span>
                    <span className="status-item">UTF-8</span>
                    <span className="status-item">Python</span>
                    <span className="status-item">🔔</span>
                </div>
            </div>

            <div className="exit-hint">Press ESC or click anywhere to exit</div>
        </div>
    )
}

import { useMemo, useState, useEffect } from 'react'
import {
    BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
    XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts'
import './ExcelView.css'

interface ExcelViewProps {
    onExit: () => void
}

// Generate random financial data
function generateData() {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    return months.map(month => ({
        month,
        revenue: Math.floor(Math.random() * 50000) + 30000,
        expenses: Math.floor(Math.random() * 30000) + 15000,
        profit: Math.floor(Math.random() * 20000) + 5000
    }))
}

function generatePieData() {
    return [
        { name: 'Operations', value: Math.floor(Math.random() * 3000) + 2000 },
        { name: 'Marketing', value: Math.floor(Math.random() * 2000) + 1000 },
        { name: 'R&D', value: Math.floor(Math.random() * 2500) + 1500 },
        { name: 'Admin', value: Math.floor(Math.random() * 1500) + 500 },
        { name: 'Other', value: Math.floor(Math.random() * 1000) + 300 }
    ]
}

const COLORS = ['#217346', '#4472C4', '#ED7D31', '#FFC000', '#70AD47']

export function ExcelView({ onExit }: ExcelViewProps) {
    const barData = useMemo(generateData, [])
    const pieData = useMemo(generatePieData, [])

    // Interactive state
    const [selectedCell, setSelectedCell] = useState({ row: 5, col: 3 })
    const [activeSheet, setActiveSheet] = useState('Summary')
    const [formulaCell, setFormulaCell] = useState('H12')
    const [formula, setFormula] = useState('=SUM(B12:G12)*1.15')

    // Simulate cell selection movement
    useEffect(() => {
        const interval = setInterval(() => {
            setSelectedCell(prev => ({
                row: Math.max(1, Math.min(14, prev.row + Math.floor(Math.random() * 3) - 1)),
                col: Math.max(1, Math.min(7, prev.col + Math.floor(Math.random() * 3) - 1))
            }))
        }, 4000)
        return () => clearInterval(interval)
    }, [])

    // Update formula bar when cell changes
    useEffect(() => {
        const cols = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']
        setFormulaCell(`${cols[selectedCell.col]}${selectedCell.row}`)
        const formulas = [
            '=SUM(B2:B14)',
            '=AVERAGE(C2:C14)',
            '=IF(D5>1000,"High","Low")',
            '=VLOOKUP(A5,Data!A:B,2,FALSE)',
            '=D5*1.15-E5',
            '=(F5-G5)/F5*100'
        ]
        setFormula(formulas[Math.floor(Math.random() * formulas.length)])
    }, [selectedCell])

    // Generate spreadsheet cells
    const spreadsheetData = useMemo(() => {
        const rows = []
        for (let i = 0; i < 15; i++) {
            const row = []
            for (let j = 0; j < 8; j++) {
                if (i === 0) {
                    row.push(['Category', 'Q1', 'Q2', 'Q3', 'Q4', 'Total', 'Change', 'Status'][j])
                } else if (j === 0) {
                    const categories = ['Revenue', 'COGS', 'Gross Profit', 'Operating Exp', 'Marketing', 'R&D',
                        'Admin', 'EBITDA', 'Depreciation', 'EBIT', 'Interest', 'Tax', 'Net Income', 'EPS']
                    row.push(categories[i - 1] || '')
                } else if (j === 7) {
                    row.push(Math.random() > 0.5 ? '✓' : '○')
                } else if (j === 6) {
                    const change = (Math.random() * 40 - 10).toFixed(1)
                    row.push(`${Number(change) > 0 ? '+' : ''}${change}%`)
                } else {
                    row.push((Math.floor(Math.random() * 90000) + 10000).toLocaleString())
                }
            }
            rows.push(row)
        }
        return rows
    }, [])

    const handleCellClick = (e: React.MouseEvent, row: number, col: number) => {
        e.stopPropagation()
        if (row > 0 && col > 0) {
            setSelectedCell({ row, col })
        }
    }

    const handleSheetClick = (e: React.MouseEvent, sheet: string) => {
        e.stopPropagation()
        setActiveSheet(sheet)
    }

    return (
        <div className="excel-view" onClick={onExit}>
            {/* Title Bar */}
            <div className="excel-titlebar">
                <div className="titlebar-left">
                    <span className="excel-icon">📊</span>
                    <span>Q4_Financial_Analysis_2024.xlsx - Excel</span>
                </div>
                <div className="titlebar-right">
                    <span className="saving-indicator">💾 Saving...</span>
                    <span className="titlebar-btn">─</span>
                    <span className="titlebar-btn">□</span>
                    <span className="titlebar-btn close">✕</span>
                </div>
            </div>

            {/* Ribbon */}
            <div className="excel-ribbon">
                <div className="ribbon-tabs">
                    <span className="ribbon-tab">File</span>
                    <span className="ribbon-tab active">Home</span>
                    <span className="ribbon-tab">Insert</span>
                    <span className="ribbon-tab">Page Layout</span>
                    <span className="ribbon-tab">Formulas</span>
                    <span className="ribbon-tab">Data</span>
                    <span className="ribbon-tab">Review</span>
                    <span className="ribbon-tab">View</span>
                </div>
                <div className="ribbon-toolbar">
                    <div className="toolbar-group">
                        <button className="toolbar-btn">📋 Paste</button>
                        <button className="toolbar-btn">✂️ Cut</button>
                        <button className="toolbar-btn">📄 Copy</button>
                    </div>
                    <div className="toolbar-separator"></div>
                    <div className="toolbar-group">
                        <select className="toolbar-select">
                            <option>Calibri</option>
                        </select>
                        <select className="toolbar-select small">
                            <option>11</option>
                        </select>
                        <button className="toolbar-btn small">B</button>
                        <button className="toolbar-btn small">I</button>
                        <button className="toolbar-btn small">U</button>
                    </div>
                    <div className="toolbar-separator"></div>
                    <div className="toolbar-group">
                        <button className="toolbar-btn">🔢 AutoSum</button>
                        <button className="toolbar-btn">📊 Chart</button>
                        <button className="toolbar-btn">🔍 Filter</button>
                    </div>
                </div>
            </div>

            {/* Formula Bar */}
            <div className="excel-formula-bar">
                <div className="cell-name">{formulaCell}</div>
                <div className="formula-input">
                    <span className="formula-text">{formula}</span>
                    <span className="formula-cursor">|</span>
                </div>
            </div>

            {/* Main Content */}
            <div className="excel-content">
                {/* Spreadsheet */}
                <div className="spreadsheet">
                    <table>
                        <tbody>
                            {spreadsheetData.map((row, i) => (
                                <tr key={i} className={i === 0 ? 'header-row' : ''}>
                                    <td className="row-header">{i === 0 ? '' : i}</td>
                                    {row.map((cell, j) => (
                                        <td
                                            key={j}
                                            onClick={(e) => handleCellClick(e, i, j)}
                                            className={`
                                                ${j === 0 ? 'col-header' : ''} 
                                                ${i === 0 ? 'header-cell' : ''}
                                                ${selectedCell.row === i && selectedCell.col === j ? 'selected-cell' : ''}
                                                ${cell.toString().includes('%') ? (cell.toString().startsWith('+') ? 'positive' : 'negative') : ''}
                                                ${cell === '✓' ? 'status-ok' : ''}
                                            `}
                                        >
                                            {cell}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Charts Section */}
                <div className="charts-section">
                    <div className="chart-container">
                        <h3>Revenue vs Expenses (Monthly)</h3>
                        <ResponsiveContainer width="100%" height={200}>
                            <BarChart data={barData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                                <YAxis tick={{ fontSize: 10 }} />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="revenue" fill="#217346" name="Revenue" />
                                <Bar dataKey="expenses" fill="#4472C4" name="Expenses" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="chart-container">
                        <h3>Profit Trend Analysis</h3>
                        <ResponsiveContainer width="100%" height={200}>
                            <LineChart data={barData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                                <YAxis tick={{ fontSize: 10 }} />
                                <Tooltip />
                                <Legend />
                                <Line type="monotone" dataKey="profit" stroke="#ED7D31" strokeWidth={2} name="Net Profit" />
                                <Line type="monotone" dataKey="revenue" stroke="#217346" strokeWidth={2} name="Revenue" />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="chart-container">
                        <h3>Expense Distribution</h3>
                        <ResponsiveContainer width="100%" height={200}>
                            <PieChart>
                                <Pie
                                    data={pieData}
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={70}
                                    fill="#8884d8"
                                    dataKey="value"
                                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                    labelLine={false}
                                >
                                    {pieData.map((_, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Sheet Tabs */}
            <div className="excel-sheet-tabs">
                {['Summary', 'Q4 Data', 'Charts', 'Budget 2024', 'Projections'].map(sheet => (
                    <div
                        key={sheet}
                        className={`sheet-tab ${activeSheet === sheet ? 'active' : ''}`}
                        onClick={(e) => handleSheetClick(e, sheet)}
                    >
                        {sheet}
                    </div>
                ))}
                <div className="sheet-add">+</div>
            </div>

            {/* Status Bar */}
            <div className="excel-statusbar">
                <div className="status-left">
                    <span className="status-ready">Ready</span>
                    <span className="status-calculating">⟳ Calculating...</span>
                </div>
                <div className="status-right">
                    <span>Average: $45,678</span>
                    <span>Count: 156</span>
                    <span>Sum: $7,125,168</span>
                    <span className="zoom">100%</span>
                </div>
            </div>

            {/* Hint overlay */}
            <div className="exit-hint">Press ESC or click anywhere to exit</div>
        </div>
    )
}

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getResolution, logProgress, getProgressPercent, deleteResolution } from '../services/resolutionService';
import FeedbackPanel from '../components/FeedbackPanel';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Tooltip,
    Legend,
    Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import './ResolutionDetailPage.css';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend, Filler);

const CATEGORY_ICONS = { financial: '💰', spiritual: '📖', custom: '✨' };

export default function ResolutionDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [resolution, setResolution] = useState(null);
    const [logAmount, setLogAmount] = useState('');
    const [logNote, setLogNote] = useState('');
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    useEffect(() => {
        const r = getResolution(id);
        if (!r) {
            navigate('/resolutions');
            return;
        }
        setResolution(r);
    }, [id]);

    if (!resolution) return null;

    const percent = getProgressPercent(resolution);
    const remaining = Math.max(0, resolution.target - resolution.current);

    const handleLog = (e) => {
        e.preventDefault();
        if (!logAmount || Number(logAmount) <= 0) return;
        const updated = logProgress(resolution.id, { amount: Number(logAmount), note: logNote });
        setResolution(updated);
        setLogAmount('');
        setLogNote('');
    };

    const handleDelete = () => {
        deleteResolution(resolution.id);
        navigate('/resolutions');
    };

    // Build line chart from entries
    const sortedEntries = [...resolution.entries].sort((a, b) => new Date(a.date) - new Date(b.date));
    let cumulative = 0;
    const chartLabels = sortedEntries.map(e => new Date(e.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
    const chartData = sortedEntries.map(e => {
        cumulative += e.amount;
        return cumulative;
    });

    const lineData = {
        labels: chartLabels.length > 0 ? chartLabels : ['Start'],
        datasets: [{
            label: `${resolution.unit} Progress`,
            data: chartData.length > 0 ? chartData : [0],
            borderColor: '#9747ff',
            backgroundColor: 'rgba(151, 71, 255, 0.1)',
            fill: true,
            tension: 0.4,
            pointBackgroundColor: '#9747ff',
            pointBorderWidth: 2,
            pointRadius: 4,
        }],
    };

    const lineOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
        },
        scales: {
            y: {
                beginAtZero: true,
                max: resolution.target * 1.1,
                grid: { color: 'rgba(255,255,255,0.05)' },
                ticks: { color: 'rgba(255,255,255,0.5)' },
            },
            x: {
                grid: { display: false },
                ticks: { color: 'rgba(255,255,255,0.5)' },
            },
        },
    };

    const formatValue = (val) => {
        if (resolution.category === 'financial') return Number(val).toLocaleString();
        return val;
    };

    return (
        <div className="page-container">
            <button className="btn btn-secondary btn-sm detail-back" onClick={() => navigate('/resolutions')}>
                ← Back to Resolutions
            </button>

            {/* Header */}
            <div className="detail-header">
                <div>
                    <div className="detail-category">
                        <span>{CATEGORY_ICONS[resolution.category]}</span>
                        <span className="detail-category-label">{resolution.category}</span>
                    </div>
                    <h1 className="page-title">{resolution.title}</h1>
                    {resolution.description && (
                        <p className="detail-desc">{resolution.description}</p>
                    )}
                </div>
                <button
                    className="btn btn-danger btn-sm"
                    onClick={() => setShowDeleteConfirm(true)}
                >
                    🗑️ Delete
                </button>
            </div>

            {/* Delete confirmation */}
            {showDeleteConfirm && (
                <div className="delete-confirm glass-card">
                    <p>Are you sure you want to delete this resolution? This cannot be undone.</p>
                    <div className="delete-actions">
                        <button className="btn btn-secondary btn-sm" onClick={() => setShowDeleteConfirm(false)}>Cancel</button>
                        <button className="btn btn-danger btn-sm" onClick={handleDelete}>Yes, Delete</button>
                    </div>
                </div>
            )}

            {/* Progress Overview */}
            <div className="detail-progress glass-card">
                <div className="detail-progress-header">
                    <div>
                        <span className="detail-current">{formatValue(resolution.current)}</span>
                        <span className="detail-unit"> {resolution.unit}</span>
                    </div>
                    <span className="detail-percent">{percent}%</span>
                </div>
                <div className="progress-track" style={{ height: '12px' }}>
                    <div
                        className={`progress-fill ${percent >= 100 ? 'success' : percent >= 50 ? '' : 'warning'}`}
                        style={{ width: `${percent}%` }}
                    />
                </div>
                <div className="detail-progress-footer">
                    <span>Remaining: {formatValue(remaining)} {resolution.unit}</span>
                    <span>Target: {formatValue(resolution.target)} {resolution.unit}</span>
                </div>
            </div>

            {/* Chart + Log side by side */}
            <div className="detail-grid">
                <div className="glass-card detail-chart-card">
                    <h3>📈 Progress Over Time</h3>
                    <div className="detail-chart-wrapper">
                        <Line data={lineData} options={lineOptions} />
                    </div>
                </div>

                <div className="glass-card detail-log-card">
                    <h3>✏️ Log Progress</h3>
                    <form onSubmit={handleLog} className="log-form">
                        <div className="form-group">
                            <label className="form-label">
                                Amount ({resolution.unit}) *
                            </label>
                            <input
                                type="number"
                                className="form-input"
                                placeholder={resolution.category === 'financial' ? '5000' : '3'}
                                value={logAmount}
                                onChange={e => setLogAmount(e.target.value)}
                                min="1"
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Note (optional)</label>
                            <input
                                type="text"
                                className="form-input"
                                placeholder="e.g., Saved from freelance work"
                                value={logNote}
                                onChange={e => setLogNote(e.target.value)}
                            />
                        </div>
                        <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                            ➕ Log Progress
                        </button>
                    </form>

                    {/* Recent entries */}
                    {resolution.entries.length > 0 && (
                        <div className="log-history">
                            <h4>Recent Entries</h4>
                            <div className="log-entries">
                                {[...resolution.entries].reverse().slice(0, 5).map(entry => (
                                    <div key={entry.id} className="log-entry">
                                        <div>
                                            <span className="log-entry-amount">+{formatValue(entry.amount)} {resolution.unit}</span>
                                            {entry.note && <span className="log-entry-note">{entry.note}</span>}
                                        </div>
                                        <span className="log-entry-date">
                                            {new Date(entry.date).toLocaleDateString()}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Smart Feedback */}
            <FeedbackPanel resolution={resolution} />
        </div>
    );
}

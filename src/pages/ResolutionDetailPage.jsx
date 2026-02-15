import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getResolution, logProgress, deleteResolution } from '../services/resolutionService';
import { analyzePace } from '../services/feedbackService';
import FeedbackPanel from '../components/FeedbackPanel';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import './ResolutionDetailPage.css';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

export default function ResolutionDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [resolution, setResolution] = useState(null);
    const [entryAmount, setEntryAmount] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchResolution() {
            if (id) {
                try {
                    const data = await getResolution(id);
                    if (data) {
                        setResolution(data);
                    } else {
                        console.error('Resolution not found');
                        navigate('/dashboard');
                    }
                } catch (error) {
                    console.error('Error fetching resolution:', error);
                } finally {
                    setLoading(false);
                }
            }
        }
        fetchResolution();
    }, [id, navigate]);

    const handleLogProgress = async (e) => {
        e.preventDefault();
        if (!entryAmount) return;
        try {
            const updated = await logProgress(resolution.id, { amount: entryAmount });
            setResolution(updated);
            setEntryAmount('');
        } catch (error) {
            console.error("Failed to log progress:", error);
            alert("Failed to log progress. Please try again.");
        }
    };

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this resolution?')) {
            try {
                await deleteResolution(resolution.id);
                navigate('/resolutions');
            } catch (error) {
                console.error("Failed to delete resolution:", error);
            }
        }
    };

    if (loading) return <div className="page-container">Loading...</div>;
    if (!resolution) return <div className="page-container">Resolution not found.</div>;

    const percent = resolution.target > 0
        ? Math.min(100, Math.round((resolution.current / resolution.target) * 100))
        : 0;

    const pace = analyzePace(resolution);

    // Chart Data Preparation
    const entries = resolution.entries || [];
    // Create cumulative data for the chart
    let runningTotal = 0;
    const chartLabels = entries.map(e => new Date(e.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }));
    const chartDataPoints = entries.map(e => {
        runningTotal += e.amount;
        return runningTotal;
    });

    // If no entries, show 0 at start date
    if (entries.length === 0) {
        chartLabels.push(new Date(resolution.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }));
        chartDataPoints.push(0);
    }

    const chartData = {
        labels: chartLabels,
        datasets: [
            {
                fill: true,
                label: 'Progress',
                data: chartDataPoints,
                borderColor: '#00e676',
                backgroundColor: 'rgba(0, 230, 118, 0.1)',
                tension: 0.4,
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            tooltip: {
                mode: 'index',
                intersect: false,
            },
        },
        scales: {
            x: {
                grid: { color: 'rgba(255,255,255,0.05)' },
                ticks: { color: 'rgba(255,255,255,0.6)' },
            },
            y: {
                grid: { color: 'rgba(255,255,255,0.05)' },
                ticks: { color: 'rgba(255,255,255,0.6)' },
                suggestedMax: resolution.target,
            },
        },
    };

    return (
        <div className="page-container">
            <Link to="/dashboard" className="back-link">← Back to Dashboard</Link>

            <div className="detail-header">
                <div>
                    <span className={`detail-category-badge cat-${resolution.category}`}>
                        {resolution.category === 'financial' ? '💰 Financial' :
                            resolution.category === 'spiritual' ? '📖 Spiritual' : '✨ Custom'}
                    </span>
                    <h1 className="detail-title">{resolution.title}</h1>
                    <p className="detail-meta">Deadline: {new Date(resolution.deadline).toLocaleDateString()}</p>
                </div>
                <button className="btn btn-outline-danger" onClick={handleDelete}>Delete</button>
            </div>

            <div className="detail-grid">
                {/* Main Progress Column */}
                <div className="detail-main">
                    <div className="glass-card detail-progress-card">
                        <div className="progress-overview">
                            <div>
                                <span className="big-percent">{percent}%</span>
                                <span className="progress-label">Completed</span>
                            </div>
                            <div className="text-right">
                                <span className="current-val">{resolution.current}</span>
                                <span className="target-val"> / {resolution.target} {resolution.unit}</span>
                            </div>
                        </div>
                        <div className="progress-bar-container">
                            <div className="progress-bar-fill" style={{ width: `${percent}%` }}></div>
                        </div>

                        <div className="chart-container">
                            <Line data={chartData} options={chartOptions} />
                        </div>
                    </div>

                    <div className="glass-card log-entry-card">
                        <h3>📝 Log Progress</h3>
                        <form onSubmit={handleLogProgress} className="log-form">
                            <input
                                type="number"
                                className="form-input"
                                placeholder={`Amount to add (${resolution.unit})`}
                                value={entryAmount}
                                onChange={(e) => setEntryAmount(e.target.value)}
                                required
                            />
                            <button type="submit" className="btn btn-primary">Add Entry</button>
                        </form>
                    </div>

                    {entries.length > 0 && (
                        <div className="entries-list">
                            <h4>Recent Activity</h4>
                            {entries.slice().reverse().map((entry) => (
                                <div key={entry.id} className="entry-item glass-card">
                                    <span className="entry-date">
                                        {new Date(entry.date).toLocaleDateString()} {new Date(entry.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                    <span className="entry-amount">+{entry.amount} {resolution.unit}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Sidebar Feedback Column */}
                <div className="detail-sidebar">
                    <FeedbackPanel resolution={resolution} pace={pace} />
                    {resolution.description && (
                        <div className="glass-card description-card">
                            <h4>About this goal</h4>
                            <p>{resolution.description}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

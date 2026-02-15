import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getCurrentUser } from '../services/authService';
import { getResolutions, getProgressPercent } from '../services/resolutionService';
import { analyzePace } from '../services/feedbackService';
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
    CategoryScale,
    LinearScale,
    BarElement,
} from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';
import ResolutionCard from '../components/ResolutionCard';
import './DashboardPage.css';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

export default function DashboardPage() {
    const [resolutions, setResolutions] = useState([]);
    const user = getCurrentUser();

    useEffect(() => {
        if (user) {
            setResolutions(getResolutions(user.id));
        }
    }, []);

    const totalResolutions = resolutions.length;
    const avgProgress = totalResolutions > 0
        ? Math.round(resolutions.reduce((sum, r) => sum + getProgressPercent(r), 0) / totalResolutions)
        : 0;
    const completedCount = resolutions.filter(r => getProgressPercent(r) >= 100).length;
    const onTrackCount = resolutions.filter(r => {
        const pace = analyzePace(r);
        return pace.status === 'ahead' || pace.status === 'on-track';
    }).length;

    // Category breakdown
    const categories = ['financial', 'spiritual', 'custom'];
    const categoryCounts = categories.map(c => resolutions.filter(r => r.category === c).length);
    const categoryAvg = categories.map(c => {
        const catRes = resolutions.filter(r => r.category === c);
        if (catRes.length === 0) return 0;
        return Math.round(catRes.reduce((s, r) => s + getProgressPercent(r), 0) / catRes.length);
    });

    const doughnutData = {
        labels: ['Completed', 'Remaining'],
        datasets: [{
            data: [avgProgress, 100 - avgProgress],
            backgroundColor: ['#9747ff', 'rgba(255,255,255,0.06)'],
            borderWidth: 0,
            cutout: '75%',
        }],
    };

    const barData = {
        labels: ['💰 Financial', '📖 Spiritual', '✨ Custom'],
        datasets: [{
            label: 'Avg Progress %',
            data: categoryAvg,
            backgroundColor: ['rgba(98, 0, 234, 0.6)', 'rgba(255, 193, 7, 0.6)', 'rgba(0, 200, 83, 0.6)'],
            borderRadius: 8,
            borderSkipped: false,
        }],
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
        },
        scales: {
            y: {
                beginAtZero: true,
                max: 100,
                grid: { color: 'rgba(255,255,255,0.05)' },
                ticks: { color: 'rgba(255,255,255,0.5)' },
            },
            x: {
                grid: { display: false },
                ticks: { color: 'rgba(255,255,255,0.5)' },
            },
        },
    };

    return (
        <div className="page-container">
            <div className="page-title">Dashboard</div>
            <p className="page-subtitle">Your resolution overview at a glance</p>

            {/* Stats Row */}
            <div className="dash-stats">
                <div className="dash-stat-card glass-card">
                    <span className="dash-stat-icon">🎯</span>
                    <div>
                        <span className="dash-stat-value">{totalResolutions}</span>
                        <span className="dash-stat-label">Total Resolutions</span>
                    </div>
                </div>
                <div className="dash-stat-card glass-card">
                    <span className="dash-stat-icon">📊</span>
                    <div>
                        <span className="dash-stat-value">{avgProgress}%</span>
                        <span className="dash-stat-label">Avg Progress</span>
                    </div>
                </div>
                <div className="dash-stat-card glass-card">
                    <span className="dash-stat-icon">✅</span>
                    <div>
                        <span className="dash-stat-value">{completedCount}</span>
                        <span className="dash-stat-label">Completed</span>
                    </div>
                </div>
                <div className="dash-stat-card glass-card">
                    <span className="dash-stat-icon">🏃</span>
                    <div>
                        <span className="dash-stat-value">{onTrackCount}</span>
                        <span className="dash-stat-label">On Track</span>
                    </div>
                </div>
            </div>

            {/* Charts Row */}
            {totalResolutions > 0 ? (
                <div className="dash-charts">
                    <div className="glass-card dash-chart-card">
                        <h3>Overall Progress</h3>
                        <div className="doughnut-wrapper">
                            <Doughnut data={doughnutData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }} />
                            <div className="doughnut-center">
                                <span className="doughnut-percent">{avgProgress}%</span>
                                <span className="doughnut-label">Average</span>
                            </div>
                        </div>
                    </div>
                    <div className="glass-card dash-chart-card">
                        <h3>Progress by Category</h3>
                        <div className="bar-wrapper">
                            <Bar data={barData} options={chartOptions} />
                        </div>
                    </div>
                </div>
            ) : null}

            {/* Resolutions */}
            <div className="dash-resolutions-header">
                <h2>Your Resolutions</h2>
                <Link to="/resolutions/new" className="btn btn-primary">
                    ✨ New Resolution
                </Link>
            </div>

            {totalResolutions > 0 ? (
                <div className="dash-resolutions-grid">
                    {resolutions.slice(0, 4).map(r => (
                        <ResolutionCard key={r.id} resolution={r} />
                    ))}
                </div>
            ) : (
                <div className="dash-empty glass-card">
                    <span className="dash-empty-icon">🌱</span>
                    <h3>No resolutions yet</h3>
                    <p>Create your first resolution to start tracking your journey!</p>
                    <Link to="/resolutions/new" className="btn btn-primary">
                        ✨ Create Resolution
                    </Link>
                </div>
            )}

            {totalResolutions > 4 && (
                <div className="dash-view-all">
                    <Link to="/resolutions" className="btn btn-secondary">
                        View All Resolutions →
                    </Link>
                </div>
            )}
        </div>
    );
}

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getResolutions } from '../services/resolutionService';
import ResolutionCard from '../components/ResolutionCard';
import './ResolutionsPage.css';

export default function ResolutionsPage() {
    const [resolutions, setResolutions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const { currentUser: user } = useAuth();

    useEffect(() => {
        async function fetchData() {
            if (user) {
                try {
                    const data = await getResolutions(user.uid);
                    setResolutions(data);
                } catch (error) {
                    console.error(error);
                } finally {
                    setLoading(false);
                }
            }
        }
        fetchData();
    }, [user]);

    const filtered = filter === 'all'
        ? resolutions
        : resolutions.filter(r => r.category === filter);

    const filters = [
        { key: 'all', label: 'All', icon: '🎯' },
        { key: 'financial', label: 'Financial', icon: '💰' },
        { key: 'spiritual', label: 'Spiritual', icon: '📖' },
        { key: 'custom', label: 'Custom', icon: '✨' },
    ];

    if (loading) return <div className="page-container">Loading...</div>;

    return (
        <div className="page-container">
            <div className="res-page-header">
                <div>
                    <h1 className="page-title">My Resolutions</h1>
                    <p className="page-subtitle">Track and manage all your goals</p>
                </div>
                <Link to="/resolutions/new" className="btn btn-primary">
                    ✨ New Resolution
                </Link>
            </div>

            <div className="res-filters">
                {filters.map(f => (
                    <button
                        key={f.key}
                        className={`res-filter-btn ${filter === f.key ? 'active' : ''}`}
                        onClick={() => setFilter(f.key)}
                    >
                        <span>{f.icon}</span> {f.label}
                        {f.key !== 'all' && (
                            <span className="filter-count">
                                {resolutions.filter(r => f.key === 'all' || r.category === f.key).length}
                            </span>
                        )}
                    </button>
                ))}
            </div>

            {filtered.length > 0 ? (
                <div className="res-grid">
                    {filtered.map(r => (
                        <ResolutionCard key={r.id} resolution={r} />
                    ))}
                </div>
            ) : (
                <div className="res-empty glass-card">
                    <span className="res-empty-icon">📋</span>
                    <h3>{filter === 'all' ? 'No resolutions yet' : `No ${filter} resolutions`}</h3>
                    <p>Create one to get started!</p>
                    <Link to="/resolutions/new" className="btn btn-primary">Create Resolution</Link>
                </div>
            )}
        </div>
    );
}

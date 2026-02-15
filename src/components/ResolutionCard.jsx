import { getProgressPercent } from '../services/resolutionService';
import { analyzePace } from '../services/feedbackService';
import { useNavigate } from 'react-router-dom';
import './ResolutionCard.css';

const CATEGORY_ICONS = {
    financial: '💰',
    spiritual: '📖',
    custom: '✨',
};

const CATEGORY_LABELS = {
    financial: 'Financial',
    spiritual: 'Spiritual',
    custom: 'Custom',
};

export default function ResolutionCard({ resolution }) {
    const navigate = useNavigate();
    const percent = getProgressPercent(resolution);
    const pace = analyzePace(resolution);

    const getStatusColor = () => {
        if (pace.status === 'completed') return 'success';
        if (pace.status === 'ahead' || pace.status === 'on-track') return 'success';
        if (pace.status === 'behind' && percent > 20) return 'warning';
        return 'danger';
    };

    const formatValue = (val) => {
        if (resolution.category === 'financial') {
            return Number(val).toLocaleString();
        }
        return val;
    };

    return (
        <div
            className="resolution-card glass-card"
            onClick={() => navigate(`/resolutions/${resolution.id}`)}
        >
            <div className="rc-header">
                <span className="rc-category-icon">{CATEGORY_ICONS[resolution.category]}</span>
                <span className={`badge badge-${getStatusColor()}`}>
                    {pace.status === 'completed' ? 'Complete' : pace.status}
                </span>
            </div>
            <h3 className="rc-title">{resolution.title}</h3>
            <p className="rc-category">{CATEGORY_LABELS[resolution.category]}</p>

            <div className="rc-progress-section">
                <div className="rc-progress-labels">
                    <span>{formatValue(resolution.current)} {resolution.unit}</span>
                    <span>{percent}%</span>
                </div>
                <div className="progress-track">
                    <div
                        className={`progress-fill ${getStatusColor()}`}
                        style={{ width: `${percent}%` }}
                    />
                </div>
                <p className="rc-target">
                    Target: {formatValue(resolution.target)} {resolution.unit}
                </p>
            </div>

            <div className="rc-footer">
                <span className="rc-deadline">
                    ⏰ {pace.daysLeft !== undefined ? `${pace.daysLeft} days left` : 'No deadline'}
                </span>
            </div>
        </div>
    );
}

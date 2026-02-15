import { analyzePace, getSuggestions, getMotivationalVerse } from '../services/feedbackService';
import { useState, useEffect } from 'react';
import './FeedbackPanel.css';

export default function FeedbackPanel({ resolution }) {
    const [verse, setVerse] = useState(null);

    useEffect(() => {
        setVerse(getMotivationalVerse(resolution.category));
    }, [resolution.category]);

    const pace = analyzePace(resolution);
    const suggestions = getSuggestions(resolution);

    const getStatusClass = () => {
        if (pace.status === 'completed' || pace.status === 'ahead') return 'feedback-success';
        if (pace.status === 'on-track') return 'feedback-info';
        return 'feedback-warning';
    };

    return (
        <div className={`feedback-panel ${getStatusClass()}`}>
            <h3 className="feedback-title">📈 Smart Insights</h3>

            <div className="feedback-status-msg">
                <p>{pace.message}</p>
            </div>

            {pace.status !== 'completed' && (
                <div className="feedback-stats">
                    <div className="feedback-stat">
                        <span className="stat-value">{pace.daysLeft}</span>
                        <span className="stat-label">Days Left</span>
                    </div>
                    <div className="feedback-stat">
                        <span className="stat-value">{pace.currentPace}</span>
                        <span className="stat-label">Current Pace/Day</span>
                    </div>
                    <div className="feedback-stat">
                        <span className="stat-value">{pace.requiredPace}</span>
                        <span className="stat-label">Required Pace/Day</span>
                    </div>
                </div>
            )}

            <div className="feedback-suggestions">
                <h4>💡 Suggestions</h4>
                <ul>
                    {suggestions.map((s, i) => (
                        <li key={i}>{s}</li>
                    ))}
                </ul>
            </div>

            {verse && (
                <div className="feedback-verse">
                    <p>"{verse.text}"</p>
                    <span>— {verse.ref}</span>
                </div>
            )}
        </div>
    );
}

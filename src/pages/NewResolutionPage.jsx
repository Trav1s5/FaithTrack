import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser } from '../services/authService';
import { createResolution } from '../services/resolutionService';
import './NewResolutionPage.css';

const CATEGORIES = [
    { key: 'financial', icon: '💰', label: 'Financial', desc: 'Track savings, budgets, and financial goals', color: '#6200ea' },
    { key: 'spiritual', icon: '📖', label: 'Spiritual', desc: 'Track Bible reading, prayer, and spiritual growth', color: '#ffc107' },
    { key: 'custom', icon: '✨', label: 'Custom', desc: 'Track any personal goal or habit', color: '#00c853' },
];

export default function NewResolutionPage() {
    const navigate = useNavigate();
    const user = getCurrentUser();
    const [step, setStep] = useState(1);
    const [form, setForm] = useState({
        category: '',
        title: '',
        target: '',
        unit: '',
        deadline: '',
        description: '',
    });
    const [error, setError] = useState('');

    const handleCategorySelect = (cat) => {
        let unit = '';
        let title = '';
        if (cat === 'financial') {
            unit = 'KES';
            title = 'Save ';
        } else if (cat === 'spiritual') {
            unit = 'chapters';
            title = 'Read ';
        }
        setForm(prev => ({ ...prev, category: cat, unit, title }));
        setStep(2);
    };

    const handleChange = (e) => {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');
        if (!form.title || !form.target || !form.deadline) {
            setError('Please fill in all required fields.');
            return;
        }
        try {
            createResolution({ ...form, userId: user.id });
            navigate('/resolutions');
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="page-container">
            <h1 className="page-title">New Resolution</h1>
            <p className="page-subtitle">
                {step === 1 ? 'Choose a category for your resolution' : 'Set up your goal details'}
            </p>

            {step === 1 && (
                <div className="category-grid">
                    {CATEGORIES.map(cat => (
                        <button
                            key={cat.key}
                            className="category-card glass-card"
                            onClick={() => handleCategorySelect(cat.key)}
                        >
                            <span className="cat-icon">{cat.icon}</span>
                            <h3>{cat.label}</h3>
                            <p>{cat.desc}</p>
                            <span className="cat-arrow">→</span>
                        </button>
                    ))}
                </div>
            )}

            {step === 2 && (
                <div className="new-res-form-wrapper">
                    <button className="btn btn-secondary btn-sm" onClick={() => setStep(1)}>
                        ← Change Category
                    </button>
                    <div className="selected-category">
                        <span>{CATEGORIES.find(c => c.key === form.category)?.icon}</span>
                        <span>{CATEGORIES.find(c => c.key === form.category)?.label} Resolution</span>
                    </div>

                    {error && <div className="auth-error">{error}</div>}

                    <form onSubmit={handleSubmit} className="new-res-form">
                        <div className="form-group">
                            <label className="form-label">Resolution Title *</label>
                            <input
                                type="text"
                                name="title"
                                className="form-input"
                                placeholder={
                                    form.category === 'financial' ? 'e.g., Save 1,000,000 KES for school fees' :
                                        form.category === 'spiritual' ? 'e.g., Read the entire Bible in 2026' :
                                            'e.g., Exercise 3 times a week'
                                }
                                value={form.title}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label className="form-label">Target Amount *</label>
                                <input
                                    type="number"
                                    name="target"
                                    className="form-input"
                                    placeholder={
                                        form.category === 'financial' ? '1000000' :
                                            form.category === 'spiritual' ? '1189' :
                                                '100'
                                    }
                                    value={form.target}
                                    onChange={handleChange}
                                    min="1"
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Unit</label>
                                <input
                                    type="text"
                                    name="unit"
                                    className="form-input"
                                    placeholder="e.g., KES, chapters, hours"
                                    value={form.unit}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Deadline *</label>
                            <input
                                type="date"
                                name="deadline"
                                className="form-input"
                                value={form.deadline}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Description (optional)</label>
                            <textarea
                                name="description"
                                className="form-input form-textarea"
                                placeholder="Add any notes about this resolution..."
                                value={form.description}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="form-actions">
                            <button type="button" className="btn btn-secondary" onClick={() => navigate('/resolutions')}>
                                Cancel
                            </button>
                            <button type="submit" className="btn btn-primary btn-lg">
                                🚀 Create Resolution
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
}

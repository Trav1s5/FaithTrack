import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { createResolution } from '../services/resolutionService';
import './NewResolutionPage.css';

export default function NewResolutionPage() {
    const navigate = useNavigate();
    const { currentUser: user } = useAuth();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        category: '',
        target: '',
        unit: '',
        deadline: '',
        description: '',
    });

    const categories = [
        { id: 'financial', label: 'Financial', icon: '💰', desc: 'Save money, pay debt, give' },
        { id: 'spiritual', label: 'Spiritual', icon: '📖', desc: 'Read Bible, pray, fast' },
        { id: 'custom', label: 'Custom', icon: '✨', desc: 'Any other personal goal' },
    ];

    const handleCategorySelect = (catId) => {
        setFormData({ ...formData, category: catId });
        setStep(2);
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.title || !formData.target || !formData.deadline) return;

        setLoading(true);
        try {
            await createResolution({
                ...formData,
                userId: user.uid,
            });
            navigate('/dashboard');
        } catch (error) {
            console.error('Error creating resolution:', error);
            alert('Failed to create resolution. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="page-container">
            <div className="new-res-header">
                <h1 className="page-title">New Resolution</h1>
                <p className="page-subtitle">Step {step} of 2: {step === 1 ? 'Choose Category' : 'Set Details'}</p>
            </div>

            {step === 1 && (
                <div className="category-grid">
                    {categories.map((cat) => (
                        <div
                            key={cat.id}
                            className="category-card glass-card"
                            onClick={() => handleCategorySelect(cat.id)}
                        >
                            <div className="cat-icon">{cat.icon}</div>
                            <h3>{cat.label}</h3>
                            <p>{cat.desc}</p>
                        </div>
                    ))}
                </div>
            )}

            {step === 2 && (
                <div className="glass-card new-res-form-card">
                    <button className="btn-text back-btn" onClick={() => setStep(1)}>← Back</button>

                    <form onSubmit={handleSubmit} className="new-res-form">
                        <div className="form-group">
                            <label className="form-label">Resolution Title</label>
                            <input
                                type="text"
                                name="title"
                                className="form-input"
                                placeholder={
                                    formData.category === 'financial' ? 'e.g. Save for Camp' :
                                        formData.category === 'spiritual' ? 'e.g. Read Genesis' :
                                            'e.g. Learn Guitar'
                                }
                                value={formData.title}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label className="form-label">Target Amount</label>
                                <input
                                    type="number"
                                    name="target"
                                    className="form-input"
                                    placeholder="e.g. 500"
                                    value={formData.target}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Unit</label>
                                <input
                                    type="text"
                                    name="unit"
                                    className="form-input"
                                    placeholder={
                                        formData.category === 'financial' ? 'USD' :
                                            formData.category === 'spiritual' ? 'Chapters' :
                                                'Hours'
                                    }
                                    value={formData.unit}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Deadline</label>
                            <input
                                type="date"
                                name="deadline"
                                className="form-input"
                                value={formData.deadline}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Description (Optional)</label>
                            <textarea
                                name="description"
                                className="form-input"
                                rows="3"
                                placeholder="Why do you want to achieve this?"
                                value={formData.description}
                                onChange={handleChange}
                            />
                        </div>

                        <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
                            {loading ? 'Creating...' : '✨ Create Resolution'}
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
}

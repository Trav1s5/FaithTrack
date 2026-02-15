import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './AuthPages.css';

export default function RegisterPage() {
    const navigate = useNavigate();
    const { register } = useAuth();
    const [form, setForm] = useState({ name: '', email: '', password: '', church: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (!form.name || !form.email || !form.password) {
            setError('Please fill in all required fields.');
            return;
        }
        if (form.password.length < 6) {
            setError('Password must be at least 6 characters.');
            return;
        }
        setLoading(true);
        try {
            await register(form.name, form.email, form.password, form.church);
            navigate('/dashboard');
        } catch (err) {
            console.error(err);
            setError(err.message.replace('Firebase: ', ''));
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-bg">
                <div className="bg-orb bg-orb-1" />
                <div className="bg-orb bg-orb-2" />
            </div>
            <div className="auth-card">
                <Link to="/" className="auth-back">← Back</Link>
                <div className="auth-header">
                    <span className="auth-icon">✝️</span>
                    <h1>Create Your Account</h1>
                    <p>Start tracking your resolutions today</p>
                </div>
                {error && <div className="auth-error">{error}</div>}
                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="form-group">
                        <label className="form-label">Full Name *</label>
                        <input
                            type="text"
                            name="name"
                            className="form-input"
                            placeholder="John Doe"
                            value={form.name}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Email *</label>
                        <input
                            type="email"
                            name="email"
                            className="form-input"
                            placeholder="john@example.com"
                            value={form.email}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Password *</label>
                        <input
                            type="password"
                            name="password"
                            className="form-input"
                            placeholder="At least 6 characters"
                            value={form.password}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Church / Youth Group</label>
                        <input
                            type="text"
                            name="church"
                            className="form-input"
                            placeholder="e.g., Grace Community Church"
                            value={form.church}
                            onChange={handleChange}
                        />
                    </div>
                    <button type="submit" className="btn btn-primary btn-lg auth-submit" disabled={loading}>
                        {loading ? 'Creating account...' : '🚀 Create Account'}
                    </button>
                </form>
                <p className="auth-switch">
                    Already have an account? <Link to="/login">Login</Link>
                </p>
            </div>
        </div>
    );
}

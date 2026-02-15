import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../services/authService';
import './AuthPages.css';

export default function LoginPage() {
    const navigate = useNavigate();
    const [form, setForm] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');
        if (!form.email || !form.password) {
            setError('Please fill in all fields.');
            return;
        }
        setLoading(true);
        try {
            login(form.email, form.password);
            navigate('/dashboard');
        } catch (err) {
            setError(err.message);
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
                    <h1>Welcome Back</h1>
                    <p>Continue your journey of growth</p>
                </div>
                {error && <div className="auth-error">{error}</div>}
                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="form-group">
                        <label className="form-label">Email</label>
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
                        <label className="form-label">Password</label>
                        <input
                            type="password"
                            name="password"
                            className="form-input"
                            placeholder="Your password"
                            value={form.password}
                            onChange={handleChange}
                        />
                    </div>
                    <button type="submit" className="btn btn-primary btn-lg auth-submit" disabled={loading}>
                        {loading ? 'Logging in...' : '🔐 Login'}
                    </button>
                </form>
                <p className="auth-switch">
                    Don't have an account? <Link to="/register">Sign up</Link>
                </p>
            </div>
        </div>
    );
}

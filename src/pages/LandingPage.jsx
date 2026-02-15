import { Link } from 'react-router-dom';
import { isAuthenticated } from '../services/authService';
import './LandingPage.css';

export default function LandingPage() {
    const loggedIn = isAuthenticated();

    return (
        <div className="landing">
            {/* Animated background */}
            <div className="landing-bg">
                <div className="bg-orb bg-orb-1" />
                <div className="bg-orb bg-orb-2" />
                <div className="bg-orb bg-orb-3" />
            </div>

            {/* Navigation */}
            <nav className="landing-nav">
                <div className="landing-logo">
                    <span className="logo-cross">✝️</span>
                    <span>FaithTrack</span>
                </div>
                <div className="landing-nav-links">
                    {loggedIn ? (
                        <Link to="/dashboard" className="btn btn-primary">Go to Dashboard</Link>
                    ) : (
                        <>
                            <Link to="/login" className="btn btn-secondary">Login</Link>
                            <Link to="/register" className="btn btn-primary">Get Started</Link>
                        </>
                    )}
                </div>
            </nav>

            {/* Hero */}
            <section className="hero">
                <div className="hero-content">
                    <div className="hero-badge">🙏 Built for Young Christians</div>
                    <h1 className="hero-title">
                        Track Your <span className="text-gradient">Resolutions</span>,{' '}
                        Grow in <span className="text-accent">Faith</span>
                    </h1>
                    <p className="hero-description">
                        Set financial, spiritual, and personal goals. Track your progress with beautiful charts,
                        get smart feedback, and stay motivated with scripture — all in one place.
                    </p>
                    <div className="hero-actions">
                        <Link to={loggedIn ? '/dashboard' : '/register'} className="btn btn-primary btn-lg">
                            🚀 Start Tracking
                        </Link>
                        <a href="#features" className="btn btn-secondary btn-lg">
                            Learn More ↓
                        </a>
                    </div>
                    <div className="hero-stats">
                        <div className="hero-stat">
                            <span className="hero-stat-value">💰</span>
                            <span className="hero-stat-label">Financial Goals</span>
                        </div>
                        <div className="hero-stat">
                            <span className="hero-stat-value">📖</span>
                            <span className="hero-stat-label">Bible Reading</span>
                        </div>
                        <div className="hero-stat">
                            <span className="hero-stat-value">📊</span>
                            <span className="hero-stat-label">Progress Charts</span>
                        </div>
                        <div className="hero-stat">
                            <span className="hero-stat-value">💡</span>
                            <span className="hero-stat-label">Smart Feedback</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features */}
            <section className="features" id="features">
                <h2 className="features-title">Everything You Need to <span className="text-gradient">Grow</span></h2>
                <div className="features-grid">
                    <div className="feature-card glass-card">
                        <div className="feature-icon">🎯</div>
                        <h3>Set Resolutions</h3>
                        <p>Create financial savings goals, Bible reading plans, or any custom resolution that matters to you.</p>
                    </div>
                    <div className="feature-card glass-card">
                        <div className="feature-icon">📊</div>
                        <h3>Track Progress</h3>
                        <p>See beautiful charts and progress bars showing exactly how far you've come and how much is left.</p>
                    </div>
                    <div className="feature-card glass-card">
                        <div className="feature-icon">💡</div>
                        <h3>Get Smart Feedback</h3>
                        <p>Receive pace analysis, personalized tips, and motivational Bible verses to keep you going.</p>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="cta-section">
                <div className="cta-card">
                    <h2>Ready to Start Your Journey?</h2>
                    <p>Join FaithTrack today and begin tracking your resolutions with purpose.</p>
                    <Link to={loggedIn ? '/dashboard' : '/register'} className="btn btn-accent btn-lg">
                        ✨ Get Started Free
                    </Link>
                </div>
            </section>

            {/* Footer */}
            <footer className="landing-footer">
                <p className="footer-verse">
                    "Commit to the Lord whatever you do, and he will establish your plans."
                </p>
                <span className="footer-ref">— Proverbs 16:3</span>
                <p className="footer-copy">© 2026 FaithTrack. Built with ❤️ for youth ministry.</p>
            </footer>
        </div>
    );
}

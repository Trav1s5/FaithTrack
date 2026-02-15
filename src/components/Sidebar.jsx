import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Sidebar.css';

export default function Sidebar({ isOpen, onToggle }) {
    const navigate = useNavigate();
    const { currentUser: user, logout } = useAuth();

    const handleLogout = async () => {
        await logout();
        navigate('/');
    };

    const navItems = [
        { path: '/dashboard', icon: '📊', label: 'Dashboard' },
        { path: '/resolutions', icon: '🎯', label: 'My Resolutions' },
        { path: '/resolutions/new', icon: '✨', label: 'New Resolution' },
    ];

    return (
        <>
            <div className={`sidebar-overlay ${isOpen ? 'active' : ''}`} onClick={onToggle} />
            <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
                <div className="sidebar-header">
                    <div className="sidebar-logo">
                        <span className="logo-icon">✝️</span>
                        <span className="logo-text">FaithTrack</span>
                    </div>
                    <button className="sidebar-close btn-icon" onClick={onToggle}>✕</button>
                </div>

                <div className="sidebar-user">
                    <div className="user-avatar">
                        {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                    <div className="user-info">
                        <span className="user-name">{user?.name || 'User'}</span>
                        <span className="user-church">{user?.church || 'FaithTrack Member'}</span>
                    </div>
                </div>

                <nav className="sidebar-nav">
                    {navItems.map(item => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                            onClick={() => window.innerWidth < 768 && onToggle?.()}
                        >
                            <span className="nav-icon">{item.icon}</span>
                            <span className="nav-label">{item.label}</span>
                        </NavLink>
                    ))}
                </nav>

                <div className="sidebar-footer">
                    <div className="sidebar-verse">
                        <p>"I can do all this through him who gives me strength."</p>
                        <span>— Philippians 4:13</span>
                    </div>
                    <button className="btn btn-secondary sidebar-logout" onClick={handleLogout}>
                        🚪 Logout
                    </button>
                </div>
            </aside>
        </>
    );
}

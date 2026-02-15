import { getCurrentUser } from '../services/authService';
import './Header.css';

export default function Header({ title, onMenuToggle }) {
    const user = getCurrentUser();

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good morning';
        if (hour < 17) return 'Good afternoon';
        return 'Good evening';
    };

    return (
        <header className="app-header">
            <div className="header-left">
                <button className="menu-toggle btn-icon" onClick={onMenuToggle}>
                    ☰
                </button>
                <div>
                    <h1 className="header-title">{title}</h1>
                    <p className="header-greeting">
                        {getGreeting()}, <span>{user?.name?.split(' ')[0] || 'Friend'}</span> 👋
                    </p>
                </div>
            </div>
            <div className="header-right">
                <div className="header-avatar">
                    {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                </div>
            </div>
        </header>
    );
}

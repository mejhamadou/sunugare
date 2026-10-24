import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';

export default function Layout() {
    const location = useLocation();
    const navigate = useNavigate();
    const email = localStorage.getItem('email');

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('email');
        navigate('/login');
    };

    return (
        <div className="layout">
            {/* SIDEBAR */}
            <aside className="sidebar">

                {/* INTÉGRATION DU LOGO ICI */}
                <div className="sidebar-logo" style={{ padding: '10px 0' }}>
                    <img src="/logo.png" alt="SUNUGARE" style={{ width: '160px', objectFit: 'contain' }} />
                </div>

                <nav className="sidebar-nav">
                    <Link to="/dashboard" className={`nav-item ${location.pathname === '/dashboard' ? 'active' : ''}`}>📊 Dashboard</Link>
                    <Link to="/billetterie" className={`nav-item ${location.pathname === '/billetterie' ? 'active' : ''}`}>🎟️ Billetterie</Link>
                    <Link to="/controle" className={`nav-item ${location.pathname === '/controle' ? 'active' : ''}`}>🛡️ Contrôle</Link>
                    <Link to="/vehicules" className={`nav-item ${location.pathname === '/vehicules' ? 'active' : ''}`}>🚐 Véhicules</Link>
                    <Link to="/chauffeurs" className={`nav-item ${location.pathname === '/chauffeurs' ? 'active' : ''}`}>👨‍✈️ Conducteurs</Link>
                    <Link to="/voyages" className={`nav-item ${location.pathname === '/voyages' ? 'active' : ''}`}>🚌 Trips (Voyages)</Link>
                    <Link to="/admin" className={`nav-item ${location.pathname === '/admin' ? 'active' : ''}`}>🏢 Administration</Link>
                </nav>
            </aside>

            {/* CONTENU PRINCIPAL */}
            <main className="main-content">
                <header className="topbar">
                    <div>
                        <h2 style={{ fontSize: '18px' }}>Espace SUNUGARE</h2>
                        <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Supervision opérationnelle</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                        <div style={{ textAlign: 'right' }}>
                            <div style={{ fontSize: '14px', fontWeight: 'bold' }}>{email}</div>
                            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>ADMIN</div>
                        </div>
                        <button className="btn-danger" onClick={handleLogout}>Déconnexion</button>
                    </div>
                </header>
                <div className="page-content">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}
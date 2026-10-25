import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';

export default function Layout() {
    const location = useLocation();
    const navigate = useNavigate();
    const email = localStorage.getItem('email');
    const role = localStorage.getItem('role'); // ✅ On récupère le rôle
    const isAdmin = role === 'ROLE_ADMIN' || role === 'ROLE_RESPONSABLE'; // Qui a le droit de gérer ?

    const handleLogout = () => {
        localStorage.clear(); // On vide tout
        navigate('/login');
    };

    return (
        <div className="layout">
            {/* SIDEBAR */}
            <aside className="sidebar">
                <div className="sidebar-logo" style={{ padding: '10px 0' }}>
                    <img src="/logo.png" alt="SUNUGARE" style={{ width: '160px', objectFit: 'contain' }} />
                </div>

                <nav className="sidebar-nav">
                    <Link to="/dashboard" className={`nav-item ${location.pathname === '/dashboard' ? 'active' : ''}`}>📊 Dashboard</Link>

                    {/* ✅ MENUS VISIBLES PAR TOUS */}
                    <Link to="/planning" className={`nav-item ${location.pathname === '/planning' ? 'active' : ''}`}>⏱️ Planning</Link>
                    <Link to="/billetterie" className={`nav-item ${location.pathname === '/billetterie' ? 'active' : ''}`}>🎟️ Billetterie</Link>
                    <Link to="/controle" className={`nav-item ${location.pathname === '/controle' ? 'active' : ''}`}>🛡️ Contrôle</Link>
                    <Link to="/abonnements" className={`nav-item ${location.pathname === '/abonnements' ? 'active' : ''}`}>🎫 Abonnements</Link>

                    {/* ✅ MENUS VISIBLES UNIQUEMENT PAR L'ADMIN/RESPONSABLE */}
                    {isAdmin && (
                        <>
                            <div style={{ marginTop: '20px', marginBottom: '5px', fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', paddingLeft: '15px', fontWeight: 'bold' }}>Administration</div>
                            <Link to="/voyages" className={`nav-item ${location.pathname === '/voyages' ? 'active' : ''}`}>🚌 Trips (Voyages)</Link>
                            <Link to="/vehicules" className={`nav-item ${location.pathname === '/vehicules' ? 'active' : ''}`}>🚐 Véhicules</Link>
                            <Link to="/chauffeurs" className={`nav-item ${location.pathname === '/chauffeurs' ? 'active' : ''}`}>👨‍✈️ Conducteurs</Link>
                            <Link to="/infrastructures" className={`nav-item ${location.pathname === '/infrastructures' ? 'active' : ''}`}>🏗️ Infrastructures</Link>
                            <Link to="/utilisateurs" className={`nav-item ${location.pathname === '/utilisateurs' ? 'active' : ''}`}>👥 Utilisateurs</Link>
                            <Link to="/admin" className={`nav-item ${location.pathname === '/admin' ? 'active' : ''}`}>🏢 Administration</Link>
                        </>
                    )}
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
                        <div style={{ position: 'relative', cursor: 'pointer' }} title="Notifications">
                            <span style={{ fontSize: '20px' }}>🔔</span>
                            <span style={{ position: 'absolute', top: '-5px', right: '-5px', backgroundColor: 'var(--danger)', color: 'white', fontSize: '10px', borderRadius: '50%', padding: '2px 6px', fontWeight: 'bold' }}>1</span>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <div style={{ fontSize: '14px', fontWeight: 'bold' }}>{email}</div>
                            {/* ✅ Affichage dynamique du rôle */}
                            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{role?.replace('ROLE_', '')}</div>
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
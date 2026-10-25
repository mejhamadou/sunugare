import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        try {
            const data = await api.login(email, password);
            localStorage.setItem('token', data.token);
            localStorage.setItem('email', data.email);
            localStorage.setItem('role', data.role);
            navigate('/dashboard');
        } catch (err) {
            setError('Adresse e-mail ou mot de passe incorrect.');
        }
    };

    return (
        <div style={{ display: 'flex', height: '100vh' }}>
            {/* PARTIE GAUCHE : FORMULAIRE */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '0 10%' }}>

                <div style={{ marginBottom: '40px' }}>
                    <img src="/logo.png" alt="SUNUGARE" style={{ height: '60px' }} />
                </div>

                <h1 style={{ fontSize: '32px', marginBottom: '10px', color: 'var(--text-main)' }}>Connexion</h1>
                <p style={{ color: 'var(--text-muted)', marginBottom: '30px' }}>Accédez à votre espace SUNUGARE pour gérer vos gares.</p>

                {error && <div style={{ backgroundColor: '#FEE2E2', color: '#B91C1C', padding: '10px', borderRadius: '8px', marginBottom: '20px', fontSize: '14px' }}>{error}</div>}

                <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column' }}>
                    <label style={{ fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>Adresse e-mail *</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />

                    <label style={{ fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>Mot de passe *</label>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />

                    <button type="submit" style={{ marginTop: '20px', padding: '14px', fontSize: '16px' }}>
                        Se connecter
                    </button>
                </form>
            </div>

            {/* PARTIE DROITE : IMAGE DE FOND VERTE AVEC LOGO */}
            <div style={{
                flex: 1,
                backgroundColor: '#0F3B2E', // Vert foncé (inspiré de ton logo)
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '40px'
            }}>
                {/* Un grand carré blanc pour la visibilité du logo */}
                <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '20px', marginBottom: '40px', boxShadow: '0 10px 25px rgba(0,0,0,0.2)' }}>
                    <img src="/logo.png" alt="SUNUGARE" style={{ width: '300px', objectFit: 'contain' }} />
                </div>

                <h2 style={{ color: 'white', fontSize: '28px', marginBottom: '10px' }}>Bienvenue sur SUNUGARE</h2>
                <p style={{ color: '#A7F3D0', fontSize: '16px', textAlign: 'center' }}>
                    Moderniser aujourd'hui, connecter demain.
                </p>
            </div>
        </div>
    );
}
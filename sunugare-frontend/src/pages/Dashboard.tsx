import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';

export default function Dashboard() {
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const email = localStorage.getItem('email');
    const token = localStorage.getItem('token');

    useEffect(() => {
        // Si pas de token, on dégage l'utilisateur vers le login
        if (!token) {
            navigate('/login');
            return;
        }

        // On appelle la route protégée
        api.getProtectedData(token)
            .then((data) => setMessage(data.message))
            .catch((err) => {
                setError(err.message);
                // Si le token est expiré, on le supprime et on redirige
                if (err.message.includes('token')) {
                    localStorage.removeItem('token');
                    navigate('/login');
                }
            });
    }, [token, navigate]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('email');
        navigate('/login');
    };

    return (
        <div style={{ maxWidth: '600px', margin: '50px auto', fontFamily: 'sans-serif' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2>Tableau de bord</h2>
                <button onClick={handleLogout} style={{ padding: '8px', backgroundColor: '#dc3545', color: 'white', border: 'none', cursor: 'pointer' }}>
                    Déconnexion
                </button>
            </div>

            <p>Bienvenue, <strong>{email}</strong> !</p>

            <div style={{ padding: '20px', backgroundColor: '#f8f9fa', borderLeft: '4px solid #28a745', marginTop: '20px' }}>
                <h3>Test de l'API sécurisée :</h3>
                {error && <p style={{ color: 'red' }}>Erreur : {error}</p>}
                {message && <p style={{ color: 'green' }}>✅ {message}</p>}
                {!message && !error && <p>Chargement...</p>}
            </div>
        </div>
    );
}
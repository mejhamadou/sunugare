import { useState } from 'react';
import { api } from '../services/api';

export default function Badgeage() {
    const [badge, setBadge] = useState('');
    const [typeScan, setTypeScan] = useState<'SORTIE' | 'ENTREE'>('SORTIE');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleScan = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage(''); setError('');
        try {
            const voyage = await api.scannerBadge(badge, typeScan);
            setMessage(`Succès ! Le voyage ${voyage.ligne?.villeDepart?.nom} ➔ ${voyage.ligne?.villeArrivee?.nom} est maintenant ${voyage.statut}.`);
            setBadge('');
        } catch (err: any) {
            setError(err.message);
        }
    };

    return (
        <div style={{ maxWidth: '500px', margin: '50px auto' }}>
            <div className="card">
                <h2 style={{ marginBottom: '20px' }}>📡 Borne de Badgeage Chauffeur</h2>

                {message && <div style={{ backgroundColor: '#D1FAE5', color: '#065F46', padding: '15px', borderRadius: '8px', marginBottom: '20px', fontWeight: 'bold' }}>{message}</div>}
                {error && <div style={{ backgroundColor: '#FEE2E2', color: '#B91C1C', padding: '15px', borderRadius: '8px', marginBottom: '20px' }}>{error}</div>}

                <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                    <button
                        onClick={() => setTypeScan('SORTIE')}
                        style={{ flex: 1, backgroundColor: typeScan === 'SORTIE' ? '#F59E0B' : '#ccc' }}
                    >
                        🚌 Sortie de gare
                    </button>
                    <button
                        onClick={() => setTypeScan('ENTREE')}
                        style={{ flex: 1, backgroundColor: typeScan === 'ENTREE' ? '#10B981' : '#ccc' }}
                    >
                        🏁 Entrée destination
                    </button>
                </div>

                <form onSubmit={handleScan} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    <label>Numéro de badge du chauffeur</label>
                    <input
                        type="text"
                        value={badge}
                        onChange={(e) => setBadge(e.target.value.toUpperCase())}
                        placeholder="Ex: BADGE-123"
                        required
                        style={{ fontSize: '20px', textAlign: 'center', padding: '15px' }}
                    />
                    <button type="submit" style={{ padding: '15px', fontSize: '18px' }}>
                        Valider le scan
                    </button>
                </form>
            </div>
        </div>
    );
}
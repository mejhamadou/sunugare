import { useState } from 'react';
import { api } from '../services/api';

export default function Controle() {
    const [numeroBillet, setNumeroBillet] = useState('');
    const [resultat, setResultat] = useState<any>(null);
    const [error, setError] = useState('');

    const handleValider = async (e: React.FormEvent) => {
        e.preventDefault();
        setResultat(null);
        setError('');

        try {
            const billet = await api.validerBillet(numeroBillet);
            setResultat(billet);
            setNumeroBillet('');
        } catch (err: any) {
            setError(err.message);
        }
    };

    return (
        <div>
            <h1 style={{ marginBottom: '20px' }}>Contrôle à l'embarquement</h1>

            <div className="grid-cards" style={{ gridTemplateColumns: '1fr 1fr' }}>

                {/* FORMULAIRE DE SCAN */}
                <div className="card">
                    <h3>Scanner un billet</h3>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '20px', fontSize: '14px' }}>
                        Entrez le numéro de billet (ex: SUN-XXXXXX) pour valider l'embarquement.
                    </p>

                    <form onSubmit={handleValider} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <input
                            type="text"
                            placeholder="SUN-XXXXXX"
                            value={numeroBillet}
                            onChange={(e) => setNumeroBillet(e.target.value.toUpperCase())}
                            required
                            style={{ fontSize: '18px', textAlign: 'center', letterSpacing: '2px' }}
                        />
                        <button type="submit" style={{ padding: '15px', fontSize: '16px' }}>
                            Valider le billet
                        </button>
                    </form>
                </div>

                {/* RÉSULTAT DU SCAN */}
                <div className="card">
                    <h3>Résultat</h3>

                    {!resultat && !error && (
                        <div style={{ height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
                            En attente d'un scan...
                        </div>
                    )}

                    {error && (
                        <div style={{ backgroundColor: '#FEE2E2', color: '#B91C1C', padding: '20px', borderRadius: '8px', textAlign: 'center' }}>
                            <h2 style={{ fontSize: '20px', marginBottom: '10px' }}>❌ Accès Refusé</h2>
                            <p>{error}</p>
                        </div>
                    )}

                    {resultat && (
                        <div style={{ backgroundColor: '#D1FAE5', color: '#065F46', padding: '20px', borderRadius: '8px' }}>
                            <h2 style={{ fontSize: '20px', marginBottom: '15px', textAlign: 'center' }}>✅ Billet Valide</h2>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '14px' }}>
                                <p><strong>Passager :</strong> {resultat.nomPassager}</p>
                                <p><strong>Siège :</strong> {resultat.numeroSiege}</p>
                                <p><strong>Voyage :</strong> {resultat.voyage?.ligne?.villeDepart?.nom} ➔ {resultat.voyage?.ligne?.villeArrivee?.nom}</p>
                                <p><strong>Billet :</strong> {resultat.numeroBillet}</p>
                                <p><strong>Statut :</strong> Marqué comme UTILISÉ</p>
                            </div>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}
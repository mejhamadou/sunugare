import { useState } from 'react';

export default function SuiviColis() {
    const [code, setCode] = useState('');
    const [colis, setColis] = useState<any>(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleRecherche = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(''); setColis(null); setLoading(true);

        try {
            const response = await fetch(`/api/colis/suivi/${code.toUpperCase()}`);
            if (!response.ok) throw new Error("Aucun colis trouvé avec ce code.");
            const data = await response.json();
            setColis(data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#F8FAFC', display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '80px', fontFamily: 'sans-serif' }}>
            <img src="/logo.png" alt="SUNUGARE" style={{ height: '80px', marginBottom: '30px' }} />

            <div className="card" style={{ width: '100%', maxWidth: '500px', textAlign: 'center' }}>
                <h1 style={{ marginBottom: '10px', color: 'var(--text-main)' }}>Suivi de colis</h1>
                <p style={{ color: 'var(--text-muted)', marginBottom: '30px' }}>Entrez le code fourni lors de l'envoi pour suivre votre marchandise.</p>

                <form onSubmit={handleRecherche} style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                    <input
                        type="text"
                        placeholder="COL-XXXXXX"
                        value={code}
                        onChange={(e) => setCode(e.target.value.toUpperCase())}
                        required
                        style={{ flex: 1, textAlign: 'center', fontSize: '18px', letterSpacing: '2px' }}
                    />
                    <button type="submit" disabled={loading} style={{ padding: '0 20px' }}>
                        {loading ? '...' : 'Suivre'}
                    </button>
                </form>

                {error && <div style={{ color: '#EF4444', backgroundColor: '#FEE2E2', padding: '15px', borderRadius: '8px' }}>{error}</div>}

                {colis && (
                    <div style={{ textAlign: 'left', backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '8px', padding: '20px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #E2E8F0', paddingBottom: '10px', marginBottom: '15px' }}>
                            <strong style={{ fontSize: '18px' }}>{colis.codeSuivi}</strong>
                            <span style={{ backgroundColor: colis.statut === 'ARRIVE' ? '#D1FAE5' : '#DBEAFE', color: colis.statut === 'ARRIVE' ? '#059669' : '#1E40AF', padding: '4px 12px', borderRadius: '12px', fontWeight: 'bold', fontSize: '14px' }}>
                {colis.statut === 'EN_ATTENTE' ? 'En attente' : colis.statut === 'EN_TRANSIT' ? 'En transit' : colis.statut === 'ARRIVE' ? 'Arrivé' : 'Livré'}
              </span>
                        </div>

                        <p><strong>Description :</strong> {colis.description}</p>
                        <p><strong>Expéditeur :</strong> {colis.expediteurNom}</p>
                        <p><strong>Destinataire :</strong> {colis.destinataireNom}</p>
                        <p><strong>Trajet :</strong> {colis.voyage?.ligne?.villeDepart?.nom} ➔ {colis.voyage?.ligne?.villeArrivee?.nom}</p>
                        <p><strong>Prix :</strong> {colis.prix} FCFA</p>
                    </div>
                )}
            </div>
        </div>
    );
}
import { useState, useEffect } from 'react';

export default function ReservationPublique() {
    const [voyages, setVoyages] = useState<any[]>([]);
    const [selectedVoyage, setSelectedVoyage] = useState<any>(null);
    const [formData, setFormData] = useState({ nomPassager: '', telephonePassager: '', numeroSiege: '' });
    const [billetGenere, setBilletGenere] = useState<any>(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true); // ✅ Ajout d'un état de chargement

    useEffect(() => {
        // On appelle la route publique (sans token)
        fetch('/api/voyages/public/disponibles')
            .then(res => {
                if (!res.ok) throw new Error("Erreur serveur");
                return res.json();
            })
            .then(data => {
                console.log("Données reçues :", data); // ✅ Pour vérifier dans la console
                setVoyages(data || []);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setError("Impossible de charger les voyages.");
                setLoading(false);
            });
    }, []);

    const handleReserver = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        try {
            const response = await fetch('/api/billets/public/reserver', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    voyageId: selectedVoyage.id,
                    nomPassager: formData.nomPassager,
                    telephonePassager: formData.telephonePassager,
                    numeroSiege: Number(formData.numeroSiege)
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Erreur de réservation');
            }

            const billet = await response.json();
            setBilletGenere(billet);
        } catch (err: any) {
            setError(err.message);
        }
    };

    if (loading) return <div style={{ textAlign: 'center', marginTop: '50px' }}>Chargement des voyages...</div>;

    if (billetGenere) {
        return (
            <div style={{ padding: '50px', textAlign: 'center', fontFamily: 'sans-serif' }}>
                <h1 style={{ color: '#10B981' }}>✅ Réservation Confirmée !</h1>
                <p>Votre numéro de billet est : <strong>{billetGenere.numeroBillet}</strong></p>
                <p>Présentez ce numéro à l'embarquement.</p>
                <button onClick={() => window.location.reload()} style={{ marginTop: '20px', padding: '10px 20px', backgroundColor: '#1E3A8A', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Réserver un autre billet</button>
            </div>
        );
    }

    return (
        <div style={{ padding: '40px', maxWidth: '800px', margin: '0 auto', fontFamily: 'sans-serif', backgroundColor: '#F8FAFC', minHeight: '100vh' }}>
            <h1 style={{ marginBottom: '30px', textAlign: 'center' }}>Réservez votre voyage</h1>

            {error && <div style={{ color: 'red', textAlign: 'center', marginBottom: '20px' }}>{error}</div>}

            {!selectedVoyage ? (
                <div style={{ display: 'grid', gap: '15px' }}>
                    {voyages.length > 0 ? voyages.map(v => (
                        <div key={v.id} style={{ backgroundColor: 'white', padding: '20px', borderRadius: '10px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <h3 style={{ margin: 0 }}>{v.ligne?.villeDepart?.nom} ➔ {v.ligne?.villeArrivee?.nom}</h3>
                                <p style={{ margin: '5px 0 0 0', color: '#666' }}>Départ : {new Date(v.dateDepart).toLocaleString('fr-FR')}</p>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <p style={{ margin: 0, fontSize: '20px', fontWeight: 'bold', color: '#1E3A8A' }}>{v.prix} FCFA</p>
                                <button onClick={() => setSelectedVoyage(v)} style={{ marginTop: '10px', backgroundColor: '#1E3A8A', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '5px', cursor: 'pointer' }}>
                                    Choisir
                                </button>
                            </div>
                        </div>
                    )) : (
                        <p style={{ textAlign: 'center' }}>Aucun voyage disponible pour le moment.</p>
                    )}
                </div>
            ) : (
                <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '10px', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>
                    <button onClick={() => setSelectedVoyage(null)} style={{ background: 'none', border: 'none', color: '#1E3A8A', cursor: 'pointer', marginBottom: '20px' }}>← Retour</button>
                    <h2>{selectedVoyage.ligne?.villeDepart?.nom} ➔ {selectedVoyage.ligne?.villeArrivee?.nom}</h2>
                    <p>Départ : {new Date(selectedVoyage.dateDepart).toLocaleString('fr-FR')} | Prix : {selectedVoyage.prix} FCFA</p>

                    <form onSubmit={handleReserver} style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '20px' }}>
                        <div>
                            <label>Nom complet</label>
                            <input type="text" value={formData.nomPassager} onChange={(e) => setFormData({...formData, nomPassager: e.target.value})} required style={{ width: '100%', padding: '10px', marginTop: '5px', borderRadius: '5px', border: '1px solid #ccc' }} />
                        </div>
                        <div>
                            <label>Téléphone</label>
                            <input type="text" value={formData.telephonePassager} onChange={(e) => setFormData({...formData, telephonePassager: e.target.value})} required style={{ width: '100%', padding: '10px', marginTop: '5px', borderRadius: '5px', border: '1px solid #ccc' }} />
                        </div>
                        <div>
                            <label>Numéro de siège souhaité</label>
                            <input type="number" value={formData.numeroSiege} onChange={(e) => setFormData({...formData, numeroSiege: e.target.value})} required style={{ width: '100%', padding: '10px', marginTop: '5px', borderRadius: '5px', border: '1px solid #ccc' }} />
                        </div>
                        <button type="submit" style={{ marginTop: '20px', backgroundColor: '#10B981', color: 'white', padding: '15px', border: 'none', borderRadius: '5px', fontSize: '16px', cursor: 'pointer', fontWeight: 'bold' }}>
                            Payer & Réserver
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
}
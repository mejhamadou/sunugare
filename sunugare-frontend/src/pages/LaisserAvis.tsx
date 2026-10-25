import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

export default function LaisserAvis() {
    const { billetId } = useParams();
    const [billet, setBillet] = useState<any>(null);
    const [noteChauffeur, setNoteChauffeur] = useState(5);
    const [noteVehicule, setNoteVehicule] = useState(5);
    const [commentaire, setCommentaire] = useState('');
    const [envoye, setEnvoye] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        fetch(`/api/avis/billet/${billetId}`)
            .then(res => res.json())
            .then(data => setBillet(data))
            .catch(() => setError("Billet introuvable."));
    }, [billetId]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const response = await fetch('/api/avis', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ billetId: Number(billetId), noteChauffeur, noteVehicule, commentaire })
        });

        if (response.ok) setEnvoye(true);
        else setError("Erreur lors de l'envoi de l'avis.");
    };

    if (envoye) return <div style={{ textAlign: 'center', marginTop: '100px', fontSize: '24px' }}>🙏 Merci pour votre retour !</div>;
    if (error) return <div style={{ textAlign: 'center', marginTop: '100px', color: 'red' }}>{error}</div>;
    if (!billet) return <div style={{ textAlign: 'center', marginTop: '100px' }}>Chargement...</div>;

    return (
        <div style={{ maxWidth: '500px', margin: '50px auto', fontFamily: 'sans-serif', padding: '20px' }}>
            <h2>Votre avis sur le voyage</h2>
            <p>Bonjour <strong>{billet.nomPassager}</strong>, comment s'est passé votre trajet {billet.voyage.ligne.villeDepart.nom} ➔ {billet.voyage.ligne.villeArrivee.nom} ?</p>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginTop: '20px' }}>
                <div>
                    <label>Note pour le chauffeur</label>
                    <div style={{ display: 'flex', gap: '10px', fontSize: '24px', cursor: 'pointer' }}>
                        {[1,2,3,4,5].map(star => (
                            <span key={star} onClick={() => setNoteChauffeur(star)}>{star <= noteChauffeur ? '⭐' : '☆'}</span>
                        ))}
                    </div>
                </div>

                <div>
                    <label>Note pour le véhicule (propreté, confort)</label>
                    <div style={{ display: 'flex', gap: '10px', fontSize: '24px', cursor: 'pointer' }}>
                        {[1,2,3,4,5].map(star => (
                            <span key={star} onClick={() => setNoteVehicule(star)}>{star <= noteVehicule ? '⭐' : '☆'}</span>
                        ))}
                    </div>
                </div>

                <div>
                    <label>Un commentaire ? (Optionnel)</label>
                    <textarea value={commentaire} onChange={(e) => setCommentaire(e.target.value)} rows={3} style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }} />
                </div>

                <button type="submit" style={{ backgroundColor: '#10B981', color: 'white', padding: '15px', border: 'none', borderRadius: '5px', fontSize: '16px', cursor: 'pointer' }}>Envoyer mon avis</button>
            </form>
        </div>
    );
}
import { useState, useEffect } from 'react';
import { api } from '../services/api';

export default function Chauffeurs() {
    const [chauffeurs, setChauffeurs] = useState<any[]>([]);
    const [compagnies, setCompagnies] = useState<any[]>([]);

    const [formData, setFormData] = useState({
        nom: '', prenom: '', telephone: '', numeroPermis: '', compagnieId: '', dateExpirationPermis: ''
    });

    const [editingId, setEditingId] = useState<number | null>(null);

    const loadData = async () => {
        try {
            const [c, comp] = await Promise.all([api.getChauffeurs(), api.getCompagnies()]);
            setChauffeurs(c);
            setCompagnies(comp);
        } catch (err) { console.error(err); }
    };

    useEffect(() => { loadData(); }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const dataToSend = {
                nom: formData.nom,
                prenom: formData.prenom,
                telephone: formData.telephone,
                numeroPermis: formData.numeroPermis,
                compagnieId: Number(formData.compagnieId),
                dateExpirationPermis: formData.dateExpirationPermis ? formData.dateExpirationPermis : null
            };

            if (editingId) {
                await api.updateChauffeur(editingId, dataToSend);
                setEditingId(null);
            } else {
                await api.createChauffeur(dataToSend);
            }

            setFormData({ nom: '', prenom: '', telephone: '', numeroPermis: '', compagnieId: '', dateExpirationPermis: '' });
            loadData();
        } catch (err) {
            alert("Erreur lors de l'enregistrement");
        }
    };

    const handleEditClick = (c: any) => {
        setEditingId(c.id);
        setFormData({
            nom: c.nom,
            prenom: c.prenom,
            telephone: c.telephone || '',
            numeroPermis: c.numeroPermis || '',
            compagnieId: c.compagnie.id.toString(),
            dateExpirationPermis: c.dateExpirationPermis || ''
        });
    };

    const getBadgeConformite = (dateExpiration: string | null) => {
        if (!dateExpiration) return <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Non renseigné</span>;
        const dateExp = new Date(dateExpiration);
        const diffJours = Math.ceil((dateExp.getTime() - new Date().getTime()) / (1000 * 3600 * 24));

        if (diffJours < 0) return <span style={{ fontSize: '11px', backgroundColor: '#FEE2E2', color: '#B91C1C', padding: '2px 8px', borderRadius: '12px' }}>🚨 Expiré</span>;
        if (diffJours <= 30) return <span style={{ fontSize: '11px', backgroundColor: '#FEF3C7', color: '#D97706', padding: '2px 8px', borderRadius: '12px' }}>⚠️ Expire bientôt ({diffJours}j)</span>;
        return <span style={{ fontSize: '11px', backgroundColor: '#D1FAE5', color: '#059669', padding: '2px 8px', borderRadius: '12px' }}>✅ Valide</span>;
    };

    return (
        <div>
            <h1 style={{ marginBottom: '20px' }}>Gestion des Conducteurs</h1>

            <div className="grid-cards" style={{ gridTemplateColumns: '1fr 2fr' }}>
                <div className="card">
                    <h3>{editingId ? 'Modifier le conducteur' : 'Ajouter un conducteur'}</h3>
                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>

                        <label>Prénom</label>
                        <input type="text" value={formData.prenom} onChange={(e) => setFormData({...formData, prenom: e.target.value})} required />

                        <label>Nom</label>
                        <input type="text" value={formData.nom} onChange={(e) => setFormData({...formData, nom: e.target.value})} required />

                        <label>Téléphone</label>
                        <input type="text" value={formData.telephone} onChange={(e) => setFormData({...formData, telephone: e.target.value})} />

                        <label>Numéro de permis</label>
                        <input type="text" value={formData.numeroPermis} onChange={(e) => setFormData({...formData, numeroPermis: e.target.value})} />

                        <label>Expiration du permis</label>
                        <input type="date" value={formData.dateExpirationPermis} onChange={(e) => setFormData({...formData, dateExpirationPermis: e.target.value})} />

                        <label>Compagnie</label>
                        <select value={formData.compagnieId} onChange={(e) => setFormData({...formData, compagnieId: e.target.value})} required>
                            <option value="">Sélectionner une compagnie</option>
                            {compagnies.map(c => <option key={c.id} value={c.id}>{c.nom}</option>)}
                        </select>

                        <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                            <button type="submit" style={{ flex: 1 }}>{editingId ? 'Enregistrer' : 'Ajouter'}</button>
                            {editingId && (
                                <button type="button" className="btn-danger" onClick={() => { setEditingId(null); setFormData({ nom: '', prenom: '', telephone: '', numeroPermis: '', compagnieId: '', dateExpirationPermis: '' }); }} style={{ flex: 1 }}>
                                    Annuler
                                </button>
                            )}
                        </div>
                    </form>
                </div>

                <div className="card">
                    <h3>Liste des conducteurs ({chauffeurs.length})</h3>
                    <ul>
                        {chauffeurs.map(c => (
                            <li key={c.id} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div>
                                        <strong>{c.prenom} {c.nom}</strong>
                                        <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{c.compagnie.nom} | Permis: {c.numeroPermis}</div>
                                    </div>
                                    <div>{getBadgeConformite(c.dateExpirationPermis)}</div>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                    <button onClick={() => handleEditClick(c)} style={{ padding: '4px 10px', fontSize: '11px', backgroundColor: '#3B82F6' }}>
                                        Modifier
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
}
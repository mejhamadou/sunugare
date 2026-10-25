import { useState, useEffect } from 'react';
import { api } from '../services/api';

export default function Vehicules() {
    const [vehicules, setVehicules] = useState<any[]>([]);
    const [compagnies, setCompagnies] = useState<any[]>([]);

    // Formulaire
    const [formData, setFormData] = useState({
        immatriculation: '', marque: '', capacite: '', compagnieId: '',
        dateExpirationAssurance: '', dateExpirationCarteGrise: ''
    });

    // État pour le mode édition
    const [editingId, setEditingId] = useState<number | null>(null);

    const loadData = async () => {
        try {
            const [v, c] = await Promise.all([api.getVehicules(), api.getCompagnies()]);
            setVehicules(v);
            setCompagnies(c);
        } catch (err) { console.error(err); }
    };

    useEffect(() => { loadData(); }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            // ✅ On transforme les chaînes vides en null pour le backend
            const dataToSend = {
                immatriculation: formData.immatriculation,
                marque: formData.marque || null,
                capacite: Number(formData.capacite),
                compagnieId: Number(formData.compagnieId),
                dateExpirationAssurance: formData.dateExpirationAssurance ? formData.dateExpirationAssurance : null,
                dateExpirationCarteGrise: formData.dateExpirationCarteGrise ? formData.dateExpirationCarteGrise : null
            };

            if (editingId) {
                await api.updateVehicule(editingId, dataToSend); // Plus besoin de @ts-ignore si api.ts est bon
                setEditingId(null);
            } else {
                await api.createVehicule(dataToSend);
            }

            setFormData({ immatriculation: '', marque: '', capacite: '', compagnieId: '', dateExpirationAssurance: '', dateExpirationCarteGrise: '' });
            loadData();
        } catch (err) {
            console.error(err);
            alert("Erreur lors de l'enregistrement");
        }
    };

    const handleEditClick = (v: any) => {
        setEditingId(v.id);
        setFormData({
            immatriculation: v.immatriculation,
            marque: v.marque || '',
            capacite: v.capacite.toString(),
            compagnieId: v.compagnie.id.toString(),
            dateExpirationAssurance: v.dateExpirationAssurance || '',
            dateExpirationCarteGrise: v.dateExpirationCarteGrise || ''
        });
    };

    // ✅ Fonction pour générer les badges d'alerte
    const getBadgeConformite = (dateExpiration: string | null) => {
        if (!dateExpiration) return <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Non renseigné</span>;

        const dateExp = new Date(dateExpiration);
        const aujourdhui = new Date();
        const diffJours = Math.ceil((dateExp.getTime() - aujourdhui.getTime()) / (1000 * 3600 * 24));

        if (diffJours < 0) {
            return <span style={{ fontSize: '11px', backgroundColor: '#FEE2E2', color: '#B91C1C', padding: '2px 8px', borderRadius: '12px' }}>🚨 Expiré</span>;
        }
        if (diffJours <= 30) {
            return <span style={{ fontSize: '11px', backgroundColor: '#FEF3C7', color: '#D97706', padding: '2px 8px', borderRadius: '12px' }}>⚠️ Expire bientôt ({diffJours}j)</span>;
        }
        return <span style={{ fontSize: '11px', backgroundColor: '#D1FAE5', color: '#059669', padding: '2px 8px', borderRadius: '12px' }}>✅ Valide</span>;
    };

    return (
        <div>
            <h1 style={{ marginBottom: '20px' }}>Gestion des Véhicules</h1>

            <div className="grid-cards" style={{ gridTemplateColumns: '1fr 2fr' }}>
                <div className="card">
                    <h3>{editingId ? 'Modifier le véhicule' : 'Ajouter un véhicule'}</h3>
                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>

                        <label>Immatriculation</label>
                        <input type="text" value={formData.immatriculation} onChange={(e) => setFormData({...formData, immatriculation: e.target.value})} required />

                        <label>Marque</label>
                        <input type="text" value={formData.marque} onChange={(e) => setFormData({...formData, marque: e.target.value})} />

                        <label>Capacité (places)</label>
                        <input type="number" value={formData.capacite} onChange={(e) => setFormData({...formData, capacite: e.target.value})} required />

                        <label>Expiration Assurance</label>
                        <input type="date" value={formData.dateExpirationAssurance} onChange={(e) => setFormData({...formData, dateExpirationAssurance: e.target.value})} />

                        <label>Expiration Carte Grise</label>
                        <input type="date" value={formData.dateExpirationCarteGrise} onChange={(e) => setFormData({...formData, dateExpirationCarteGrise: e.target.value})} />

                        <label>Compagnie</label>
                        <select value={formData.compagnieId} onChange={(e) => setFormData({...formData, compagnieId: e.target.value})} required>
                            <option value="">Sélectionner une compagnie</option>
                            {compagnies.map(c => <option key={c.id} value={c.id}>{c.nom}</option>)}
                        </select>

                        <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                            <button type="submit" style={{ flex: 1 }}>{editingId ? 'Enregistrer' : 'Ajouter'}</button>
                            {editingId && (
                                <button type="button" className="btn-danger" onClick={() => { setEditingId(null); setFormData({ immatriculation: '', marque: '', capacite: '', compagnieId: '', dateExpirationAssurance: '', dateExpirationCarteGrise: '' }); }} style={{ flex: 1 }}>
                                    Annuler
                                </button>
                            )}
                        </div>
                    </form>
                </div>

                <div className="card">
                    <h3>Flotte de véhicules ({vehicules.length})</h3>
                    <ul>
                        {vehicules.map(v => (
                            <li key={v.id} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div>
                                        <strong>{v.immatriculation}</strong> - {v.marque}
                                        <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{v.compagnie.nom}</div>
                                    </div>
                                    <div style={{ color: 'var(--primary)', fontWeight: 'bold' }}>
                                        {v.capacite} places
                                    </div>
                                </div>

                                <div style={{ display: 'flex', gap: '20px', fontSize: '12px', borderTop: '1px solid var(--border)', paddingTop: '10px' }}>
                                    <div>Assurance : {getBadgeConformite(v.dateExpirationAssurance)}</div>
                                    <div>Carte Grise : {getBadgeConformite(v.dateExpirationCarteGrise)}</div>
                                </div>

                                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                    <button onClick={() => handleEditClick(v)} style={{ padding: '4px 10px', fontSize: '11px', backgroundColor: '#3B82F6' }}>
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
import { useState, useEffect } from 'react';
import { api } from '../services/api';

export default function Vehicules() {
    const [vehicules, setVehicules] = useState<any[]>([]);
    const [compagnies, setCompagnies] = useState<any[]>([]);

    // Formulaire
    const [formData, setFormData] = useState({ immatriculation: '', marque: '', capacite: '', compagnieId: '' });

    const loadData = async () => {
        try {
            const [v, c] = await Promise.all([api.getVehicules(), api.getCompagnies()]);
            setVehicules(v);
            setCompagnies(c);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => { loadData(); }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await api.createVehicule({
            immatriculation: formData.immatriculation,
            marque: formData.marque,
            capacite: Number(formData.capacite),
            compagnieId: Number(formData.compagnieId)
        });
        setFormData({ immatriculation: '', marque: '', capacite: '', compagnieId: '' });
        loadData();
    };

    return (
        <div>
            <h1 style={{ marginBottom: '20px' }}>Gestion des Véhicules</h1>

            <div className="grid-cards" style={{ gridTemplateColumns: '1fr 2fr' }}>
                {/* Formulaire d'ajout */}
                <div className="card">
                    <h3>Ajouter un véhicule</h3>
                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column' }}>
                        <label>Immatriculation</label>
                        <input type="text" value={formData.immatriculation} onChange={(e) => setFormData({...formData, immatriculation: e.target.value})} required />

                        <label>Marque</label>
                        <input type="text" value={formData.marque} onChange={(e) => setFormData({...formData, marque: e.target.value})} />

                        <label>Capacité (places)</label>
                        <input type="number" value={formData.capacite} onChange={(e) => setFormData({...formData, capacite: e.target.value})} required />

                        <label>Compagnie</label>
                        <select value={formData.compagnieId} onChange={(e) => setFormData({...formData, compagnieId: e.target.value})} required>
                            <option value="">Sélectionner une compagnie</option>
                            {compagnies.map(c => <option key={c.id} value={c.id}>{c.nom}</option>)}
                        </select>

                        <button type="submit" style={{ marginTop: '10px' }}>Enregistrer le véhicule</button>
                    </form>
                </div>

                {/* Liste des véhicules */}
                <div className="card">
                    <h3>Flotte de véhicules ({vehicules.length})</h3>
                    <ul>
                        {vehicules.map(v => (
                            <li key={v.id} style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <div>
                                    <strong>{v.immatriculation}</strong> - {v.marque}
                                    <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{v.compagnie.nom}</div>
                                </div>
                                <div style={{ alignSelf: 'center', color: 'var(--primary)' }}>
                                    {v.capacite} places
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
}
import { useState, useEffect } from 'react';
import { api } from '../services/api';

export default function Chauffeurs() {
    const [chauffeurs, setChauffeurs] = useState<any[]>([]);
    const [compagnies, setCompagnies] = useState<any[]>([]);

    const [formData, setFormData] = useState({
        nom: '',
        prenom: '',
        telephone: '',
        numeroPermis: '',
        compagnieId: ''
    });

    const loadData = async () => {
        try {
            // On récupère les deux listes en même temps
            const [listeChauffeurs, listeCompagnies] = await Promise.all([
                api.getChauffeurs(),
                api.getCompagnies()
            ]);
            setChauffeurs(listeChauffeurs);
            setCompagnies(listeCompagnies);
        } catch (err) {
            console.error("Erreur de chargement:", err);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.createChauffeur({
                nom: formData.nom,
                prenom: formData.prenom,
                telephone: formData.telephone,
                numeroPermis: formData.numeroPermis,
                compagnieId: Number(formData.compagnieId)
            });
            setFormData({ nom: '', prenom: '', telephone: '', numeroPermis: '', compagnieId: '' });
            loadData(); // Recharge la liste
        } catch (err) {
            console.error("Erreur de création:", err);
        }
    };

    return (
        <div>
            <h1 style={{ marginBottom: '20px' }}>Gestion des Conducteurs</h1>

            <div className="grid-cards" style={{ gridTemplateColumns: '1fr 2fr' }}>
                {/* FORMULAIRE */}
                <div className="card">
                    <h3>Ajouter un conducteur</h3>
                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column' }}>

                        <label>Prénom</label>
                        <input
                            type="text"
                            value={formData.prenom}
                            onChange={(e) => setFormData({...formData, prenom: e.target.value})}
                            required
                        />

                        <label>Nom</label>
                        <input
                            type="text"
                            value={formData.nom}
                            onChange={(e) => setFormData({...formData, nom: e.target.value})}
                            required
                        />

                        <label>Téléphone</label>
                        <input
                            type="text"
                            value={formData.telephone}
                            onChange={(e) => setFormData({...formData, telephone: e.target.value})}
                        />

                        <label>Numéro de permis</label>
                        <input
                            type="text"
                            value={formData.numeroPermis}
                            onChange={(e) => setFormData({...formData, numeroPermis: e.target.value})}
                        />

                        <label>Compagnie</label>
                        <select
                            value={formData.compagnieId}
                            onChange={(e) => setFormData({...formData, compagnieId: e.target.value})}
                            required
                        >
                            <option value="">Sélectionner une compagnie</option>
                            {/* ⚠️ C'est cette partie qui affiche la liste */}
                            {compagnies.map((c) => (
                                <option key={c.id} value={c.id}>{c.nom}</option>
                            ))}
                        </select>

                        <button type="submit" style={{ marginTop: '10px' }}>Enregistrer le conducteur</button>
                    </form>
                </div>

                {/* LISTE */}
                <div className="card">
                    <h3>Liste des conducteurs ({chauffeurs.length})</h3>
                    <ul>
                        {chauffeurs.map(c => (
                            <li key={c.id} style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <div>
                                    <strong>{c.prenom} {c.nom}</strong>
                                    <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Permis: {c.numeroPermis || 'Non renseigné'}</div>
                                </div>
                                <div style={{ alignSelf: 'center', color: 'var(--text-muted)' }}>
                                    {c.compagnie?.nom}
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
}
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';

export default function Admin() {
    const navigate = useNavigate();

    // États pour les données
    const [villes, setVilles] = useState<any[]>([]);
    const [compagnies, setCompagnies] = useState<any[]>([]);
    const [gares, setGares] = useState<any[]>([]);

    // États pour les formulaires
    const [newVille, setNewVille] = useState('');
    const [newCompagnie, setNewCompagnie] = useState({ nom: '', telephone: '', email: '' });
    const [newGare, setNewGare] = useState({ nom: '', adresse: '', villeId: '' });

    // Charger les données au démarrage
    const loadData = async () => {
        try {
            const [v, c, g] = await Promise.all([api.getVilles(), api.getCompagnies(), api.getGares()]);
            setVilles(v);
            setCompagnies(c);
            setGares(g);
        } catch (err) {
            console.error(err);
            navigate('/login'); // Si le token est invalide, on redirige
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    // Handlers de création
    const handleCreateVille = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newVille) return;
        await api.createVille(newVille);
        setNewVille('');
        loadData(); // Recharger la liste
    };

    const handleCreateCompagnie = async (e: React.FormEvent) => {
        e.preventDefault();
        await api.createCompagnie(newCompagnie);
        setNewCompagnie({ nom: '', telephone: '', email: '' });
        loadData();
    };

    const handleCreateGare = async (e: React.FormEvent) => {
        e.preventDefault();
        await api.createGare({
            nom: newGare.nom,
            adresse: newGare.adresse,
            villeId: Number(newGare.villeId)
        });
        setNewGare({ nom: '', adresse: '', villeId: '' });
        loadData();
    };

    return (
        <div style={{ maxWidth: '900px', margin: '30px auto', fontFamily: 'sans-serif' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <h1>Administration SUNUGARE</h1>
                <button onClick={() => navigate('/dashboard')} style={{ padding: '8px' }}>Retour au Dashboard</button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px', marginTop: '20px' }}>

                {/* SECTION VILLES */}
                <div style={{ border: '1px solid #ccc', padding: '15px', borderRadius: '8px' }}>
                    <h3>Villes</h3>
                    <form onSubmit={handleCreateVille} style={{ display: 'flex', gap: '5px', marginBottom: '10px' }}>
                        <input type="text" placeholder="Nom de la ville" value={newVille} onChange={(e) => setNewVille(e.target.value)} style={{ flex: 1, padding: '5px' }} />
                        <button type="submit">Ajouter</button>
                    </form>
                    <ul>
                        {villes.map(v => <li key={v.id}>{v.nom}</li>)}
                    </ul>
                </div>

                {/* SECTION COMPAGNIES */}
                <div style={{ border: '1px solid #ccc', padding: '15px', borderRadius: '8px' }}>
                    <h3>Compagnies</h3>
                    <form onSubmit={handleCreateCompagnie} style={{ display: 'flex', flexDirection: 'column', gap: '5px', marginBottom: '10px' }}>
                        <input type="text" placeholder="Nom" value={newCompagnie.nom} onChange={(e) => setNewCompagnie({...newCompagnie, nom: e.target.value})} required style={{ padding: '5px' }} />
                        <input type="text" placeholder="Téléphone" value={newCompagnie.telephone} onChange={(e) => setNewCompagnie({...newCompagnie, telephone: e.target.value})} style={{ padding: '5px' }} />
                        <input type="email" placeholder="Email" value={newCompagnie.email} onChange={(e) => setNewCompagnie({...newCompagnie, email: e.target.value})} style={{ padding: '5px' }} />
                        <button type="submit">Ajouter</button>
                    </form>
                    <ul>
                        {compagnies.map(c => <li key={c.id}>{c.nom}</li>)}
                    </ul>
                </div>

                {/* SECTION GARES */}
                <div style={{ border: '1px solid #ccc', padding: '15px', borderRadius: '8px' }}>
                    <h3>Gares</h3>
                    <form onSubmit={handleCreateGare} style={{ display: 'flex', flexDirection: 'column', gap: '5px', marginBottom: '10px' }}>
                        <input type="text" placeholder="Nom" value={newGare.nom} onChange={(e) => setNewGare({...newGare, nom: e.target.value})} required style={{ padding: '5px' }} />
                        <input type="text" placeholder="Adresse" value={newGare.adresse} onChange={(e) => setNewGare({...newGare, adresse: e.target.value})} style={{ padding: '5px' }} />
                        <select value={newGare.villeId} onChange={(e) => setNewGare({...newGare, villeId: e.target.value})} required style={{ padding: '5px' }}>
                            <option value="">Choisir une ville</option>
                            {villes.map(v => <option key={v.id} value={v.id}>{v.nom}</option>)}
                        </select>
                        <button type="submit">Ajouter</button>
                    </form>
                    <ul>
                        {gares.map(g => <li key={g.id}>{g.nom} ({g.ville.nom})</li>)}
                    </ul>
                </div>

            </div>
        </div>
    );
}
import { useState, useEffect } from 'react';
import { api } from '../services/api';

export default function Infrastructures() {
    const [activeTab, setActiveTab] = useState<'lignes' | 'terminaux' | 'quais'>('lignes');

    // Données
    const [gares, setGares] = useState<any[]>([]);
    const [villes, setVilles] = useState<any[]>([]);
    const [lignes, setLignes] = useState<any[]>([]);
    const [terminaux, setTerminaux] = useState<any[]>([]);
    const [quais, setQuais] = useState<any[]>([]);

    // Formulaires
    const [newLigne, setNewLigne] = useState({ villeDepartId: '', villeArriveeId: '', distanceKm: '' });
    const [newTerminal, setNewTerminal] = useState({ nom: '', gareId: '' });
    const [newQuai, setNewQuai] = useState({ numero: '', terminalId: '' });

    const [editingLigneId, setEditingLigneId] = useState<number | null>(null);
    // const [editingTerminalId, setEditingTerminalId] = useState<number | null>(null);
    // const [editingQuaiId, setEditingQuaiId] = useState<number | null>(null);


    const loadData = async () => {
        try {
            const [g, v, l, t, q] = await Promise.all([
                api.getGares(), api.getVilles(), api.getLignes(), api.getTerminaux(), api.getQuais()
            ]);
            setGares(g);
            setVilles(v);
            setLignes(l);
            setTerminaux(t);
            setQuais(q);
        } catch (err) { console.error(err); }
    };

    useEffect(() => { loadData(); }, []);

    const handleCreateLigne = async (e: React.FormEvent) => {
        e.preventDefault();
        if (editingLigneId) {
            await api.updateLigne(editingLigneId, {
                villeDepartId: Number(newLigne.villeDepartId),
                villeArriveeId: Number(newLigne.villeArriveeId),
                distanceKm: Number(newLigne.distanceKm)
            });
            setEditingLigneId(null);
        } else {
            await api.createLigne({
                villeDepartId: Number(newLigne.villeDepartId),
                villeArriveeId: Number(newLigne.villeArriveeId),
                distanceKm: Number(newLigne.distanceKm)
            });
        }
        setNewLigne({ villeDepartId: '', villeArriveeId: '', distanceKm: '' });
        loadData();
    };

    const handleEditLigneClick = (l: any) => {
        setEditingLigneId(l.id);
        setNewLigne({
            villeDepartId: l.villeDepart.id.toString(),
            villeArriveeId: l.villeArrivee.id.toString(),
            distanceKm: l.distanceKm.toString()
        });
    };

    const handleCreateTerminal = async (e: React.FormEvent) => {
        e.preventDefault();
        await api.createTerminal({ nom: newTerminal.nom, gareId: Number(newTerminal.gareId) });
        setNewTerminal({ nom: '', gareId: '' });
        loadData();
    };

    const handleCreateQuai = async (e: React.FormEvent) => {
        e.preventDefault();
        await api.createQuai({ numero: newQuai.numero, terminalId: Number(newQuai.terminalId) });
        setNewQuai({ numero: '', terminalId: '' });
        loadData();
    };

    return (
        <div>
            <h1 style={{ marginBottom: '20px' }}>Gestion des Infrastructures</h1>

            {/* ONGLETS */}
            <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                <button onClick={() => setActiveTab('lignes')} style={{ backgroundColor: activeTab === 'lignes' ? 'var(--primary)' : '#ccc' }}>🗺️ Lignes</button>
                <button onClick={() => setActiveTab('terminaux')} style={{ backgroundColor: activeTab === 'terminaux' ? 'var(--primary)' : '#ccc' }}>🏢 Terminaux</button>
                <button onClick={() => setActiveTab('quais')} style={{ backgroundColor: activeTab === 'quais' ? 'var(--primary)' : '#ccc' }}>🚏 Quais</button>
            </div>

            {/* CONTENU DES ONGLETS */}
            <div className="grid-cards" style={{ gridTemplateColumns: '1fr 2fr' }}>

                {/* ONGLET LIGNES */}
                {activeTab === 'lignes' && (
                    <>
                        <div className="card">
                            <h3>Créer une ligne</h3>
                            <form onSubmit={handleCreateLigne} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                <label>Ville de départ</label>
                                <select value={newLigne.villeDepartId} onChange={(e) => setNewLigne({...newLigne, villeDepartId: e.target.value})} required>
                                    <option value="">Choisir</option>
                                    {villes.map(v => <option key={v.id} value={v.id}>{v.nom}</option>)}
                                </select>
                                <label>Ville d'arrivée</label>
                                <select value={newLigne.villeArriveeId} onChange={(e) => setNewLigne({...newLigne, villeArriveeId: e.target.value})} required>
                                    <option value="">Choisir</option>
                                    {villes.map(v => <option key={v.id} value={v.id}>{v.nom}</option>)}
                                </select>
                                <label>Distance (km)</label>
                                <input type="number" value={newLigne.distanceKm} onChange={(e) => setNewLigne({...newLigne, distanceKm: e.target.value})} required />
                                <button type="submit" style={{ marginTop: '10px' }}>Créer la ligne</button>
                            </form>
                        </div>
                        <div className="card">
                            <h3>Lignes existantes</h3>
                            <ul>
                                {lignes.map(l => (
                                    <li key={l.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <span><strong>{l.villeDepart.nom} ➔ {l.villeArrivee.nom}</strong> ({l.distanceKm} km)</span>
                                        <button onClick={() => handleEditLigneClick(l)} style={{ padding: '4px 8px', fontSize: '11px', backgroundColor: '#3B82F6' }}>Modifier</button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </>
                )}

                {/* ONGLET TERMINAUX */}
                {activeTab === 'terminaux' && (
                    <>
                        <div className="card">
                            <h3>Créer un terminal</h3>
                            <form onSubmit={handleCreateTerminal} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                <label>Nom du terminal</label>
                                <input type="text" placeholder="Ex: Terminal 1" value={newTerminal.nom} onChange={(e) => setNewTerminal({...newTerminal, nom: e.target.value})} required />
                                <label>Gare associée</label>
                                <select value={newTerminal.gareId} onChange={(e) => setNewTerminal({...newTerminal, gareId: e.target.value})} required>
                                    <option value="">Choisir une gare</option>
                                    {gares.map(g => <option key={g.id} value={g.id}>{g.nom}</option>)}
                                </select>
                                <button type="submit" style={{ marginTop: '10px' }}>Créer le terminal</button>
                            </form>
                        </div>
                        <div className="card">
                            <h3>Terminaux existants</h3>
                            <ul>
                                {terminaux.map(t => (
                                    <li key={t.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <span><strong>{t.nom} </strong> (Gare: {t.gare?.nom})</span>
                                        <button onClick={() => handleEditLigneClick(t)} style={{ padding: '4px 8px', fontSize: '11px', backgroundColor: '#3B82F6' }}>Modifier</button>
                                    </li>
                                ))}
                            </ul>
                            </div>
                    </>
                )}

                {/* ONGLET QUAIS */}
                {activeTab === 'quais' && (
                    <>
                        <div className="card">
                            <h3>Créer un quai</h3>
                            <form onSubmit={handleCreateQuai} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                <label>Numéro du quai</label>
                                <input type="text" placeholder="Ex: Quai A1" value={newQuai.numero} onChange={(e) => setNewQuai({...newQuai, numero: e.target.value})} required />
                                <label>Terminal associé</label>
                                <select value={newQuai.terminalId} onChange={(e) => setNewQuai({...newQuai, terminalId: e.target.value})} required>
                                    <option value="">Choisir un terminal</option>
                                    {terminaux.map(t => <option key={t.id} value={t.id}>{t.nom} ({t.gare?.nom})</option>)}
                                </select>
                                <button type="submit" style={{ marginTop: '10px' }}>Créer le quai</button>
                            </form>
                        </div>
                        <div className="card">
                            <h3>Quais existants</h3>
                            <ul>
                                {quais.map(q => (
                                    <li key={q.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <span><strong>{q.nom} </strong> </span>
                                        <button onClick={() => handleEditLigneClick(q)} style={{ padding: '4px 8px', fontSize: '11px', backgroundColor: '#3B82F6' }}>Modifier</button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </>
                )}

            </div>
        </div>
    );
}
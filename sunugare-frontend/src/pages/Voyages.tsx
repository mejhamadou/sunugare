import { useState, useEffect } from 'react';
import { api } from '../services/api';

export default function Voyages() {
    const [voyages, setVoyages] = useState<any[]>([]);

    // Données pour le formulaire
    const [lignes, setLignes] = useState<any[]>([]);
    const [vehicules, setVehicules] = useState<any[]>([]);
    const [chauffeurs, setChauffeurs] = useState<any[]>([]);
    const [quais, setQuais] = useState<any[]>([]);

    // État du formulaire
    const [formData, setFormData] = useState({
        ligneId: '', vehiculeId: '', chauffeurId: '', quaiId: '', dateDepart: '', prix: ''
    });

    const loadData = async () => {
        try {
            const [v, l, veh, chauf, q] = await Promise.all([
                api.getVoyages(), api.getLignes(), api.getVehicules(), api.getChauffeurs(), api.getQuais()
            ]);
            setVoyages(v);
            setLignes(l);
            setVehicules(veh);
            setChauffeurs(chauf);
            setQuais(q);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => { loadData(); }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.createVoyage({
                ligneId: Number(formData.ligneId),
                vehiculeId: Number(formData.vehiculeId),
                chauffeurId: Number(formData.chauffeurId),
                quaiId: Number(formData.quaiId),
                dateDepart: formData.dateDepart + ':00',
                prix: Number(formData.prix)
            });
            setFormData({ ligneId: '', vehiculeId: '', chauffeurId: '', quaiId: '', dateDepart: '', prix: '' });
            loadData();
        } catch (err) {
            alert("Erreur lors de la création du voyage");
        }
    };

    // ✅ Nouvelle fonction pour changer le statut
    const handleStatut = async (id: number, nouveauStatut: string) => {
        try {
            await api.updateVoyageStatut(id, nouveauStatut);
            loadData(); // On recharge la liste pour voir le changement
        } catch (err) {
            alert("Erreur lors du changement de statut");
        }
    };

    // Petit dictionnaire pour les couleurs des statuts
    const getStatutColor = (statut: string) => {
        switch (statut) {
            case 'PLANIFIE': return { bg: '#EFF6FF', text: '#1E40AF' }; // Bleu
            case 'EMBARQUEMENT': return { bg: '#FEF3C7', text: '#D97706' }; // Orange
            case 'DEPART': return { bg: '#E0E7FF', text: '#4338CA' }; // Indigo
            case 'ARRIVE': return { bg: '#D1FAE5', text: '#059669' }; // Vert
            case 'ANNULE': return { bg: '#FEE2E2', text: '#B91C1C' }; // Rouge
            default: return { bg: '#F3F4F6', text: '#374151' };
        }
    };

    return (
        <div>
            <h1 style={{ marginBottom: '20px' }}>Planification des Voyages</h1>

            <div className="grid-cards" style={{ gridTemplateColumns: '1fr 2fr' }}>

                {/* FORMULAIRE DE CRÉATION */}
                <div className="card">
                    <h3>Programmer un départ</h3>
                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                        <label>Ligne</label>
                        <select value={formData.ligneId} onChange={(e) => setFormData({...formData, ligneId: e.target.value})} required>
                            <option value="">Choisir une ligne</option>
                            {lignes.map(l => (
                                <option key={l.id} value={l.id}>{l.villeDepart.nom} ➔ {l.villeArrivee.nom}</option>
                            ))}
                        </select>

                        <label>Véhicule</label>
                        <select value={formData.vehiculeId} onChange={(e) => setFormData({...formData, vehiculeId: e.target.value})} required>
                            <option value="">Choisir un véhicule</option>
                            {vehicules.map(v => (
                                <option key={v.id} value={v.id}>{v.immatriculation}</option>
                            ))}
                        </select>

                        <label>Chauffeur</label>
                        <select value={formData.chauffeurId} onChange={(e) => setFormData({...formData, chauffeurId: e.target.value})} required>
                            <option value="">Choisir un chauffeur</option>
                            {chauffeurs.map(c => (
                                <option key={c.id} value={c.id}>{c.prenom} {c.nom}</option>
                            ))}
                        </select>

                        <label>Quai</label>
                        <select value={formData.quaiId} onChange={(e) => setFormData({...formData, quaiId: e.target.value})} required>
                            <option value="">Choisir un quai</option>
                            {quais.map(q => (
                                <option key={q.id} value={q.id}>{q.numero}</option>
                            ))}
                        </select>

                        <label>Date et Heure</label>
                        <input type="datetime-local" value={formData.dateDepart} onChange={(e) => setFormData({...formData, dateDepart: e.target.value})} required />

                        <label>Prix (FCFA)</label>
                        <input type="number" value={formData.prix} onChange={(e) => setFormData({...formData, prix: e.target.value})} required />

                        <button type="submit" style={{ marginTop: '15px' }}>Créer le voyage</button>
                    </form>
                </div>

                {/* LISTE DES VOYAGES */}
                <div className="card">
                    <h3>Départs programmés ({voyages.length})</h3>
                    <ul>
                        {voyages.map(v => {
                            const colors = getStatutColor(v.statut);
                            return (
                                <li key={v.id} style={{ display: 'flex', flexDirection: 'column', gap: '15px', padding: '15px' }}>

                                    {/* En-tête de la carte */}
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                        <div>
                                            <h4 style={{ margin: 0, fontSize: '16px', color: 'var(--text-main)' }}>
                                                {v.ligne?.villeDepart?.nom} ➔ {v.ligne?.villeArrivee?.nom}
                                            </h4>
                                            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                        {new Date(v.dateDepart).toLocaleString('fr-FR')} | Quai {v.quai?.numero}
                      </span>
                                        </div>
                                        <div style={{ textAlign: 'right' }}>
                                            <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>{v.prix} FCFA</div>
                                            <span style={{
                                                fontSize: '11px',
                                                backgroundColor: colors.bg,
                                                color: colors.text,
                                                padding: '4px 10px',
                                                borderRadius: '12px',
                                                fontWeight: 'bold'
                                            }}>
                        {v.statut}
                      </span>
                                        </div>
                                    </div>

                                    {/* Pied de carte : détails et actions */}
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border)', paddingTop: '10px' }}>
                                        <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                                            Bus: {v.vehicule?.immatriculation} | Chauffeur: {v.chauffeur?.prenom}
                                        </div>

                                        {/* ✅ Boutons d'action */}
                                        <div style={{ display: 'flex', gap: '5px' }}>
                                            {v.statut === 'PLANIFIE' && (
                                                <button onClick={() => handleStatut(v.id, 'EMBARQUEMENT')} style={{ padding: '6px 12px', fontSize: '12px', backgroundColor: '#F59E0B' }}>
                                                    Passer à l'embarquement
                                                </button>
                                            )}
                                            {v.statut === 'EMBARQUEMENT' && (
                                                <button onClick={() => handleStatut(v.id, 'DEPART')} style={{ padding: '6px 12px', fontSize: '12px', backgroundColor: '#4F46E5' }}>
                                                    Déclarer le départ
                                                </button>
                                            )}
                                            {v.statut === 'DEPART' && (
                                                <button onClick={() => handleStatut(v.id, 'ARRIVE')} style={{ padding: '6px 12px', fontSize: '12px', backgroundColor: '#10B981' }}>
                                                    Déclarer l'arrivée
                                                </button>
                                            )}
                                            {(v.statut === 'PLANIFIE' || v.statut === 'EMBARQUEMENT') && (
                                                <button onClick={() => handleStatut(v.id, 'ANNULE')} className="btn-danger" style={{ padding: '6px 12px', fontSize: '12px' }}>
                                                    Annuler
                                                </button>
                                            )}
                                        </div>
                                    </div>

                                </li>
                            );
                        })}
                    </ul>
                </div>

            </div>
        </div>
    );
}
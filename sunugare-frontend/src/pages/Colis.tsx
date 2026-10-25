import { useState, useEffect } from 'react';
import { api } from '../services/api';

export default function Colis() {
    const [colis, setColis] = useState<any[]>([]);
    const [voyages, setVoyages] = useState<any[]>([]);

    const [formData, setFormData] = useState({
        voyageId: '', expediteurNom: '', expediteurTel: '',
        destinataireNom: '', destinataireTel: '', description: '', poidsKg: '', prix: ''
    });

    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');

    const loadData = async () => {
        try {
            const [c, v] = await Promise.all([api.getColis(), api.getVoyages()]);
            setColis(c);
            setVoyages(v);
        } catch (err) { console.error(err); }
    };

    useEffect(() => { loadData(); }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(''); setSuccess('');
        try {
            const nouveauColis = await api.createColis({
                ...formData,
                voyageId: Number(formData.voyageId),
                poidsKg: formData.poidsKg ? Number(formData.poidsKg) : null,
                prix: Number(formData.prix)
            });
            setSuccess(`Colis enregistré ! Code de suivi : ${nouveauColis.codeSuivi}`);
            setFormData({ voyageId: '', expediteurNom: '', expediteurTel: '', destinataireNom: '', destinataireTel: '', description: '', poidsKg: '', prix: '' });
            loadData();
        } catch (err) { setError("Erreur lors de l'enregistrement"); }
    };

    const handleStatut = async (id: number, statut: string) => {
        await api.changerStatutColis(id, statut);
        loadData();
    };

    const getStatutColor = (statut: string) => {
        switch (statut) {
            case 'EN_ATTENTE': return { bg: '#FEF3C7', text: '#D97706' };
            case 'EN_TRANSIT': return { bg: '#DBEAFE', text: '#1E40AF' };
            case 'ARRIVE': return { bg: '#D1FAE5', text: '#059669' };
            case 'LIVRE': return { bg: '#F3F4F6', text: '#374151' };
            default: return { bg: '#F3F4F6', text: '#374151' };
        }
    };

    return (
        <div>
            <h1 style={{ marginBottom: '20px' }}>Gestion des Colis</h1>

            <div className="grid-cards" style={{ gridTemplateColumns: '1fr 2fr' }}>
                {/* FORMULAIRE */}
                <div className="card">
                    <h3>Enregistrer un colis</h3>
                    {error && <div style={{ backgroundColor: '#FEE2E2', color: '#B91C1C', padding: '10px', borderRadius: '5px', marginBottom: '15px' }}>{error}</div>}
                    {success && <div style={{ backgroundColor: '#D1FAE5', color: '#065F46', padding: '10px', borderRadius: '5px', marginBottom: '15px', fontWeight: 'bold' }}>{success}</div>}

                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <label>Voyage associé</label>
                        <select value={formData.voyageId} onChange={(e) => setFormData({...formData, voyageId: e.target.value})} required>
                            <option value="">Choisir un voyage</option>
                            {voyages.map(v => (
                                <option key={v.id} value={v.id}>{v.ligne?.villeDepart?.nom} ➔ {v.ligne?.villeArrivee?.nom} ({new Date(v.dateDepart).toLocaleDateString()})</option>
                            ))}
                        </select>

                        <label>Nom de l'expéditeur</label>
                        <input type="text" value={formData.expediteurNom} onChange={(e) => setFormData({...formData, expediteurNom: e.target.value})} required />

                        <label>Téléphone expéditeur</label>
                        <input type="text" value={formData.expediteurTel} onChange={(e) => setFormData({...formData, expediteurTel: e.target.value})} required />

                        <label>Nom du destinataire</label>
                        <input type="text" value={formData.destinataireNom} onChange={(e) => setFormData({...formData, destinataireNom: e.target.value})} required />

                        <label>Téléphone destinataire</label>
                        <input type="text" value={formData.destinataireTel} onChange={(e) => setFormData({...formData, destinataireTel: e.target.value})} required />

                        <label>Description (ex: Carton de tissus)</label>
                        <input type="text" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} required />

                        <label>Poids (kg) - Optionnel</label>
                        <input type="number" step="0.1" value={formData.poidsKg} onChange={(e) => setFormData({...formData, poidsKg: e.target.value})} />

                        <label>Prix (FCFA)</label>
                        <input type="number" value={formData.prix} onChange={(e) => setFormData({...formData, prix: e.target.value})} required />

                        <button type="submit" style={{ marginTop: '15px' }}>Enregistrer le colis</button>
                    </form>
                </div>

                {/* LISTE DES COLIS */}
                <div className="card">
                    <h3>Colis enregistrés ({colis.length})</h3>
                    <ul>
                        {colis.map(c => {
                            const colors = getStatutColor(c.statut);
                            return (
                                <li key={c.id} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div>
                                            <strong style={{ color: 'var(--primary)' }}>{c.codeSuivi}</strong> - {c.description}
                                            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                                                De: {c.expediteurNom} ➔ À: {c.destinataireNom}
                                            </div>
                                            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                                                Voyage: {c.voyage?.ligne?.villeDepart?.nom} ➔ {c.voyage?.ligne?.villeArrivee?.nom}
                                            </div>
                                        </div>
                                        <div style={{ textAlign: 'right' }}>
                                            <div style={{ fontWeight: 'bold' }}>{c.prix} FCFA</div>
                                            <span style={{ fontSize: '11px', backgroundColor: colors.bg, color: colors.text, padding: '2px 8px', borderRadius: '12px', fontWeight: 'bold' }}>
                        {c.statut}
                      </span>
                                        </div>
                                    </div>

                                    <div style={{ display: 'flex', gap: '5px', justifyContent: 'flex-end', borderTop: '1px solid var(--border)', paddingTop: '10px' }}>
                                        {c.statut === 'EN_ATTENTE' && (
                                            <button onClick={() => handleStatut(c.id, 'EN_TRANSIT')} style={{ padding: '4px 8px', fontSize: '11px', backgroundColor: '#3B82F6' }}>Départ (En transit)</button>
                                        )}
                                        {c.statut === 'EN_TRANSIT' && (
                                            <button onClick={() => handleStatut(c.id, 'ARRIVE')} style={{ padding: '4px 8px', fontSize: '11px', backgroundColor: '#10B981' }}>Arrivé à destination</button>
                                        )}
                                        {c.statut === 'ARRIVE' && (
                                            <button onClick={() => handleStatut(c.id, 'LIVRE')} style={{ padding: '4px 8px', fontSize: '11px', backgroundColor: '#374151' }}>Remis au client</button>
                                        )}
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
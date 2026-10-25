import { useState, useEffect } from 'react';
import { api } from '../services/api';

export default function Abonnements() {
    const [abonnements, setAbonnements] = useState<any[]>([]);
    const [lignes, setLignes] = useState<any[]>([]);

    // Formulaire
    const [formData, setFormData] = useState({
        nomPassager: '',
        telephone: '',
        ligneId: '',
        dateDebut: new Date().toISOString().split('T')[0], // Date du jour par défaut
        dateFin: ''
    });

    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const loadData = async () => {
        try {
            const [abos, ligs] = await Promise.all([api.getAbonnements(), api.getLignes()]);
            setAbonnements(abos);
            setLignes(ligs);
        } catch (err) { console.error(err); }
    };

    useEffect(() => { loadData(); }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(''); setSuccess('');

        try {
            const nouvelAbo = await api.createAbonnement({
                nomPassager: formData.nomPassager,
                telephone: formData.telephone,
                ligneId: Number(formData.ligneId),
                dateDebut: formData.dateDebut,
                dateFin: formData.dateFin
            });

            setSuccess(`Abonnement créé avec succès ! Code : ${nouvelAbo.codeAbonnement}`);
            setFormData({ nomPassager: '', telephone: '', ligneId: '', dateDebut: new Date().toISOString().split('T')[0], dateFin: '' });
            loadData();
        } catch (err: any) {
            setError(err.message);
        }
    };

    // Fonction pour vérifier si l'abonnement est expiré visuellement
    const isExpire = (dateFin: string) => {
        return new Date(dateFin) < new Date();
    };

    return (
        <div>
            <h1 style={{ marginBottom: '20px' }}>Gestion des Abonnements</h1>

            <div className="grid-cards" style={{ gridTemplateColumns: '1fr 2fr' }}>

                {/* FORMULAIRE DE CRÉATION */}
                <div className="card">
                    <h3>Nouvel abonnement</h3>

                    {error && <div style={{ backgroundColor: '#FEE2E2', color: '#B91C1C', padding: '10px', borderRadius: '5px', marginBottom: '15px' }}>{error}</div>}
                    {success && <div style={{ backgroundColor: '#D1FAE5', color: '#059669', padding: '10px', borderRadius: '5px', marginBottom: '15px' }}>{success}</div>}

                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <label>Nom du passager</label>
                        <input type="text" value={formData.nomPassager} onChange={(e) => setFormData({...formData, nomPassager: e.target.value})} required />

                        <label>Téléphone</label>
                        <input type="text" value={formData.telephone} onChange={(e) => setFormData({...formData, telephone: e.target.value})} required />

                        <label>Ligne concernée</label>
                        <select value={formData.ligneId} onChange={(e) => setFormData({...formData, ligneId: e.target.value})} required>
                            <option value="">Choisir une ligne</option>
                            {lignes.map(l => (
                                <option key={l.id} value={l.id}>{l.villeDepart.nom} ➔ {l.villeArrivee.nom}</option>
                            ))}
                        </select>

                        <label>Date de début</label>
                        <input type="date" value={formData.dateDebut} onChange={(e) => setFormData({...formData, dateDebut: e.target.value})} required />

                        <label>Date de fin</label>
                        <input type="date" value={formData.dateFin} onChange={(e) => setFormData({...formData, dateFin: e.target.value})} required />

                        <button type="submit" style={{ marginTop: '15px' }}>Créer l'abonnement</button>
                    </form>
                </div>

                {/* LISTE DES ABONNEMENTS */}
                <div className="card">
                    <h3>Abonnements en cours ({abonnements.length})</h3>
                    <ul>
                        {abonnements.map(a => {
                            const expire = isExpire(a.dateFin);
                            return (
                                <li key={a.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', opacity: expire ? 0.6 : 1 }}>
                                    <div>
                                        <strong style={{ color: 'var(--text-main)' }}>{a.nomPassager}</strong>
                                        <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{a.telephone}</div>
                                        <div style={{ fontSize: '12px', color: 'var(--primary)', marginTop: '4px' }}>
                                            {a.ligne?.villeDepart?.nom} ➔ {a.ligne?.villeArrivee?.nom}
                                        </div>
                                    </div>

                                    <div style={{ textAlign: 'right' }}>
                                        <div style={{ fontSize: '14px', fontWeight: 'bold', color: 'var(--text-main)' }}>{a.codeAbonnement}</div>
                                        <div style={{ fontSize: '11px', marginTop: '4px' }}>
                                            Du {new Date(a.dateDebut).toLocaleDateString('fr-FR')} au {new Date(a.dateFin).toLocaleDateString('fr-FR')}
                                        </div>
                                        <span style={{
                                            display: 'inline-block',
                                            marginTop: '6px',
                                            fontSize: '11px',
                                            padding: '2px 8px',
                                            borderRadius: '12px',
                                            backgroundColor: expire ? '#FEE2E2' : '#D1FAE5',
                                            color: expire ? '#B91C1C' : '#059669',
                                            fontWeight: 'bold'
                                        }}>
                      {expire ? 'EXPIRÉ' : 'ACTIF'}
                    </span>
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
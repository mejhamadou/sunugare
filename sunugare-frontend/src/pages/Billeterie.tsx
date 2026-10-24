import { useState, useEffect } from 'react';
import { api } from '../services/api';

export default function Billetterie() {
    const [voyages, setVoyages] = useState<any[]>([]);
    const [billets, setBillets] = useState<any[]>([]);

    // Formulaire
    const [formData, setFormData] = useState({
        voyageId: '',
        nomPassager: '',
        telephonePassager: '',
        numeroSiege: ''
    });

    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const [qrModal, setQrModal] = useState<{ id: number, nom: string } | null>(null);

    const loadData = async () => {
        try {
            const [v, b] = await Promise.all([api.getVoyages(), api.getBillets()]);
            setVoyages(v);
            setBillets(b);
        } catch (err) {
            console.error(err);
        }
    };



    useEffect(() => { loadData(); }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        try {
            const nouveauBillet = await api.createBillet({
                voyageId: Number(formData.voyageId),
                nomPassager: formData.nomPassager,
                telephonePassager: formData.telephonePassager,
                numeroSiege: Number(formData.numeroSiege)
            });

            setSuccess(`Billet vendu avec succès ! Code : ${nouveauBillet.numeroBillet}`);
            setFormData({ voyageId: '', nomPassager: '', telephonePassager: '', numeroSiege: '' });
            loadData();
        } catch (err: any) {
            setError(err.message);
        }
    };

    // Récupérer le voyage sélectionné pour afficher ses détails
    const selectedVoyage = voyages.find(v => v.id === Number(formData.voyageId));

    return (
        <div>
            <h1 style={{ marginBottom: '20px' }}>Caisse / Billetterie</h1>

            {qrModal && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
                    <div className="card" style={{ width: '350px', textAlign: 'center', position: 'relative' }}>
                        <h3>Billet : {qrModal.nom}</h3>
                        <img
                            src={`http://localhost:8082/api/billets/${qrModal.id}/qrcode`}
                            alt="QR Code"
                            style={{ width: '200px', height: '200px', margin: '20px 0', border: '1px solid #ccc' }}
                        />
                        <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '20px' }}>Scannez ce code à l'embarquement</p>
                        <button onClick={() => setQrModal(null)} style={{ width: '100%' }}>Fermer</button>
                    </div>
                </div>
            )}

            <div className="grid-cards" style={{ gridTemplateColumns: '1fr 2fr' }}>

                {/* ... (Ton formulaire reste identique) ... */}
                <div className="card">
                    <h3>Vendre un billet</h3>
                    {error && <div style={{ backgroundColor: '#FEE2E2', color: '#B91C1C', padding: '10px', borderRadius: '5px', marginBottom: '15px' }}>{error}</div>}
                    {success && <div style={{ backgroundColor: '#D1FAE5', color: '#059669', padding: '10px', borderRadius: '5px', marginBottom: '15px' }}>{success}</div>}
                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <label>Voyage</label>
                        <select value={formData.voyageId} onChange={(e) => setFormData({...formData, voyageId: e.target.value})} required>
                            <option value="">Sélectionner un voyage</option>
                            {voyages.map(v => (
                                <option key={v.id} value={v.id}>{v.ligne?.villeDepart?.nom} ➔ {v.ligne?.villeArrivee?.nom}</option>
                            ))}
                        </select>
                        <label>Nom du passager</label>
                        <input type="text" value={formData.nomPassager} onChange={(e) => setFormData({...formData, nomPassager: e.target.value})} required />
                        <label>Téléphone</label>
                        <input type="text" value={formData.telephonePassager} onChange={(e) => setFormData({...formData, telephonePassager: e.target.value})} />
                        <label>Numéro de siège</label>
                        <input type="number" value={formData.numeroSiege} onChange={(e) => setFormData({...formData, numeroSiege: e.target.value})} required />
                        <button type="submit" style={{ marginTop: '15px' }}>Encaisser & Générer Billet</button>
                    </form>
                </div>

                {/* LISTE DES BILLETS VENDUS */}
                <div className="card">
                    <h3>Billets vendus ({billets.length})</h3>
                    <ul>
                        {billets.map(b => (
                            <li key={b.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <strong style={{ color: 'var(--text-main)' }}>{b.nomPassager}</strong> (Siège {b.numeroSiege})
                                    <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                                        {b.voyage?.ligne?.villeDepart?.nom} ➔ {b.voyage?.ligne?.villeArrivee?.nom}
                                    </div>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '5px' }}>
                                    <div style={{ fontSize: '14px', fontWeight: 'bold', color: 'var(--primary)' }}>{b.numeroBillet}</div>
                                    <button
                                        onClick={() => setQrModal({ id: b.id, nom: b.nomPassager })}
                                        style={{ padding: '4px 10px', fontSize: '11px', backgroundColor: '#10B981' }}
                                    >
                                        Voir QR Code
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
import { useState, useEffect } from 'react';
import { api } from '../services/api';

export default function Billetterie() {
    const [voyages, setVoyages] = useState<any[]>([]);
    const [billets, setBillets] = useState<any[]>([]);

    // Formulaire de vente
    const [formData, setFormData] = useState({
        voyageId: '',
        nomPassager: '',
        telephonePassager: '',
        numeroSiege: '',
        methodePaiement: 'ESPECES'
    });

    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Modales
    const [qrModal, setQrModal] = useState<{ id: number, nom: string } | null>(null);
    const [bagageModal, setBagageModal] = useState<{ id: number, nom: string } | null>(null);

    // Formulaire Bagage
    const [bagageForm, setBagageForm] = useState({ description: '', poidsKg: '', tarif: '0' });

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

            await api.payerBillet(nouveauBillet.id, formData.methodePaiement);

            setSuccess(`Billet vendu et payé par ${formData.methodePaiement} ! Code : ${nouveauBillet.numeroBillet}`);
            setFormData({ voyageId: '', nomPassager: '', telephonePassager: '', numeroSiege: '', methodePaiement: 'ESPECES' });
            loadData();
        } catch (err: any) {
            setError(err.message);
        }
    };

    const handleAddBagage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!bagageModal) return;

        try {
            await api.ajouterBagage({
                billetId: bagageModal.id,
                description: bagageForm.description,
                poidsKg: Number(bagageForm.poidsKg),
                tarif: Number(bagageForm.tarif)
            });
            setBagageModal(null); // On ferme la modale
            setBagageForm({ description: '', poidsKg: '', tarif: '0' });
            alert("Bagage enregistré avec succès !");
        } catch (err) {
            alert("Erreur lors de l'enregistrement du bagage");
        }
    };

    const handleAnnuler = async (id: number) => {
        if (!window.confirm("Voulez-vous vraiment annuler et rembourser ce billet ?")) return;
        try {
            await api.annulerBillet(id);
            loadData(); // Recharge la liste
        } catch (err: any) {
            alert(err.message);
        }
    };

    return (
        <div>
            <h1 style={{ marginBottom: '20px' }}>Caisse / Billetterie</h1>

            {/* MODALE QR CODE */}
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

            {/* ✅ MODALE BAGAGE */}
            {bagageModal && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
                    <div className="card" style={{ width: '400px' }}>
                        <h3>Ajouter un bagage pour {bagageModal.nom}</h3>
                        <form onSubmit={handleAddBagage} style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '15px' }}>
                            <label>Description (ex: Valise noire)</label>
                            <input type="text" value={bagageForm.description} onChange={(e) => setBagageForm({...bagageForm, description: e.target.value})} required />

                            <label>Poids (kg)</label>
                            <input type="number" step="0.1" value={bagageForm.poidsKg} onChange={(e) => setBagageForm({...bagageForm, poidsKg: e.target.value})} />

                            <label>Tarif (FCFA)</label>
                            <input type="number" value={bagageForm.tarif} onChange={(e) => setBagageForm({...bagageForm, tarif: e.target.value})} required />

                            <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                                <button type="submit" style={{ flex: 1 }}>Enregistrer</button>
                                <button type="button" onClick={() => setBagageModal(null)} className="btn-danger" style={{ flex: 1 }}>Annuler</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div className="grid-cards" style={{ gridTemplateColumns: '1fr 2fr' }}>

                {/* FORMULAIRE DE VENTE */}
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
                        <label>Mode de paiement</label>
                        <select value={formData.methodePaiement} onChange={(e) => setFormData({...formData, methodePaiement: e.target.value})} required>
                            <option value="ESPECES">Espèces</option>
                            <option value="WAVE">Wave</option>
                            <option value="ORANGE_MONEY">Orange Money</option>
                        </select>
                        <button type="submit" style={{ marginTop: '15px' }}>Encaisser & Générer Billet</button>
                    </form>
                </div>

                {/* LISTE DES BILLETS VENDUS */}
                <div className="card">
                    <h3>Billets vendus ({billets.length})</h3>
                    <ul>
                        {billets.map(b => (
                            <li key={b.id} style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                opacity: b.statut === 'ANNULE' ? 0.5 : 1 // On grise les billets annulés
                            }}>

                                {/* Infos Passager */}
                                <div style={{ flex: 1 }}>
                                    <strong style={{ textDecoration: b.statut === 'ANNULE' ? 'line-through' : 'none' }}>
                                            {b.nomPassager}
                                        </strong> (Siège {b.numeroSiege})
                                    <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                                        {b.voyage?.ligne?.villeDepart?.nom} ➔ {b.voyage?.ligne?.villeArrivee?.nom}
                                    </div>
                                    <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                                        Statut : <span style={{
                                        color: b.statut === 'ANNULE' ? '#EF4444' : (b.statut === 'UTILISE' ? '#F59E0B' : '#10B981')
                                    }}>{b.statut}</span>
                                    </div>
                                </div>

                                {/* Numéro de billet */}
                                <div style={{ fontSize: '14px', fontWeight: 'bold', color: 'var(--primary)', marginRight: '20px' }}>
                                    {b.numeroBillet}
                                </div>



                                {/* Actions */}
                                <div style={{ display: 'flex', gap: '5px' }}>
                                    {b.statut === 'VALIDE' && (
                                        <button
                                            onClick={() => handleAnnuler(b.id)}
                                            style={{ padding: '6px 10px', fontSize: '11px', backgroundColor: '#EF4444' }}
                                        >
                                            Annuler
                                        </button>
                                    )}
                                    <button
                                        onClick={() => setBagageModal({ id: b.id, nom: b.nomPassager })}
                                        style={{ padding: '6px 10px', fontSize: '11px', backgroundColor: '#F59E0B' }}
                                    >
                                        🧳 Bagage
                                    </button>
                                    <button
                                        onClick={() => setQrModal({ id: b.id, nom: b.nomPassager })}
                                        style={{ padding: '6px 10px', fontSize: '11px', backgroundColor: '#10B981' }}
                                    >
                                        QR Code
                                    </button>
                                    <a
                                        href={`http://localhost:8082/api/billets/${b.id}/pdf`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        style={{ padding: '6px 10px', fontSize: '11px', backgroundColor: '#3B82F6', color: 'white', textDecoration: 'none', borderRadius: '4px' }}
                                    >
                                        PDF
                                    </a>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
}
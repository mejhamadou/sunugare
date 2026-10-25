import { useState, useEffect } from 'react';
import { api } from '../services/api';

export default function Planning() {
    const [voyages, setVoyages] = useState<any[]>([]);

    const loadData = async () => {
        try {
            const data = await api.getVoyages();
            // On trie les voyages par heure de départ
            data.sort((a: any, b: any) => new Date(a.dateDepart).getTime() - new Date(b.dateDepart).getTime());
            setVoyages(data);
        } catch (err) { console.error(err); }
    };

    useEffect(() => { loadData(); }, []);

    const handleRetard = async (id: number, minutes: number) => {
        await api.signalerRetard(id, minutes);
        loadData(); // On recharge pour voir la nouvelle heure
    };

    // Fonction pour calculer l'heure de départ réelle avec le retard
    const getHeureReelle = (dateDepart: string, retard: number) => {
        const date = new Date(dateDepart);
        date.setMinutes(date.getMinutes() + (retard || 0));
        // ✅ On ajoute le jour et le mois
        return date.toLocaleString('fr-FR', {
            weekday: 'short', day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit'
        });
    };

    // Fonction pour vérifier si le voyage est passé
    const isPasse = (dateDepart: string, retard: number) => {
        const date = new Date(dateDepart);
        date.setMinutes(date.getMinutes() + (retard || 0));
        return date.getTime() < new Date().getTime();
    };

    return (
        <div>
            <h1 style={{ marginBottom: '20px' }}>Planning de la journée</h1>

            <div className="card">
                <h3>Départs programmés (Temps réel)</h3>

                {voyages.length === 0 && <p style={{ color: 'var(--text-muted)' }}>Aucun voyage planifié.</p>}

                <ul>
                    {voyages.map(v => {
                        const estPasse = isPasse(v.dateDepart, v.retardMinutes);

                        return (
                            <li key={v.id} style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                padding: '15px',
                                opacity: estPasse ? 0.5 : 1, // On grise les voyages passés
                                borderLeft: v.retardMinutes > 0 ? '4px solid #EF4444' : '4px solid #10B981' // Bordure rouge si retard
                            }}>
                                <div>
                                    <h4 style={{ margin: 0, fontSize: '16px' }}>
                                        {v.ligne?.villeDepart?.nom} ➔ {v.ligne?.villeArrivee?.nom}
                                    </h4>
                                    <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '5px' }}>
                                        Quai: {v.quai?.numero} | Bus: {v.vehicule?.immatriculation} | Chauffeur: {v.chauffeur?.prenom}
                                    </div>
                                </div>

                                <div style={{ textAlign: 'right' }}>
                                    <div style={{ fontSize: '20px', fontWeight: 'bold', color: v.retardMinutes > 0 ? '#EF4444' : 'var(--text-main)' }}>
                                        {getHeureReelle(v.dateDepart, v.retardMinutes)}
                                    </div>
                                    {v.retardMinutes > 0 && (
                                        <div style={{ fontSize: '12px', color: '#EF4444' }}>
                                            + {v.retardMinutes} min de retard
                                        </div>
                                    )}
                                </div>

                                {/* Actions */}
                                <div style={{ display: 'flex', gap: '5px', marginLeft: '20px' }}>
                                    {!estPasse && v.statut !== 'ANNULE' && (
                                        <>
                                            <button onClick={() => handleRetard(v.id, (v.retardMinutes || 0) + 15)} style={{ padding: '6px 10px', fontSize: '11px', backgroundColor: '#F59E0B' }}>
                                                +15 min
                                            </button>
                                            <button onClick={() => handleRetard(v.id, 0)} style={{ padding: '6px 10px', fontSize: '11px', backgroundColor: '#3B82F6' }}>
                                                Reset
                                            </button>
                                        </>
                                    )}
                                </div>
                            </li>
                        );
                    })}
                </ul>
            </div>
        </div>
    );
}
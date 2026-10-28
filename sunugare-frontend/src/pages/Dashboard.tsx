import { useEffect, useState } from 'react';
import { api } from '../services/api';

export default function Dashboard() {
    const [stats, setStats] = useState<any>(null);
    const [voyagesLive, setVoyagesLive] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const loadLiveData = async () => {
        try {
            // On charge les stats et les voyages en parallèle
            const [statsData, liveData] = await Promise.all([
                api.getDashboardStats(),
                api.getVoyagesLive()
            ]);
            setStats(statsData);
            setVoyagesLive(liveData || []);
        } catch (err) {
            console.error("Erreur de chargement du dashboard", err);
        } finally {
            setLoading(false); // ✅ On arrête le chargement dans tous les cas
        }
    };

    useEffect(() => {
        loadLiveData();
        // Rafraîchissement automatique toutes les 30 secondes
        const interval = setInterval(loadLiveData, 30000);
        return () => clearInterval(interval);
    }, []);

    if (loading) return <p style={{ padding: '20px' }}>Chargement des données en temps réel...</p>;

    // Si les stats n'ont pas pu être chargées du tout
    if (!stats) return <p style={{ padding: '20px', color: 'red' }}>Impossible de charger les statistiques. Vérifiez la console.</p>;

    return (
        <div>
            <h1 style={{ marginBottom: '20px' }}>Tableau de bord Live</h1>

            {/* GRILLE KPI */}
            <div className="grid-cards" style={{ gridTemplateColumns: 'repeat(4, 1fr)', marginBottom: '30px' }}>
                <div className="card" style={{ borderLeft: '4px solid #10B981' }}>
                    <h3 style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Recettes Totales</h3>
                    <p style={{ fontSize: '24px', fontWeight: 'bold' }}>{stats.recettes ? stats.recettes.toLocaleString('fr-FR') : 0} FCFA</p>
                </div>
                <div className="card" style={{ borderLeft: '4px solid #3B82F6' }}>
                    <h3 style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Billets Vendus</h3>
                    <p style={{ fontSize: '24px', fontWeight: 'bold' }}>{stats.totalBillets || 0}</p>
                </div>
                <div className="card" style={{ borderLeft: '4px solid #F59E0B' }}>
                    <h3 style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Voyages Planifiés</h3>
                    <p style={{ fontSize: '24px', fontWeight: 'bold' }}>{stats.voyagesPlanifies || 0}</p>
                </div>
                <div className="card" style={{ borderLeft: '4px solid #8B5CF6' }}>
                    <h3 style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Recettes Wave</h3>
                    <p style={{ fontSize: '24px', fontWeight: 'bold' }}>{stats.recettesWave ? stats.recettesWave.toLocaleString('fr-FR') : 0} FCFA</p>
                </div>
            </div>

            {/* PLANNING DYNAMIQUE */}
            <div className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h3>🟢 Supervision des départs (Temps réel)</h3>
                    <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Mise à jour auto (30s)</span>
                </div>

                {voyagesLive.length === 0 ? (
                    <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '20px' }}>Aucun voyage en cours pour le moment.</p>
                ) : (
                    <ul>
                        {voyagesLive.map(v => {
                            const isArrive = v.statut === 'ARRIVE';
                            const isDepart = v.statut === 'DEPART';

                            return (
                                <li key={v.id} style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    padding: '15px',
                                    borderLeft: `4px solid ${isArrive ? '#10B981' : (isDepart ? '#F59E0B' : '#3B82F6')}`,
                                    opacity: isArrive ? 0.5 : 1,
                                    transition: 'opacity 1s ease'
                                }}>
                                    <div>
                                        <h4 style={{ margin: 0, fontSize: '16px' }}>
                                            {v.ligne?.villeDepart?.nom} ➔ {v.ligne?.villeArrivee?.nom}
                                        </h4>
                                        <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                                            Départ : {new Date(v.dateDepart).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })} | Quai: {v.quai?.numero} | Bus: {v.vehicule?.immatriculation}
                                        </div>
                                    </div>

                                    <div style={{ textAlign: 'right' }}>
                    <span style={{
                        fontSize: '12px',
                        fontWeight: 'bold',
                        padding: '5px 12px',
                        borderRadius: '12px',
                        backgroundColor: isArrive ? '#D1FAE5' : (isDepart ? '#FEF3C7' : '#DBEAFE'),
                        color: isArrive ? '#059669' : (isDepart ? '#D97706' : '#1E40AF')
                    }}>
                      {v.statut === 'PLANIFIE' ? '📅 Planifié' :
                          v.statut === 'EMBARQUEMENT' ? '👥 Embarquement' :
                              v.statut === 'DEPART' ? '🚌 En route' :
                                  '✅ Arrivé'}
                    </span>
                                    </div>
                                </li>
                            );
                        })}
                    </ul>
                )}
            </div>
        </div>
    );
}
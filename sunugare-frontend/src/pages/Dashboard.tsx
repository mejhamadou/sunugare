import { useEffect, useState } from 'react';
import { api } from '../services/api';

export default function Dashboard() {
    const [stats, setStats] = useState<any>(null);
    const [prediction, setPrediction] = useState<any>(null); // ✅ Nouvel état

    useEffect(() => {
        // On charge les stats et la prédiction en parallèle
        Promise.all([api.getDashboardStats(), api.getPrediction()])
            .then(([statsData, predictionData]) => {
                setStats(statsData);
                setPrediction(predictionData);
            })
            .catch(console.error);
    }, []);

    if (!stats || !prediction) return <p>Chargement des données...</p>;

    return (
        <div>
            <h1 style={{ marginBottom: '30px' }}>Tableau de bord</h1>

            {/* GRILLE DE CARTES KPI */}
            <div className="grid-cards" style={{ gridTemplateColumns: 'repeat(2, 1fr)', marginBottom: '20px' }}>

                {/* CARTE 1 : RECETTES TOTALES */}
                <div className="card" style={{ borderLeft: '4px solid #10B981' }}>
                    <h3 style={{ color: 'var(--text-muted)', fontSize: '14px', textTransform: 'uppercase' }}>Recettes Totales</h3>
                    <p style={{ fontSize: '36px', fontWeight: 'bold', marginTop: '10px' }}>
                        {stats.recettes.toLocaleString('fr-FR')} <span style={{ fontSize: '18px' }}>FCFA</span>
                    </p>
                </div>

                {/* CARTE 2 : BILLETS VENDUS */}
                <div className="card" style={{ borderLeft: '4px solid #3B82F6' }}>
                    <h3 style={{ color: 'var(--text-muted)', fontSize: '14px', textTransform: 'uppercase' }}>Billets Vendus</h3>
                    <p style={{ fontSize: '36px', fontWeight: 'bold', marginTop: '10px' }}>
                        {stats.totalBillets}
                    </p>
                </div>
            </div>

            {/* DÉTAIL DES PAIEMENTS */}
            <div className="grid-cards" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
                <div className="card">
                    <h3 style={{ fontSize: '14px', color: 'var(--text-muted)' }}>💵 Espèces</h3>
                    <p style={{ fontSize: '24px', fontWeight: 'bold', marginTop: '10px' }}>{stats.recettesEspeces.toLocaleString('fr-FR')} FCFA</p>
                </div>
                <div className="card">
                    <h3 style={{ fontSize: '14px', color: 'var(--text-muted)' }}>💙 Wave</h3>
                    <p style={{ fontSize: '24px', fontWeight: 'bold', marginTop: '10px' }}>{stats.recettesWave.toLocaleString('fr-FR')} FCFA</p>
                </div>
                <div className="card">
                    <h3 style={{ fontSize: '14px', color: 'var(--text-muted)' }}>🧡 Orange Money</h3>
                    <p style={{ fontSize: '24px', fontWeight: 'bold', marginTop: '10px' }}>{stats.recettesOm.toLocaleString('fr-FR')} FCFA</p>
                </div>
            </div>

                {/* CARTE 3 : VOYAGES A VENIR */}
                <div className="card" style={{ borderLeft: '4px solid #F59E0B' }}>
                    <h3 style={{ color: 'var(--text-muted)', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                        Voyages Planifiés
                    </h3>
                    <p style={{ fontSize: '36px', fontWeight: 'bold', color: 'var(--text-main)', marginTop: '10px' }}>
                        {stats.voyagesPlanifies}
                    </p>
                </div>

            {/* CARTE IA */}
            <div className="card" style={{ marginTop: '20px', borderLeft: '4px solid #8B5CF6', backgroundColor: '#F5F3FF' }}>
                <h3 style={{ color: '#6D28D9', fontSize: '16px', marginBottom: '10px' }}>🤖 Prédiction IA (Affluence)</h3>
                <p style={{ fontSize: '14px' }}>
                    Selon l'historique (<em>{prediction.tendance}</em>), nous prévoyons environ <strong>{prediction.predictionBilletsDemain}</strong> billets vendus demain.
                </p>
            </div>

            {/* SECTION D'INFORMATION */}
            <div className="card" style={{ marginTop: '30px' }}>
                <h3>Bienvenue sur votre espace de supervision</h3>
                <p style={{ color: 'var(--text-muted)', marginTop: '10px', lineHeight: '1.6' }}>
                    Utilisez le menu de gauche pour naviguer entre les différents modules.
                    Vous pouvez planifier de nouveaux voyages, gérer votre flotte, et vendre des billets
                    pour les passagers.
                </p>
            </div>
        </div>
    );
}
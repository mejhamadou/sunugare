import { useEffect, useState } from 'react';
import { api } from '../services/api';

export default function Dashboard() {
    const [stats, setStats] = useState<any>(null);
    const [prediction, setPrediction] = useState<any>(null);
    const [periode, setPeriode] = useState<'jour' | 'semaine' | 'mois' | 'tout'>('tout');

    const loadStats = async () => {
        let debut = undefined;
        let fin = undefined;
        const aujourdhui = new Date();

        if (periode === 'jour') {
            debut = aujourdhui.toISOString().split('T')[0];
            fin = debut;
        } else if (periode === 'semaine') {
            const ilYa7Jours = new Date();
            ilYa7Jours.setDate(aujourdhui.getDate() - 7);
            debut = ilYa7Jours.toISOString().split('T')[0];
            fin = aujourdhui.toISOString().split('T')[0];
        } else if (periode === 'mois') {
            const ilYa30Jours = new Date();
            ilYa30Jours.setDate(aujourdhui.getDate() - 30);
            debut = ilYa30Jours.toISOString().split('T')[0];
            fin = aujourdhui.toISOString().split('T')[0];
        }

        const data = await api.getDashboardStats(debut, fin);
        setStats(data);
    };

    useEffect(() => {
        loadStats();
        api.getPrediction().then(setPrediction).catch(console.error);
    }, [periode]);

    if (!stats || !prediction) return <p>Chargement des données...</p>;

    const handleExportRapport = async () => {
        // On calcule les dates selon la période sélectionnée (même logique que loadStats)
        let debut = '';
        let fin = '';
        const aujourdhui = new Date();

        if (periode === 'jour') {
            debut = aujourdhui.toISOString().split('T')[0];
            fin = debut;
        } else if (periode === 'semaine') {
            const ilYa7Jours = new Date();
            ilYa7Jours.setDate(aujourdhui.getDate() - 7);
            debut = ilYa7Jours.toISOString().split('T')[0];
            fin = aujourdhui.toISOString().split('T')[0];
        } else if (periode === 'mois') {
            const ilYa30Jours = new Date();
            ilYa30Jours.setDate(aujourdhui.getDate() - 30);
            debut = ilYa30Jours.toISOString().split('T')[0];
            fin = aujourdhui.toISOString().split('T')[0];
        }

        try {
            const response = await fetch(`/api/dashboard/export-csv?dateDebut=${debut}&dateFin=${fin}`, {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'rapport_sunugare.csv';
            document.body.appendChild(a);
            a.click();
            a.remove();
        } catch (err) {
            alert("Erreur lors du téléchargement du rapport");
        }
    };

    return (
        <div>
            <h1 style={{ marginBottom: '30px' }}>Tableau de bord</h1>

            {/* ✅ BOUTONS DE PÉRIODE ET EXPORT */}
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <button onClick={handleExportRapport} style={{ backgroundColor: '#10B981', padding: '8px 15px', fontSize: '13px' }}>
                    📥 Exporter le rapport
                </button>

                <div style={{ display: 'flex', gap: '5px', backgroundColor: '#fff', padding: '5px', borderRadius: '8px', border: '1px solid var(--border)' }}>
                <button onClick={() => setPeriode('jour')} style={{ padding: '6px 12px', fontSize: '13px', backgroundColor: periode === 'jour' ? 'var(--primary)' : 'transparent', color: periode === 'jour' ? 'white' : 'var(--text-main)' }}>Aujourd'hui</button>
                <button onClick={() => setPeriode('semaine')} style={{ padding: '6px 12px', fontSize: '13px', backgroundColor: periode === 'semaine' ? 'var(--primary)' : 'transparent', color: periode === 'semaine' ? 'white' : 'var(--text-main)' }}>7 jours</button>
                <button onClick={() => setPeriode('mois')} style={{ padding: '6px 12px', fontSize: '13px', backgroundColor: periode === 'mois' ? 'var(--primary)' : 'transparent', color: periode === 'mois' ? 'white' : 'var(--text-main)' }}>30 jours</button>
                <button onClick={() => setPeriode('tout')} style={{ padding: '6px 12px', fontSize: '13px', backgroundColor: periode === 'tout' ? 'var(--primary)' : 'transparent', color: periode === 'tout' ? 'white' : 'var(--text-main)' }}>Tout</button>
            </div>
            </div>

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
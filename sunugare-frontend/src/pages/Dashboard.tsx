import { useEffect, useState } from 'react';
import { api } from '../services/api';

export default function Dashboard() {
    const [stats, setStats] = useState<any>(null);

    useEffect(() => {
        api.getDashboardStats()
            .then(data => setStats(data))
            .catch(console.error);
    }, []);

    if (!stats) return <p>Chargement des statistiques...</p>;

    return (
        <div>
            <h1 style={{ marginBottom: '30px' }}>Tableau de bord</h1>

            {/* GRILLE DE CARTES KPI */}
            <div className="grid-cards" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>

                {/* CARTE 1 : RECETTES */}
                <div className="card" style={{ borderLeft: '4px solid #10B981' }}>
                    <h3 style={{ color: 'var(--text-muted)', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                        Recettes Totales
                    </h3>
                    <p style={{ fontSize: '36px', fontWeight: 'bold', color: 'var(--text-main)', marginTop: '10px' }}>
                        {stats.recettes.toLocaleString('fr-FR')} <span style={{ fontSize: '18px', color: 'var(--text-muted)' }}>FCFA</span>
                    </p>
                </div>

                {/* CARTE 2 : BILLETS VENDUS */}
                <div className="card" style={{ borderLeft: '4px solid #3B82F6' }}>
                    <h3 style={{ color: 'var(--text-muted)', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                        Billets Vendus
                    </h3>
                    <p style={{ fontSize: '36px', fontWeight: 'bold', color: 'var(--text-main)', marginTop: '10px' }}>
                        {stats.totalBillets}
                    </p>
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
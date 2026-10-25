import { useState, useEffect } from 'react';

export default function Intelligence() {
    const [quais, setQuais] = useState<any[]>([]);
    const [tendances, setTendances] = useState<any[]>([]);
    const [conseils, setConseils] = useState<string[]>([]);
    const [tarification, setTarification] = useState<any[]>([]); // ✅ Nouvel état

    useEffect(() => {
        const token = localStorage.getItem('token');
        const headers = { 'Authorization': `Bearer ${token}` };

        fetch('/api/ia/quais', { headers }).then(r => r.json()).then(setQuais);
        fetch('/api/ia/tendances', { headers }).then(r => r.json()).then(setTendances);
        fetch('/api/ia/recommandations', { headers }).then(r => r.json()).then(setConseils);
        fetch('/api/ia/tarification', { headers }).then(r => r.json()).then(setTarification); // ✅ Nouvel appel
    }, []);

    return (
        <div>
            <h1 style={{ marginBottom: '20px' }}>🧠 Centre d'Intelligence SUNUGARE</h1>

            {/* RECOMMANDATIONS */}
            <div className="card" style={{ marginBottom: '20px', borderLeft: '4px solid #8B5CF6' }}>
                <h3>💡 Aide à la décision</h3>
                <ul>
                    {conseils.map((c, i) => (
                        <li key={i} style={{ backgroundColor: 'transparent', border: 'none', paddingLeft: 0 }}>{c}</li>
                    ))}
                </ul>
            </div>

            <div className="grid-cards" style={{ gridTemplateColumns: '1fr 1fr' }}>

                {/* TENDANCES */}
                <div className="card">
                    <h3>📈 Analyse des tendances</h3>
                    <ul>
                        {tendances.map(t => (
                            <li key={t.jour} style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span>{t.jour}</span>
                                <strong>{t.totalBillets} billets</strong>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* OPTIMISATION QUAIS */}
                <div className="card">
                    <h3>🚏 Optimisation des quais</h3>
                    {quais.length === 0 ? <p style={{ color: 'green' }}>✅ Tous les quais sont bien répartis aujourd'hui.</p> : (
                        <ul>
                            {quais.map((q, i) => (
                                <li key={i} style={{ borderLeft: '3px solid #EF4444' }}>
                                    <strong>{q.quai}</strong> : {q.message}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                {/* ✅ NOUVELLE CARTE : TARIFICATION DYNAMIQUE */}
                <div className="card" style={{ gridColumn: '1 / -1', borderLeft: '4px solid #F59E0B' }}>
                    <h3>💰 Tarification Dynamique</h3>
                    <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '10px' }}>
                        Recommandations basées sur le taux de remplissage des bus.
                    </p>
                    {tarification.length === 0 ? (
                        <p style={{ color: 'var(--text-muted)' }}>Aucun bus n'est presque plein pour le moment.</p>
                    ) : (
                        <ul>
                            {tarification.map((t, i) => (
                                <li key={i} style={{ borderLeft: '3px solid #F59E0B' }}>
                                    <strong>{t.voyage}</strong> : {t.message}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

            </div>
        </div>
    );
}
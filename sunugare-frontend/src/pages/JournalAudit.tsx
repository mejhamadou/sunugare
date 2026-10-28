import { useState, useEffect } from 'react';
import { api } from '../services/api';

export default function JournalAudit() {
    const [logs, setLogs] = useState<any[]>([]);

    useEffect(() => {
        api.getAuditLogs().then(data => setLogs(data)).catch(console.error);
    }, []);

    const [filtreAction, setFiltreAction] = useState('');
    const [filtreEmail, setFiltreEmail] = useState('');

    const handleRecherche = async () => {
        const params = new URLSearchParams();
        if (filtreAction) params.append('action', filtreAction);
        if (filtreEmail) params.append('email', filtreEmail);

        const res = await fetch(`/api/audit/recherche?${params.toString()}`, { headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } });
        const data = await res.json();
        setLogs(data);
    };

    const handleExportCsv = async () => {
        const res = await fetch('/api/audit/export', { headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } });
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a'); a.href = url; a.download = 'journal_audit.csv'; a.click();
    };

    return (
        <div>
            <h1 style={{ marginBottom: '20px' }}>Journal d'Audit</h1>
            <p style={{ color: 'var(--text-muted)', marginBottom: '20px' }}>
                Historique de toutes les actions sensibles effectuées sur le système.
            </p>
            <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                <input type="text" placeholder="Filtrer par email..." value={filtreEmail} onChange={(e) => setFiltreEmail(e.target.value)} style={{ flex: 1, marginBottom: 0 }} />
                <select value={filtreAction} onChange={(e) => setFiltreAction(e.target.value)} style={{ flex: 1, marginBottom: 0 }}>
                    <option value="">Toutes les actions</option>
                    <option value="CREATION_VOYAGE">Création Voyage</option>
                    <option value="ANNULATION_BILLET">Annulation Billet</option>
                    <option value="DEROGATION_CONFORMITE">Dérogation Conformité</option>
                </select>
                <button onClick={handleRecherche}>Filtrer</button>
                <button onClick={handleExportCsv} style={{ backgroundColor: '#10B981' }}>📥 Exporter CSV</button>
            </div>

            <div className="card">
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                    <thead>
                    <tr style={{ borderBottom: '1px solid var(--border)', textAlign: 'left' }}>
                        <th style={{ padding: '10px' }}>Date</th>
                        <th style={{ padding: '10px' }}>Utilisateur</th>
                        <th style={{ padding: '10px' }}>Action</th>
                        <th style={{ padding: '10px' }}>Détails</th>
                    </tr>
                    </thead>
                    <tbody>
                    {logs.map(log => (
                        <tr key={log.id} style={{ borderBottom: '1px solid var(--border)' }}>
                            <td style={{ padding: '10px', color: 'var(--text-muted)' }}>
                                {new Date(log.dateAction).toLocaleString('fr-FR')}
                            </td>
                            <td style={{ padding: '10px', fontWeight: 'bold' }}>{log.utilisateurEmail}</td>
                            <td style={{ padding: '10px' }}>
                  <span style={{ backgroundColor: '#EFF6FF', color: '#1E40AF', padding: '2px 8px', borderRadius: '12px', fontSize: '11px' }}>
                    {log.action}
                  </span>
                            </td>
                            <td style={{ padding: '10px' }}>{log.details}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
import { useState, useEffect } from 'react';
import { api } from '../services/api';

export default function JournalAudit() {
    const [logs, setLogs] = useState<any[]>([]);

    useEffect(() => {
        api.getAuditLogs().then(data => setLogs(data)).catch(console.error);
    }, []);

    return (
        <div>
            <h1 style={{ marginBottom: '20px' }}>Journal d'Audit</h1>
            <p style={{ color: 'var(--text-muted)', marginBottom: '20px' }}>
                Historique de toutes les actions sensibles effectuées sur le système.
            </p>

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
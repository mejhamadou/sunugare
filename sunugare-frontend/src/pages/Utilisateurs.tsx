import { useState, useEffect } from 'react';
import { api } from '../services/api';

export default function Utilisateurs() {
    const [users, setUsers] = useState<any[]>([]);
    const [formData, setFormData] = useState({
        firstName: '', lastName: '', email: '', password: '', roleName: 'ROLE_AGENT', gareId:''
    });

    // ✅ Nouvel état pour savoir si on modifie
    const [editingId, setEditingId] = useState<number | null>(null);

    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const loadData = async () => {
        try {
            const data = await api.getUsers();
            setUsers(data);
        } catch (err) { console.error(err); }
    };

    const [gares, setGares] = useState<any[]>([]);

    useEffect(() => { loadData();
        api.getGares().then(data => setGares(data)).catch(console.error);
    }, []);


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(''); setSuccess('');
        try {
            if (editingId) {
                // Mode Modification
                await api.updateUser(editingId, formData);
                setSuccess('Utilisateur modifié avec succès !');
                setEditingId(null);
            } else {
                // Mode Création
                await api.createUser(formData);
                setSuccess('Utilisateur créé avec succès !');
            }
            setFormData({ firstName: '', lastName: '', email: '', password: '', roleName: 'ROLE_AGENT', gareId: '' });
            loadData();
        } catch (err: any) {
            setError(err.message);
        }
    };

    // ✅ Fonction pour préparer l'édition
    const handleEditClick = (user: any) => {
        setEditingId(user.id);
        setFormData({
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            password: '', // On laisse vide, l'admin pourra le changer s'il le souhaite
            roleName: user.roles[0]?.name || 'ROLE_AGENT',
            gareId: user.gare ? user.gare.id.toString() : ''

        });
        setError(''); setSuccess('');
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        setFormData({ firstName: '', lastName: '', email: '', password: '', roleName: 'ROLE_AGENT', gareId: '' });
    };

    const handleToggle = async (id: number) => {
        await api.toggleUserStatus(id);
        loadData();
    };

    return (
        <div>
            <h1 style={{ marginBottom: '20px' }}>Gestion des Utilisateurs</h1>

            <div className="grid-cards" style={{ gridTemplateColumns: '1fr 2fr' }}>

                {/* FORMULAIRE D'AJOUT / MODIFICATION */}
                <div className="card">
                    <h3>{editingId ? 'Modifier l\'utilisateur' : 'Créer un utilisateur'}</h3>

                    {error && <div style={{ backgroundColor: '#FEE2E2', color: '#B91C1C', padding: '10px', borderRadius: '5px', marginBottom: '15px' }}>{error}</div>}
                    {success && <div style={{ backgroundColor: '#D1FAE5', color: '#059669', padding: '10px', borderRadius: '5px', marginBottom: '15px' }}>{success}</div>}

                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <label>Prénom</label>
                        <input type="text" value={formData.firstName} onChange={(e) => setFormData({...formData, firstName: e.target.value})} required />

                        <label>Nom</label>
                        <input type="text" value={formData.lastName} onChange={(e) => setFormData({...formData, lastName: e.target.value})} required />

                        <label>Email</label>
                        <input type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} required />

                        <label>Mot de passe {editingId && <span style={{fontSize: '11px', color: 'gray'}}>(laisser vide pour ne pas changer)</span>}</label>
                        <input type="password" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} required={!editingId} />

                        <label>Rôle</label>
                        <select value={formData.roleName} onChange={(e) => setFormData({...formData, roleName: e.target.value})}>
                            <option value="ROLE_AGENT">Agent (Caisse)</option>
                            <option value="ROLE_RESPONSABLE">Responsable de gare</option>
                            <option value="ROLE_ADMIN">Administrateur</option>
                        </select>

                        <label>Gare de rattachement (Optionnel)</label>
                        <select
                            value={formData.gareId}
                            onChange={(e) => setFormData({...formData, gareId: e.target.value})}
                        >
                            <option value="">Aucune (Admin global)</option>
                            {gares.map(g => <option key={g.id} value={g.id}>{g.nom}</option>)}
                        </select>

                        <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
                            <button type="submit" style={{ flex: 1 }}>
                                {editingId ? 'Enregistrer les modifications' : 'Créer l\'utilisateur'}
                            </button>
                            {editingId && (
                                <button type="button" onClick={handleCancelEdit} className="btn-danger" style={{ flex: 1 }}>
                                    Annuler
                                </button>
                            )}
                        </div>
                    </form>
                </div>

                {/* LISTE DES UTILISATEURS */}
                <div className="card">
                    <h3>Liste des utilisateurs ({users.length})</h3>
                    <ul>
                        {users.map(u => (
                            <li key={u.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <strong style={{ color: 'var(--text-main)' }}>{u.firstName} {u.lastName}</strong>
                                    <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{u.email}</div>
                                    <div style={{ fontSize: '11px', color: 'var(--primary)', marginTop: '4px' }}>
                                        {u.roles.map((r: any) => r.name.replace('ROLE_', '')).join(', ')}
                                        {u.gare && <span style={{ color: '#F59E0B' }}> | 📍 {u.gare.nom}</span>}
                                    </div>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{
                      fontSize: '11px', padding: '4px 10px', borderRadius: '12px',
                      backgroundColor: u.enabled ? '#D1FAE5' : '#FEE2E2',
                      color: u.enabled ? '#059669' : '#B91C1C'
                  }}>
                    {u.enabled ? 'Actif' : 'Désactivé'}
                  </span>

                                    {/* ✅ Bouton Modifier */}
                                    <button onClick={() => handleEditClick(u)} style={{ padding: '6px 12px', fontSize: '12px', backgroundColor: '#3B82F6' }}>
                                        Modifier
                                    </button>

                                    <button onClick={() => handleToggle(u.id)} style={{ padding: '6px 12px', fontSize: '12px', backgroundColor: u.enabled ? '#F59E0B' : '#10B981' }}>
                                        {u.enabled ? 'Désactiver' : 'Activer'}
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
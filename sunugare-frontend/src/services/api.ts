const API_URL = '/api';

// Petit raccourci pour récupérer le token
const getToken = () => localStorage.getItem('token');

export const api = {
    // --- AUTHENTIFICATION ---
    login: async (email: string, password: string) => {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });
        if (!response.ok) throw new Error('Identifiants incorrects');
        return response.json();
    },

    getProtectedData: async () => {
        const response = await fetch(`${API_URL}/test/protected`, {
            headers: { 'Authorization': `Bearer ${getToken()}` },
        });
        if (!response.ok) throw new Error('Accès refusé');
        return response.json();
    },

    // --- VILLES ---
    getVilles: async () => {
        const response = await fetch(`${API_URL}/villes`, {
            headers: { 'Authorization': `Bearer ${getToken()}` },
        });
        if (!response.ok) throw new Error('Erreur lors de la récupération des villes');
        return response.json();
    },
    createVille: async (nom: string) => {
        const response = await fetch(`${API_URL}/villes`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getToken()}`
            },
            body: JSON.stringify({ nom }),
        });
        if (!response.ok) throw new Error('Erreur lors de la création de la ville');
        return response.json();
    },

    // --- COMPAGNIES ---
    getCompagnies: async () => {
        const response = await fetch(`${API_URL}/compagnies`, {
            headers: { 'Authorization': `Bearer ${getToken()}` },
        });
        if (!response.ok) throw new Error('Erreur lors de la récupération des compagnies');
        return response.json();
    },
    createCompagnie: async (data: { nom: string, telephone: string, email: string }) => {
        const response = await fetch(`${API_URL}/compagnies`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getToken()}`
            },
            body: JSON.stringify(data),
        });
        if (!response.ok) throw new Error('Erreur lors de la création de la compagnie');
        return response.json();
    },

    // --- GARES ---
    getGares: async () => {
        const response = await fetch(`${API_URL}/gares`, {
            headers: { 'Authorization': `Bearer ${getToken()}` },
        });
        if (!response.ok) throw new Error('Erreur lors de la récupération des gares');
        return response.json();
    },
    createGare: async (data: { nom: string, adresse: string, villeId: number }) => {
        const response = await fetch(`${API_URL}/gares`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getToken()}`
            },
            body: JSON.stringify(data),
        });
        if (!response.ok) throw new Error('Erreur lors de la création de la gare');
        return response.json();
    },
    // --- VÉHICULES ---
    getVehicules: async () => {
        const response = await fetch(`${API_URL}/vehicules`, {
            headers: { 'Authorization': `Bearer ${getToken()}` },
        });
        if (!response.ok) throw new Error('Erreur vehicules');
        return response.json();
    },
    createVehicule: async (data: { immatriculation: string, marque?: string | null, capacite: number, compagnieId: number, dateExpirationAssurance?: string | null, dateExpirationCarteGrise?: string | null }) => {
        const response = await fetch(`${API_URL}/vehicules`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getToken()}`
            },
            body: JSON.stringify(data),
        });
        if (!response.ok) throw new Error('Erreur création véhicule');
        return response.json();
    },

    updateVehicule: async (id: number, data: any) => {
        const response = await fetch(`${API_URL}/vehicules/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getToken()}`
            },
            body: JSON.stringify(data),
        });
        if (!response.ok) throw new Error('Erreur modification véhicule');
        return response.json();
    },


    // --- CHAUFFEURS ---
    getChauffeurs: async () => {
        const response = await fetch(`${API_URL}/chauffeurs`, {
            headers: { 'Authorization': `Bearer ${getToken()}` },
        });
        if (!response.ok) throw new Error('Erreur chauffeurs');
        return response.json();
    },
    createChauffeur: async (data: { nom: string, prenom: string, telephone: string, numeroPermis: string, compagnieId: number }) => {
        const response = await fetch(`${API_URL}/chauffeurs`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getToken()}`
            },
            body: JSON.stringify(data),
        });
        if (!response.ok) throw new Error('Erreur création chauffeur');
        return response.json();
    },

    updateChauffeur: async (id: number, data: any) => {
        const response = await fetch(`${API_URL}/chauffeurs/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${getToken()}` },
            body: JSON.stringify(data),
        });
        if (!response.ok) throw new Error('Erreur modification chauffeur');
        return response.json();
    },

    // --- VOYAGES ---
    getVoyages: async () => {
        const response = await fetch(`${API_URL}/voyages`, {
            headers: { 'Authorization': `Bearer ${getToken()}` },
        });
        if (!response.ok) throw new Error('Erreur voyages');
        return response.json();
    },

    createVoyage: async (data: { ligneId: number, vehiculeId: number, chauffeurId: number, quaiId: number, dateDepart: string, prix: number }) => {
        const response = await fetch(`${API_URL}/voyages`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getToken()}`
            },
            body: JSON.stringify(data),
        });
        if (!response.ok) throw new Error('Erreur création voyage');
        return response.json();
    },

    // --- RÉFÉRENTIELS POUR LE FORMULAIRE ---
    getLignes: async () => {
        const response = await fetch(`${API_URL}/lignes`, {
            headers: { 'Authorization': `Bearer ${getToken()}` },
        });
        return response.ok ? response.json() : [];
    },
    getQuais: async () => {
        const response = await fetch(`${API_URL}/quais`, {
            headers: { 'Authorization': `Bearer ${getToken()}` },
        });
        return response.ok ? response.json() : [];
    },

    // --- BILLETS ---
    getBillets: async () => {
        const response = await fetch(`${API_URL}/billets`, {
            headers: { 'Authorization': `Bearer ${getToken()}` },
        });
        if (!response.ok) throw new Error('Erreur billets');
        return response.json();
    },

    createBillet: async (data: { voyageId: number, nomPassager: string, telephonePassager: string, numeroSiege: number }) => {
        const response = await fetch(`${API_URL}/billets`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getToken()}`
            },
            body: JSON.stringify(data),
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Erreur lors de la vente du billet');
        }
        return response.json();
    },

    updateVoyageStatut: async (id: number, statut: string) => {
        const response = await fetch(`${API_URL}/voyages/${id}/statut?statut=${statut}`, {
            method: 'PATCH',
            headers: { 'Authorization': `Bearer ${getToken()}` },
        });
        if (!response.ok) throw new Error('Erreur changement statut');
        return response.json();
    },

    // --- DASHBOARD ---
    getDashboardStats: async (dateDebut?: string, dateFin?: string) => {
        const params = new URLSearchParams();
        if (dateDebut) params.append('dateDebut', dateDebut);
        if (dateFin) params.append('dateFin', dateFin);

        const response = await fetch(`${API_URL}/dashboard/stats?${params.toString()}`, {
            headers: { 'Authorization': `Bearer ${getToken()}` },
        });
        if (!response.ok) throw new Error('Erreur stats');
        return response.json();
    },

    validerBillet: async (numeroBillet: string) => {
        const response = await fetch(`${API_URL}/billets/valider`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getToken()}`
            },
            body: JSON.stringify({ numeroBillet }),
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Erreur de validation');
        }
        return response.json();
    },

    payerBillet: async (billetId: number, methode: string) => {
        const response = await fetch(`${API_URL}/paiements`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getToken()}`
            },
            body: JSON.stringify({ billetId, methode }),
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Erreur de paiement');
        }
        return response.json();
    },
    getPrediction: async () => {
        const response = await fetch(`${API_URL}/predictions/affluence`, {
            headers: { 'Authorization': `Bearer ${getToken()}` },
        });
        if (!response.ok) throw new Error('Erreur prédiction');
        return response.json();
    },

    // --- UTILISATEURS ---
    getUsers: async () => {
        const response = await fetch(`${API_URL}/users`, {
            headers: { 'Authorization': `Bearer ${getToken()}` },
        });
        if (!response.ok) throw new Error('Erreur utilisateurs');
        return response.json();
    },
    createUser: async (data: { firstName: string, lastName: string, email: string, password: string, roleName: string }) => {
        const response = await fetch(`${API_URL}/users`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getToken()}`
            },
            body: JSON.stringify(data),
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Erreur création utilisateur');
        }
        return response.json();
    },
    toggleUserStatus: async (id: number) => {
        const response = await fetch(`${API_URL}/users/${id}/toggle-status`, {
            method: 'PATCH',
            headers: { 'Authorization': `Bearer ${getToken()}` },
        });
        if (!response.ok) throw new Error('Erreur changement de statut');
        return response.json();
    },

    updateUser: async (id: number, data: { firstName: string, lastName: string, email: string, password?: string, roleName: string }) => {
        const response = await fetch(`${API_URL}/users/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getToken()}`
            },
            body: JSON.stringify(data),
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Erreur modification utilisateur');
        }
        return response.json();
    },

    // --- TERMINAUX ---
    getTerminaux: async () => {
        const response = await fetch(`${API_URL}/terminaux`, { headers: { 'Authorization': `Bearer ${getToken()}` } });
        return response.ok ? response.json() : [];
    },
    createTerminal: async (data: { nom: string, gareId: number }) => {
        const response = await fetch(`${API_URL}/terminaux`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${getToken()}` },
            body: JSON.stringify(data),
        });
        if (!response.ok) throw new Error('Erreur création terminal');
        return response.json();
    },

    // --- QUAIS ---
    createQuai: async (data: { numero: string, terminalId: number }) => {
        const response = await fetch(`${API_URL}/quais`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${getToken()}` },
            body: JSON.stringify(data),
        });
        if (!response.ok) throw new Error('Erreur création quai');
        return response.json();
    },

    // --- LIGNES ---
    createLigne: async (data: { villeDepartId: number, villeArriveeId: number, distanceKm: number }) => {
        const response = await fetch(`${API_URL}/lignes`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${getToken()}` },
            body: JSON.stringify(data),
        });
        if (!response.ok) throw new Error('Erreur création ligne');
        return response.json();
    },

    // --- RETARDS---
    signalerRetard: async (id: number, minutes: number) => {
        const response = await fetch(`${API_URL}/voyages/${id}/retard?minutes=${minutes}`, {
            method: 'PATCH',
            headers: { 'Authorization': `Bearer ${getToken()}` },
        });
        if (!response.ok) throw new Error('Erreur signalement retard');
        return response.json();
    },

    updateLigne: async (id: number, data: { villeDepartId: number, villeArriveeId: number, distanceKm: number }) => {
        const response = await fetch(`${API_URL}/lignes/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${getToken()}` },
            body: JSON.stringify(data),
        });
        if (!response.ok) throw new Error('Erreur modification ligne');
        return response.json();
    },

    updateTerminal: async (id: number, data: { nom: string, gareId: number }) => {
        const res = await fetch(`${API_URL}/terminaux/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${getToken()}` }, body: JSON.stringify(data) });
        if (!res.ok) throw new Error('Erreur'); return res.json();
    },
    updateQuai: async (id: number, data: { numero: string, terminalId: number }) => {
        const res = await fetch(`${API_URL}/quais/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${getToken()}` }, body: JSON.stringify(data) });
        if (!res.ok) throw new Error('Erreur'); return res.json();
    },

    ajouterBagage: async (data: { billetId: number, description: string, poidsKg?: number, tarif?: number }) => {
        const response = await fetch(`${API_URL}/bagages`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${getToken()}` },
            body: JSON.stringify(data),
        });
        if (!response.ok) throw new Error('Erreur ajout bagage');
        return response.json();
    },

    annulerBillet: async (id: number) => {
        const response = await fetch(`${API_URL}/billets/${id}/annuler`, {
            method: 'PATCH',
            headers: { 'Authorization': `Bearer ${getToken()}` },
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Erreur annulation');
        }
        return response.json();
    },

    // --- ABONNEMENTS ---
    getAbonnements: async () => {
        const response = await fetch(`${API_URL}/abonnements`, {
            headers: { 'Authorization': `Bearer ${getToken()}` },
        });
        if (!response.ok) throw new Error('Erreur abonnements');
        return response.json();
    },
    createAbonnement: async (data: { nomPassager: string, telephone: string, ligneId: number, dateDebut: string, dateFin: string }) => {
        const response = await fetch(`${API_URL}/abonnements`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${getToken()}` },
            body: JSON.stringify(data),
        });
        if (!response.ok) {
            const err = await response.json();
            throw new Error(err.error || 'Erreur création abonnement');
        }
        return response.json();
    },

    getAuditLogs: async () => {
        const response = await fetch(`${API_URL}/audit`, {
            headers: { 'Authorization': `Bearer ${getToken()}` },
        });
        if (!response.ok) throw new Error('Erreur audit');
        return response.json();
    },

    exportVoyagesCsv: async () => {
        const response = await fetch(`${API_URL}/voyages/export`, {
            headers: { 'Authorization': `Bearer ${getToken()}` },
        });
        return response.blob(); // On renvoie le fichier
    },

    // --- COLIS ---
    getColis: async () => {
        const response = await fetch(`${API_URL}/colis`, {
            headers: { 'Authorization': `Bearer ${getToken()}` },
        });
        if (!response.ok) throw new Error('Erreur colis');
        return response.json();
    },
    createColis: async (data: any) => {
        const response = await fetch(`${API_URL}/colis`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${getToken()}` },
            body: JSON.stringify(data),
        });
        if (!response.ok) throw new Error('Erreur création colis');
        return response.json();
    },
    changerStatutColis: async (id: number, statut: string) => {
        const response = await fetch(`${API_URL}/colis/${id}/statut?statut=${statut}`, {
            method: 'PATCH',
            headers: { 'Authorization': `Bearer ${getToken()}` },
        });
        if (!response.ok) throw new Error('Erreur changement statut');
        return response.json();
    },

};
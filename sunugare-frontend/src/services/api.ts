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

    getProtectedData: async (token: string) => {
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
    createVehicule: async (data: { immatriculation: string, marque: string, capacite: number, compagnieId: number }) => {
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
    getDashboardStats: async () => {
        const response = await fetch(`${API_URL}/dashboard/stats`, {
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
};
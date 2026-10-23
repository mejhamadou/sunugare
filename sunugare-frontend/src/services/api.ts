const API_URL = '/api';

export const api = {
    // Appel pour le Login
    login: async (email: string, password: string) => {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });
        if (!response.ok) throw new Error('Identifiants incorrects');
        return response.json();
    },

    // Appel pour la route protégée
    getProtectedData: async (token: string) => {
        const response = await fetch(`${API_URL}/test/protected`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });
        if (!response.ok) throw new Error('Accès refusé ou token expiré');
        return response.json();
    }
};
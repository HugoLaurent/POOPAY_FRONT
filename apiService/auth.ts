// Détecter l'environnement pour utiliser la bonne URL
const API_BASE_URL = 'http://192.168.1.10:3333';  // Pour l'émulateur Android
// Récupérer toutes les données d'initialisation (profil, abonnement, sessions, groupes, settings...)
export const getInitData = async (token: string, userId: string) => {
    const response = await fetch(`${API_BASE_URL}/users/${userId}/init`, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    });
    return response.json();
};
// Récupérer l'abonnement de l'utilisateur
export const getSubscription = async (token: string, userId: string) => {
    const response = await fetch(`${API_BASE_URL}/users/${userId}/subscription`, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    });
    return response.json();
};

// Récupérer les paramètres utilisateur
export const getSettings = async (token: string, userId: string) => {
    const response = await fetch(`${API_BASE_URL}/users/${userId}/settings`, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    });
    return response.json();
};

// Récupérer les sessions récentes (historique)
export const getSessions = async (token: string, userId: string, { limit = 30 } = {}) => {
    const response = await fetch(`${API_BASE_URL}/users/${userId}/sessions?limit=${limit}`, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    });
    return response.json();
};

// Récupérer la liste des groupes et leurs métadonnées
export const getGroups = async (token: string, userId: string) => {
    const response = await fetch(`${API_BASE_URL}/users/${userId}/groups`, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    });
    console.log('📋 Données groupes reçues:', await response.clone().json());

    return response.json();
};

export const login = async (email: string, password: string) => {
    try {
        console.log('🚀 Tentative de login vers:', `${API_BASE_URL}/login`);
        console.log('📧 Email:', email);

        const response = await fetch(`${API_BASE_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        console.log('📡 Statut de la réponse:', response.status);
        console.log('📡 Response OK:', response.ok);

        const data = await response.json();
        console.log('📋 Données reçues:', data);

        return data;

    } catch (error) {
        console.error('❌ Erreur dans login:', error);
        throw error;
    }
};

export const signup = async (email: string, password: string) => {
    const response = await fetch(`${API_BASE_URL}/signup`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
    });

    return response.json();
};

export const logout = async (token: string) => {
    const response = await fetch(`${API_BASE_URL}/logout`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    });

    return response.json();
};

export const getProfile = async (token: string) => {
    const response = await fetch(`${API_BASE_URL}/me`, {
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });

    return response.json();
};
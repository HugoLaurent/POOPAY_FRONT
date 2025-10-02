import { API_BASE_URL } from './config';

export const login = async (email: string, password: string) => {
    try {
        console.log('🚀 Tentative de login vers:', `${API_BASE_URL}/login`);
        const response = await fetch(`${API_BASE_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('❌ Erreur dans login:', error);
        throw error;
    }
};

export const signup = async (email: string, password: string) => {
    const response = await fetch(`${API_BASE_URL}/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
    });
    return response.json();
};

export const logout = async (token: string) => {
    const response = await fetch(`${API_BASE_URL}/logout`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    });
    return response.json();
};

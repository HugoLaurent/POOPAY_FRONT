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

export const signup = async (
    email: string,
    password: string,
    username?: string,
    department_code?: string,
    category_id?: number,
    monthly_salary?: number,
    monthly_hours?: number,
    notifications_enabled?: boolean,
    theme?: string
) => {
    console.log('🚀 Tentative d\'inscription vers:', `${API_BASE_URL}/signup`);
    console.log('📦 Payload:', {
        email,
        username,
        department_code,
        category_id,
        monthly_salary,
        monthly_hours,
        notifications_enabled,
        theme
    });
    try {
        console.log('🚀 Tentative d\'inscription vers:', `${API_BASE_URL}/signup`);

        const response = await fetch(`${API_BASE_URL}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email,
                password,
                username,
                department_code,
                category_id,
                monthly_salary,
                monthly_hours,
                notifications_enabled,
                theme,
            }),
        });

        const data = await response.json();
        console.log('📥 Réponse signup:', data);

        if (!response.ok) {
            console.error('❌ Erreur HTTP:', response.status, response.statusText);
            console.error('❌ Message:', data.message || data);
        }

        return data;
    } catch (error) {
        console.error('❌ Erreur dans signup:', error);
        throw error;
    }
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

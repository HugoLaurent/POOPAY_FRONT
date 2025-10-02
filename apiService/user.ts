import { API_BASE_URL } from './config';

export const getInitData = async (token: string, userId: string) => {
    const response = await fetch(`${API_BASE_URL}/users/${userId}/init`, {
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    });
    return response.json();
};

export const getProfile = async (token: string) => {
    const response = await fetch(`${API_BASE_URL}/me`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.json();
};


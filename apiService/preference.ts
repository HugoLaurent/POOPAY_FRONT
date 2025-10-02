import { API_BASE_URL } from './config';

export const updateSettings = async (
    token: string,
    userId: string,
    settings: any
) => {
    const body = JSON.stringify(settings);
    const response = await fetch(`${API_BASE_URL}/users/${userId}/settings`, {
        method: 'PUT',
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body,
    });
    return response.json();
};

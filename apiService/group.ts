import { API_BASE_URL } from './config';

export const getGroupsByUserId = async (
    token: string,
    userId: string,
    period?: 'week' | 'month' | 'past'
) => {
    let url = `${API_BASE_URL}/users/${userId}/groups`;
    if (period) url += `?period=${period}`;
    const response = await fetch(url, {
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    });
    return response.json();
};

export const getGroupById = async (token: string, groupId: string) => {
    const response = await fetch(`${API_BASE_URL}/groups/${groupId}`, {
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    });
    return response.json();
};

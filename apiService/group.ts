import { API_BASE_URL } from './config';

export const createGroup = async (
    token: string,
    name: string,

) => {

    try {
        console.log("itsmemario");
        const response = await fetch(`${API_BASE_URL}/groups`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name }),
        });
        const result = await response.json();
        console.log("Response from createGroup:", result);
        return result;
    } catch (error) {
        console.error("Error in createGroup:", error);
        throw error;
    }
}

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

import { API_BASE_URL } from './config';


// Fetch rankings from the backend. Accepts optional query params object
// e.g. { region: 'Europe' } or { category: 'Study' }
export const getRankings = async (token: string, params?: Record<string, string | number>) => {
    let url = `${API_BASE_URL}/rankings`;
    if (params) {
        url += '?';
        const query = new URLSearchParams();
        Object.entries(params).forEach(([key, value]) => {
            query.append(key, value.toString());
        });
        url += query.toString();
    }
    console.log(url);

    const response = await fetch(url, {
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    });

    return response.json();
};

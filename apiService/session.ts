import { API_BASE_URL } from './config';

/**
 * Delete a session by id.
 * Best-effort: backend must expose DELETE /sessions/:id and require Authorization header.
 */
export const deleteSession = async (
    token: string,
    sessionId: string,
    userId?: string
) => {
    const url = `${API_BASE_URL}/users/${userId}/sessions/${sessionId}`

    const response = await fetch(url, {
        method: 'DELETE',
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        const text = await response.text().catch(() => null);
        throw new Error(`Failed to delete session: ${response.status} ${text || ''}`);
    }

    // Some APIs return an empty body; try to parse JSON, otherwise return null
    try {
        return await response.json();
    } catch {
        return null;
    }
};

/**
 * Create a new session for a user.
 * Expects backend route: POST /users/:userId/sessions
 */
export const createSession = async (
    token: string,
    userId: string | number,
    payload: {
        start_time: string;
        end_time: string;
        amount_earned: number;
        duration_seconds?: number;
        status?: string;
    }
) => {
    const url = `${API_BASE_URL}/users/${userId}/sessions`;

    console.log('[api.createSession] POST', url, 'payload:', payload, 'tokenPresent:', !!token);

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
    });

    console.log('[api.createSession] response status:', response.status);

    if (!response.ok) {
        const text = await response.text().catch(() => null);
        console.error('[api.createSession] non-ok response:', response.status, text);
        throw new Error(`Failed to create session: ${response.status} ${text || ''}`);
    }

    try {
        const json = await response.json();
        console.log('[api.createSession] response json:', json);
        return json;
    } catch (e) {
        console.warn('[api.createSession] no json body, returning null', e);
        return null;
    }
};

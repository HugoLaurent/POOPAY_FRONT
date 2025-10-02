import Constants from 'expo-constants';

export const getApiBaseUrl = () => {
    const expoConfig = (Constants && (Constants.expoConfig || Constants.manifest)) || null;
    const extra = expoConfig && (expoConfig.extra || {});
    return (
        (extra && extra.URLBACK) ||
        (typeof process !== 'undefined' && process.env && process.env.URLBACK) ||
        'http://192.168.1.10:3333'
    );
};

export const API_BASE_URL = getApiBaseUrl();

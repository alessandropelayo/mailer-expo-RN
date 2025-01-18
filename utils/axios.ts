import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
const API_URL = process.env.EXPO_PUBLIC_API_URL;
const COOKIE_KEY = 'refreshToken';

export const api = axios.create({
    baseURL: API_URL,
    withCredentials: true,
});

// Store for keeping track of refresh token requests
type QueueItem = {
    resolve: (value: string | null) => void;
    reject: (reason?: any) => void;
};

let isRefreshing = false;
let failedQueue: QueueItem[] = [];

const processQueue = (error: unknown | null, token: string | null = null): void => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};

// api.interceptors.request.use((config) => {
//     console.log("Request made with:", config);
//     return config;
// }, (error) => {
//     console.error("Error during request setup:", error);
//     return Promise.reject(error);
// });

// api.interceptors.response.use((response) => {
//     console.log("Response received:", response);
//     return response;
// }, (error) => {
//     console.error("Response error:", error);
//     return Promise.reject(error);
// });

// Intercept responses to save cookies
api.interceptors.response.use(
    async (response) => {
        const cookieString = response.headers['set-cookie'];
        if (cookieString) {
            // Extract refresh token from cookie string
            const refreshToken = cookieString
                .find(cookie => cookie.includes('refreshToken='))
                ?.split(';')[0]
                ?.split('=')[1];
            
            if (refreshToken) {
                await SecureStore.setItemAsync(COOKIE_KEY, refreshToken);
            }
        }
        return response;
    },
    async (error) => Promise.reject(error)
);

// Intercept requests to add stored cookie
api.interceptors.request.use(
    async (config) => {
        try {
            const cookie = await SecureStore.getItemAsync(COOKIE_KEY);
            if (cookie && config.headers) {  // Add null check for config.headers
                config.headers['Cookie'] = `refreshToken=${cookie}`;
            }
            return config;
        } catch (error) {
            console.error('Error retrieving cookie:', error);
            return config;
        }
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add authorization header if access token exists
api.interceptors.request.use(
    async (config) => {
        try {
            const token = await SecureStore.getItemAsync('accessToken');
            if (token && config.headers) {
                config.headers['Authorization'] = `Bearer ${token}`;
            }
            return config;
        } catch (error) {
            console.error('Error retrieving access token:', error);
            return config;
        }
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Error handling and token refresh interceptor
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // If the error is not 401 or the request has already been retried, reject
        if (!error.response || error.response.status !== 401 || originalRequest._retry) {
            return Promise.reject(error);
        }

        // Check specific error message
        const errorMessage = error.response.data?.error;
        
        if (errorMessage === "Refresh token has expired") {
            // Handle logout
            await logout();
            return Promise.reject(error);
        }

        if (errorMessage === "Token has expired") {
            if (isRefreshing) {
                // If refresh is in progress, queue this request
                try {
                    const token = await new Promise((resolve, reject) => {
                        failedQueue.push({ resolve, reject });
                    });
                    originalRequest.headers['Authorization'] = `Bearer ${token}`;
                    return api(originalRequest);
                } catch (err) {
                    return Promise.reject(err);
                }
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                // Attempt to refresh token
                const response = await api.post('/auth/refresh-token');
                const newToken = response.data.accessToken;
                
                // Store new access token
                await SecureStore.setItemAsync('accessToken', newToken);
                
                // Update authorization header
                api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
                originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
                
                // Process queued requests
                processQueue(null, newToken);
                
                return api(originalRequest);
            } catch (refreshError) {
                processQueue(refreshError, null);
                
                // If refresh failed, attempt logout
                await logout();
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    }
);

const logout = async () => {
    try {
        // Clear stored tokens
        await SecureStore.deleteItemAsync('accessToken');
        await SecureStore.deleteItemAsync(COOKIE_KEY);
        
        // Clear authorization header
        delete api.defaults.headers.common['Authorization'];
        
        // Trigger navigation to login screen
    } catch (error) {
        console.error('Error during logout:', error);
    }
};

export default api;
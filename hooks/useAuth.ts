import { useEffect, useState } from 'react';
import * as SecureStore from 'expo-secure-store';
import { User } from '../types/auth';
const COOKIE_KEY = 'refreshToken';

export const useAuth = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        try {
            const userStr = await SecureStore.getItemAsync('user');
            const accessToken = await SecureStore.getItemAsync('accessToken');
            
            if (userStr && accessToken) {
                setUser(JSON.parse(userStr));
            }
        } catch (error) {
            console.error('Auth check failed:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const logout = async () => {
        try {
            // Clear stored tokens
            await SecureStore.deleteItemAsync('accessToken');
            await SecureStore.deleteItemAsync(COOKIE_KEY);
            
            // Trigger navigation to login screen

        } catch (error) {
            console.error('Error during logout:', error);
        }
    };

    return { isLoading, user, checkAuth, logout };
};
import { createContext, useContext, useState, type ReactNode } from "react";
import type { AuthContextType, LoginCredentials, RegisterCredentials, AuthState, User } from "../types/auth";
import { authService } from "../services/authService";
import { api } from "../services/api";
import { useEffect } from "react";

export const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({ children }: { children: ReactNode }) {   
    const [loading, setLoading] = useState(true); 

    useEffect(() => {
    function loadStorageData() {
        const storagedToken = localStorage.getItem('@Aequo:token');
        const storagedUser = localStorage.getItem('@Aequo:user');

        if (storagedToken && storagedUser) {
            api.defaults.headers.common['Authorization'] = `Bearer ${storagedToken}`;
            
            setAuthState({
                isAuthenticated: true,
                user: JSON.parse(storagedUser),
                token: storagedToken
            });
        }
        setLoading(false); 
    }
    loadStorageData();
}, []);

    useEffect(() => {
        const token = localStorage.getItem('@Aequo:token');

        if (token) {
            api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        }
    }, []);

    const [authState, setAuthState] = useState<AuthState>({
        isAuthenticated: false,
        user: undefined
    });

    async function login(credentials: LoginCredentials) {
        try {
            const response = await authService.login(credentials);

            setAuthState({
                isAuthenticated: true,
                user: response.user,
                token: response.token
            });

            localStorage.setItem('@Aequo:token', response.token || "");
            localStorage.setItem('@Aequo:user', JSON.stringify(response.user));

            api.defaults.headers.common['Authorization'] = `Bearer ${response.token}`;

        } catch (error) {
            throw error;
        }
    }

    async function register(credentials: RegisterCredentials) {
        try {
            const response = await authService.register(credentials);
        
            console.log("Registro bem sucedido!", response);

            setAuthState({
                isAuthenticated: true,
                user: response.user,
                token: response.token
            });

            localStorage.setItem('@Aequo:token', response.token || "");
            localStorage.setItem('@Aequo:user', JSON.stringify(response.user));
            api.defaults.headers.common['Authorization'] = `Bearer ${response.token}`;

        } catch (error) {
            throw error;
        }
    }

    function logout() {
        setAuthState({ isAuthenticated: false, user: undefined });
        api.defaults.headers.common['Authorization'] = undefined;
        localStorage.setItem('@Aequo:token', null as any);
        localStorage.setItem('@Aequo:user', null as any);
    }

    return (
        <AuthContext.Provider value={{ authState, login, register, logout, loading}}>
            {children}
        </AuthContext.Provider>
    );



}
export function useAuth() {
    return useContext(AuthContext);
}


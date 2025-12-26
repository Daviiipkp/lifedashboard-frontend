export interface User {
    id: string;
    email: string;
    username: string;
    fullname?: string;
    userRole: string;
    enabled: boolean;

}

export interface AuthState {
    isAuthenticated: boolean;
    user?: User;
    token?: String;
}

export interface LoginCredentials {
    username: string;
    password: string;
}

export interface RegisterCredentials {
    username: string;
    email: string;
    password: string;
}

export interface AuthContextType {
    authState: AuthState;
    login: (credentials: LoginCredentials) => Promise<void>;
    register: (credentials: RegisterCredentials) => Promise<void>;
    logout: () => void;

    loading: boolean;
}

export interface AuthResponse {
    success: boolean;
    message: string;
    user?: User;
    token?: string;
}
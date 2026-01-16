import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import type {
  AuthContextType,
  LoginCredentials,
  RegisterCredentials,
  AuthState,
} from "../types/auth";
import { authService } from "../services/authService";
import { api } from "../services/api";

export const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState(true);

  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    user: undefined,
    token: undefined,
  });

  useEffect(() => {
    function loadStorageData() {
      const storagedToken = localStorage.getItem("@Aequo:token");
      const storagedUser = localStorage.getItem("@Aequo:user");

      if (
        storagedToken &&
        storagedUser &&
        storagedToken !== "null" &&
        storagedUser !== "null"
      ) {
        api.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${storagedToken}`;
        setAuthState({
          isAuthenticated: true,
          user: JSON.parse(storagedUser),
          token: storagedToken,
        });
      }
      setLoading(false);
    }
    loadStorageData();
  }, []);

  async function login(credentials: LoginCredentials) {
    try {
      const response = await authService.login(credentials);

      localStorage.setItem("@Aequo:token", response.token || "");
      localStorage.setItem("@Aequo:user", JSON.stringify(response.user));

      api.defaults.headers.common["Authorization"] = `Bearer ${response.token}`;

      setAuthState({
        isAuthenticated: true,
        user: response.user,
        token: response.token,
      });
    } catch (error) {
      throw error;
    }
  }

  async function register(credentials: RegisterCredentials) {
    try {
      const response = await authService.register(credentials);

      localStorage.setItem("@Aequo:token", response.token || "");
      localStorage.setItem("@Aequo:user", JSON.stringify(response.user));

      api.defaults.headers.common["Authorization"] = `Bearer ${response.token}`;

      setAuthState({
        isAuthenticated: true,
        user: response.user,
        token: response.token,
      });
    } catch (error) {
      throw error;
    }
  }

  function logout() {
    localStorage.removeItem("@Aequo:token");
    localStorage.removeItem("@Aequo:user");

    api.defaults.headers.common["Authorization"] = undefined;
    setAuthState({ isAuthenticated: false, user: undefined, token: undefined });
    window.location.href = "/login";
  }

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-gray-900 text-white">
        Loading...
      </div>
    );
  }

  return (
    <AuthContext.Provider
      value={{ authState, login, register, logout, loading, setLoading }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}

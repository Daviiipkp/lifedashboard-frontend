import { api } from "./api";
import type { LoginCredentials, AuthResponse, RegisterCredentials } from "../types/auth";

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>("/auth/login", credentials);
    return response.data;
  },

  async register(credentials: RegisterCredentials): Promise<AuthResponse> {
    const response = await api.post("/auth/register", credentials);
    return response.data
  }
};
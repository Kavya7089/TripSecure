import { User } from "../types";

export class AuthService {
  private static instance: AuthService;

  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  async login(email: string, password: string): Promise<User> {
    const API_BASE = import.meta.env.VITE_API_URL || "https://trip-secure-backend.vercel.app/api";
    const response = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      throw new Error("Login failed");
    }

    const data = await response.json();
    localStorage.setItem("authToken", data.token);
    return data.user;
  }

  async register(userData: {
    name: string;
    email: string;
    password: string;
    role?: string;
    phone?: string;
  }): Promise<User> {
    const response = await fetch("https://trip-secure-backend.vercel.app/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      throw new Error("Registration failed");
    }

    const data = await response.json();
    localStorage.setItem("authToken", data.token);
    return data.user;
  }

  async getCurrentUser(): Promise<User | null> {
    const token = localStorage.getItem("authToken");
    if (!token) return null;

    // fetch profile from backend
    const response = await fetch("https://trip-secure-backend.vercel.app/api/auth/login", {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) return null;

    return await response.json();
  }

  async logout(): Promise<void> {
    localStorage.removeItem("authToken");
  }
}

export const authService = AuthService.getInstance();

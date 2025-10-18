// lib/firebase/services/authService.ts
import {
  createUserWithEmailAndPassword as fbCreateUserWithEmailAndPassword,
  signInWithEmailAndPassword as fbSignInWithEmailAndPassword,
  signOut as fbSignOut,
  type User,
} from "firebase/auth";
import { auth } from "../config";

export interface AuthResponse {
  user: User | null;
  token?: string;
}

export const authService = {
  // Login com email e senha
  async login(email: string, password: string): Promise<AuthResponse> {
    try {
      const userCredential = await fbSignInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const token = await userCredential.user.getIdToken();
      return {
        user: userCredential.user,
        token,
      };
    } catch (error) {
      throw new Error(
        `Erro ao fazer login: ${
          error instanceof Error ? error.message : "Erro desconhecido"
        }`
      );
    }
  },

  // Registrar novo usuário
  async register(email: string, password: string): Promise<AuthResponse> {
    try {
      const userCredential = await fbCreateUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const token = await userCredential.user.getIdToken();
      return {
        user: userCredential.user,
        token,
      };
    } catch (error) {
      throw new Error(
        `Erro ao registrar: ${
          error instanceof Error ? error.message : "Erro desconhecido"
        }`
      );
    }
  },

  // Logout
  async logout(): Promise<void> {
    try {
      await fbSignOut(auth);
    } catch (error) {
      throw new Error(
        `Erro ao fazer logout: ${
          error instanceof Error ? error.message : "Erro desconhecido"
        }`
      );
    }
  },

  // Obter usuário atual
  getCurrentUser(): User | null {
    return auth.currentUser;
  },

  // Obter token do usuário atual
  async getCurrentUserToken(): Promise<string | null> {
    if (auth.currentUser) {
      return await auth.currentUser.getIdToken();
    }
    return null;
  },
};

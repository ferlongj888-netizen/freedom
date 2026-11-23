import { create } from "zustand";
import { persist } from "zustand/middleware";
import { loginUser } from "../api/auth";
import type { User } from "../types/user";

type AuthState = {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  clearError: () => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isLoading: false,
      error: null,

      login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
          const response = await loginUser(email, password);
          console.log("ОТВЕТ ОТ СЕРВЕРА:", response); 
          
          set({ 
            token: response.access_token, 
            user: response.user, 
            isLoading: false 
          });
          return true;
        } catch (err: any) {
          const message = err.response?.data?.detail || "Неверный email или пароль";
          set({ error: message, isLoading: false });
          return false;
        }
      },

      logout: () => {
        set({ user: null, token: null, error: null });
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: "freedom-auth",
      partialize: (state: AuthState) => ({ user: state.user, token: state.token }),
    }
  )
);
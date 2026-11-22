import { api } from "./client";
import type { User, LoginResponse } from "../types/user";

export async function registerUser(data: { email: string; name: string; password: string }): Promise<User> {
  const response = await api.post<User>("/auth/register", data);
  return response.data;
}

export async function loginUser(email: string, password: string): Promise<LoginResponse> {
  const formData = new URLSearchParams();
  formData.append("username", email); 
  formData.append("password", password);

  const response = await api.post<LoginResponse>("/auth/login", formData, {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });
  
  return response.data;
}
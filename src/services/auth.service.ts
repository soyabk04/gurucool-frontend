import { api } from "@/api/axios";

export type UserRole = "user" | "superadmin" | "admin" | "coordinator";

export interface AuthUser {
  userId?: string;
  name?: string;
  role: UserRole;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  user: {
    name: string;
    role: UserRole;
  };
}

export const login = async (data: LoginRequest): Promise<LoginResponse> => {
  const response = await api.post("/auth/login", data);
  return response.data;
};

export const logout = async () => {
  const response = await api.post("/auth/logout");
  return response.data;
};

// Backend has no dedicated `/auth/me` route — `/auth/isloggedin` already
// verifies the session cookie via authMiddleware *and* returns the decoded
// {userId, role} payload, so it doubles as the "who am I" endpoint.
export const me = async (): Promise<{ success: boolean; user: AuthUser }> => {
  const response = await api.get("/auth/isloggedin");
  return response.data;
};

export const checklogin = async () => {
  const response = await api.post("/auth/checklogin");
  return response.data;
};

export const genAccessToken = async () => {
  const response = await api.post("/auth/accesstoken");
  return response.data;
};
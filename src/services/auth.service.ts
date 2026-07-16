import { api } from "@/api/axios";

export interface LoginRequest {
  email: string;
  password: string;
}

export const login = async (data: LoginRequest) => {
  const response = await api.post("/auth/login", data);
  return response.data;
};

export const logout = async () => {
  const response = await api.post("/auth/logout");
  return response.data;
};

export const me = async () => {
  const response = await api.get("/auth/me");
  return response.data;
};

export const checklogin=async ()=>{
  const response = await api.post("/auth/checklogin");
  // console.log(response)
  return response.data;
}

export const genAccessToken =async ()=>{
  const response = await api.post("/auth/accesstoken");
  console.log(response)
   return response.data;
}
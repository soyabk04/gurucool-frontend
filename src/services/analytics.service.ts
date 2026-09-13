import { api } from "@/api/axios";

import type{ DashboardResponse } from "../types/dashboard";

export async function getDashboard(): Promise<DashboardResponse> {
  const response = await api.get("/analytics/admin/dashboard");
console.log(response.data)
  return response.data.data;
}

export async function getCoordinatorDashboard(): Promise<DashboardResponse> {
  const response = await api.get("/analytics/coordinator/dashboard");
console.log(response.data)
  return response.data.data;
}

export async function getUserDashboard(userId?:string): Promise<DashboardResponse> {
  if(userId){
    const response = await api.get(`/analytics/user/dashboard/${userId}`);
    return response.data.data
  }
  const response = await api.get("/analytics/user/dashboard");

  return response.data.data;
}
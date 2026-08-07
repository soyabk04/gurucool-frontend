import { api } from "@/api/axios";

import type{ DashboardResponse } from "../types/dashboard";

export async function getDashboard(): Promise<DashboardResponse> {
  const response = await api.get("/analytics/dashboard");
console.log(response.data)
  return response.data.data;
}
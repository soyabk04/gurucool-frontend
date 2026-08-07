import { useQuery } from "@tanstack/react-query";
import { getDashboard } from "../services/analytics.service";
import {type DashboardResponse } from "../types/dashboard";

export function useDashboard() {
  return useQuery<DashboardResponse>({
    queryKey: ["dashboard"],
    queryFn: getDashboard,

    staleTime: 1000 * 60 * 5, // 5 minutes

    gcTime: 1000 * 60 * 30, // 30 minutes

    retry: 2,

    refetchOnWindowFocus: false,
  });
}
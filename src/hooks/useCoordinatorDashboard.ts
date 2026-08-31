import { useQuery } from "@tanstack/react-query";
import { getCoordinatorDashboard } from "../services/analytics.service";


export function useCoordinatorDashboard() {
  return useQuery<any>({
    queryKey: ["coordinator-dashboard"],
    queryFn: getCoordinatorDashboard,

    staleTime: 1000 * 60 * 5, // 5 minutes

    gcTime: 1000 * 60 * 30, // 30 minutes

    retry: 2,

    refetchOnWindowFocus: false,
  });
}
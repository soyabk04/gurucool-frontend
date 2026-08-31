import { useQuery } from "@tanstack/react-query";

import { getUserDashboard } from "../services/analytics.service";

export interface UserDashboardData {
  user: {
    id: string;
    name: string;
    email: string;
  };

  stats: {
    totalCourses: number;
    completedCourses: number;
    activeCourses: number;
    averageProgress: number;
    completionRate: number;
  };

  courses: {
    id: string;
    name: string;
    progress: number;
    status: string;
    updatedAt: string;
  }[];

  charts: {
    completion: {
      name: string;
      value: number;
    }[];
  };

  recentActivities: {
    _id: string;
    action: string;
    target: string;
    progress: number;
    createdAt: string;
  }[];
}

export function useUserDashboard() {
  return useQuery<any>({
    queryKey: ["user-dashboard"],

    queryFn: getUserDashboard,

    staleTime: 1000 * 60 * 5,

    gcTime: 1000 * 60 * 30,

    retry: 2,

    refetchOnWindowFocus: false,
  });
}
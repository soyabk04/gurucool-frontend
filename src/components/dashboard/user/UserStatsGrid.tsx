import {
  BookOpen,
  CheckCircle2,
  GraduationCap,
  TrendingUp,
} from "lucide-react";

import { StatsCard } from "../StatsCard";

interface Props {
  stats: {
    totalCourses: number;
    completedCourses: number;
    activeCourses: number;
    averageProgress: number;
    completionRate: number;
  };
}

export function UserStatsGrid({ stats }: Props) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
      <StatsCard
        title="My Courses"
        value={stats.totalCourses}
        icon={BookOpen}
        description="Courses you're enrolled in"
      />

      <StatsCard
        title="In Progress"
        value={stats.activeCourses}
        icon={TrendingUp}
        description="Courses currently active"
      />

      <StatsCard
        title="Completed"
        value={stats.completedCourses}
        icon={CheckCircle2}
        description="Courses completed"
      />

      <StatsCard
        title="Average Progress"
        value={`${stats.averageProgress}%`}
        icon={GraduationCap}
        description="Overall learning progress"
      />
    </div>
  );
}
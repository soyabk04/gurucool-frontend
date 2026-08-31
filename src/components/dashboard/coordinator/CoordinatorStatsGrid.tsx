import {
  BookOpen,
  GraduationCap,
  TrendingUp,
  Users,
} from "lucide-react";

import { StatsCard } from "../StatsCard";

interface Props {
  stats: {
    totalStudents: number;
    activeStudents: number;
    totalCourses: number;
    totalEnrollments: number;
    averageProgress: number;
    completionRate: number;
  };
}

export function CoordinatorStatsGrid({ stats }: Props) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
      <StatsCard
        title="Students"
        value={stats.totalStudents}
        icon={GraduationCap}
        description="Students in your group"
      />

      <StatsCard
        title="Active Students"
        value={stats.activeStudents}
        icon={Users}
        description="Active in the last 30 days"
      />

      <StatsCard
        title="Courses"
        value={stats.totalCourses}
        icon={BookOpen}
        description="Assigned to your group"
      />

      <StatsCard
        title="Enrollments"
        value={stats.totalEnrollments}
        icon={TrendingUp}
        description="Total course enrollments"
      />
    </div>
  );
}
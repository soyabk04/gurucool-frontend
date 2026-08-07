import {
  BookOpen,
  GraduationCap,
  Users,
  UserRoundCog,
} from "lucide-react";

import { StatsCard } from "./StatsCard";

interface Props {
  stats: {
    totalStudents: number;
    totalGroups: number;
    totalCourses: number;
    totalCoordinators: number;
  };
}

export function StatsGrid({ stats }: Props) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
      <StatsCard
        title="Students"
        value={stats.totalStudents}
        icon={GraduationCap}
        trend={8}
        description="Registered learners"
      />

      <StatsCard
        title="Groups"
        value={stats.totalGroups}
        icon={Users}
        trend={5}
        description="Learning groups"
      />

      <StatsCard
        title="Courses"
        value={stats.totalCourses}
        icon={BookOpen}
        trend={12}
        description="Available courses"
      />

      <StatsCard
        title="Coordinators"
        value={stats.totalCoordinators}
        icon={UserRoundCog}
        trend={2}
        description="Managing students"
      />
    </div>
  );
}
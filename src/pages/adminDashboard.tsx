import { DashboardHeader } from "../components/dashboard/DashboardHeader";
import { DashboardSkeleton } from "../components/dashboard/DashboardSkeleton";
import { DashboardError } from "../components/dashboard/DashboardError";
import { EmptyStats } from "../components/dashboard/EmptyState";
import { QuickActions } from "../components/dashboard/QuickActions";
import { StatsGrid } from "../components/dashboard/StatsGrid";
import { StudentActivityChart } from "../components/dashboard/StudentActivityChart";
import { CompletionChart } from "../components/dashboard/CompletionChart";
import { PopularCoursesChart } from "../components/dashboard/PopularCoursesChart";
import { RecentActivity } from "../components/dashboard/RecentActivity";
import { GroupsTable } from "../components/dashboard/GroupsTable";

import { useDashboard } from "../hooks/useDashboard";

export default function AdminDashboardPage() {
  const {
    data,
    isLoading,
    isError,
    refetch,
  } = useDashboard();

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  if (isError || !data) {
    return <DashboardError onRetry={refetch} />;
  }

  const isEmpty =
    data.stats.totalStudents === 0 &&
    data.stats.totalGroups === 0 &&
    data.stats.totalCourses === 0;

  return (
    <div className="space-y-6 p-6">
      <DashboardHeader
        title="Organization Dashboard"
        organizationName={data.organization.name}
        onRefresh={refetch}
      />

      <QuickActions />

      {isEmpty ? (
        <EmptyStats />
      ) : (
        <>
          <StatsGrid stats={data.stats} />

          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <StudentActivityChart
                data={data.charts.studentActivity}
              />
            </div>

            <CompletionChart
              data={data.charts.completion}
            />
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <PopularCoursesChart
                data={data.charts.popularCourses}
              />
            </div>

            <RecentActivity
              activities={data.recentActivities}
            />
          </div>

          <GroupsTable
            groups={data.groups}
          />
        </>
      )}
    </div>
  );
}
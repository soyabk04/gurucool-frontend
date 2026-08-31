import { DashboardHeader } from "../components/dashboard/DashboardHeader";
import { DashboardSkeleton } from "../components/dashboard/DashboardSkeleton";
import { DashboardError } from "../components/dashboard/DashboardError";
import { RecentActivity } from "../components/dashboard/RecentActivity";

import { UserStatsGrid } from "../components/dashboard/user/UserStatsGrid";
import { UserProgressCard } from "../components/dashboard/user/UserProgressCard";
import { MyCourses } from "../components/dashboard/user/MyCourses";
import { UserCompletionChart } from "../components/dashboard/user/UserCompletionChart";

import { useUserDashboard } from "../hooks/useUserDashboard";

export default function UserDashboardPage() {
  const {
    data,
    isLoading,
    isError,
    refetch,
  } = useUserDashboard();

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  if (isError || !data) {
    return (
      <DashboardError onRetry={refetch} />
    );
  }

  const isEmpty =
    data.stats.totalCourses === 0;

  return (
    <div className="space-y-6 p-6">

      {/* Header */}

      <DashboardHeader
        title="My Learning Dashboard"
        organizationName={`Welcome, ${data.user.name}`}
        onRefresh={refetch}
      />


      {/* Stats */}

      <UserStatsGrid
        stats={data.stats}
      />


      {isEmpty ? (
        <div className="rounded-2xl border border-dashed p-12 text-center">
          <h2 className="text-lg font-semibold">
            No courses yet
          </h2>

          <p className="mt-2 text-sm text-muted-foreground">
            You haven't been enrolled in any courses yet.
          </p>
        </div>
      ) : (
        <>

          {/* Progress + Completion */}

          <div className="grid gap-6 lg:grid-cols-3">

            <div className="lg:col-span-2">
              <UserProgressCard
                averageProgress={
                  data.stats.averageProgress
                }
                completionRate={
                  data.stats.completionRate
                }
              />
            </div>

            <UserCompletionChart
              data={
                data.charts.completion
              }
            />

          </div>


          {/* Courses + Activity */}

          <div className="grid gap-6 lg:grid-cols-3">

            <div className="lg:col-span-2">
              <MyCourses
                courses={data.courses}
              />
            </div>

            <RecentActivity
              activities={
                data.recentActivities
              }
            />

          </div>

        </>
      )}

    </div>
  );
}
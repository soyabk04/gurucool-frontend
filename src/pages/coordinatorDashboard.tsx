import { DashboardHeader } from "../components/dashboard/DashboardHeader";
import { DashboardSkeleton } from "../components/dashboard/DashboardSkeleton";
import { DashboardError } from "../components/dashboard/DashboardError";

import { StudentActivityChart } from "../components/dashboard/StudentActivityChart";
import { CompletionChart } from "../components/dashboard/CompletionChart";
import { RecentActivity } from "../components/dashboard/RecentActivity";

import { CoordinatorStatsGrid } from "../components/dashboard/coordinator/CoordinatorStatsGrid";
import { CoordinatorProgressOverview } from "../components/dashboard/coordinator/CoordinatorProgressOverview";
import { CoordinatorGroupCard } from "../components/dashboard/coordinator/CoordinatorGroupCard";
import { CoordinatorQuickActions } from "../components/dashboard/coordinator/CoordinatorQuickActions";
import { CoursePerformanceChart } from "../components/dashboard/coordinator/CoursePerformanceChart";
import { StudentsNeedingAttention } from "../components/dashboard/coordinator/StudentsNeedingAttention";

import { useCoordinatorDashboard } from "../hooks/useCoordinatorDashboard";

export default function CoordinatorDashboardPage() {
  const {
    data,
    isLoading,
    isError,
    refetch,
  } = useCoordinatorDashboard();

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  if (isError || !data) {
    return (
      <DashboardError onRetry={refetch} />
    );
  }

  const isEmpty =
    data.stats.totalStudents === 0 &&
    data.stats.totalCourses === 0 &&
    data.stats.totalEnrollments === 0;

  return (
    <div className="space-y-6 p-6">

      {/* Header */}
      <DashboardHeader
        title="Coordinator Dashboard"
        organizationName={data.group.name}
        onRefresh={refetch}
      />


      {/* Group */}
      <CoordinatorGroupCard
        group={data.group}
      />


      {/* Quick Actions */}
      <CoordinatorQuickActions />


      {isEmpty ? (
        <div className="rounded-2xl border border-dashed p-12 text-center">
          <h2 className="text-lg font-semibold">
            No learning data yet
          </h2>

          <p className="mt-2 text-sm text-muted-foreground">
            Your group does not have any students,
            courses, or enrollments yet.
          </p>
        </div>
      ) : (
        <>

          {/* Stats */}
          <CoordinatorStatsGrid
            stats={data.stats}
          />


          {/* Progress */}
          <CoordinatorProgressOverview
            averageProgress={
              data.stats.averageProgress
            }
            completionRate={
              data.stats.completionRate
            }
          />


          {/* Activity + Completion */}
          <div className="grid gap-6 lg:grid-cols-3">

            <div className="lg:col-span-2">
              <StudentActivityChart
                data={
                  data.charts.studentActivity
                }
              />
            </div>

            <CompletionChart
              data={
                data.charts.completion
              }
            />

          </div>


          {/* Course performance + Recent Activity */}
          <div className="grid gap-6 lg:grid-cols-3">

            <div className="lg:col-span-2">
              <CoursePerformanceChart
                data={
                  data.charts.coursePerformance
                }
              />
            </div>

            <RecentActivity
              activities={
                data.recentActivities
              }
            />

          </div>


          {/* Students needing attention */}
          <StudentsNeedingAttention
            students={
              data.studentsNeedingAttention
            }
          />

        </>
      )}

    </div>
  );
}
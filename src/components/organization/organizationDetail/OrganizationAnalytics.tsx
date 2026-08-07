import {
  Users,
  UsersRound,
  BookOpen,
  ShieldCheck,
  GraduationCap,
  CheckCircle2,
  TrendingUp,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  Tooltip,
  LineChart,
  Line,
} from "recharts";

export interface AnalyticsData {
  overview: {
    users: number;
    groups: number;
    courses: number;
    coordinators: number;
  };
  learning: {
    enrollments: number;
    completedEnrollments: number;
    averageProgress: number;
    completionRate: number;
  };
  enrollmentTrend: { month: string; count: number }[];
  completionTrend: { month: string; count: number }[];
  topCourses: {
    _id: string;
    title: string;
    enrolled: number;
    completed: number;
    completionRate: number;
  }[];
  groupPerformance: {
    _id: string;
    name: string;
    users: number;
    averageProgress: number;
  }[];
  recentActivity: {
    _id: string;
    title: string;
    time: string;
  }[];
}

interface Props {
  analytics: AnalyticsData;
}

export default function OrganizationAnalytics({ analytics }: Props) {
  const cards = [
    { title: "Users", value: analytics.overview.users, icon: Users },
    { title: "Groups", value: analytics.overview.groups, icon: UsersRound },
    { title: "Courses", value: analytics.overview.courses, icon: BookOpen },
    { title: "Coordinators", value: analytics.overview.coordinators, icon: ShieldCheck },
    { title: "Enrollments", value: analytics.learning.enrollments, icon: GraduationCap },
    { title: "Completed", value: analytics.learning.completedEnrollments, icon: CheckCircle2 },
    { title: "Progress", value: `${analytics.learning.averageProgress}%`, icon: TrendingUp },
    { title: "Completion", value: `${analytics.learning.completionRate}%`, icon: TrendingUp },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Organization Analytics</h1>
        <p className="text-muted-foreground">
          Learning performance and organization overview.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <Card key={card.title}>
              <CardContent className="flex items-center justify-between p-6">
                <div>
                  <p className="text-sm text-muted-foreground">{card.title}</p>
                  <h2 className="mt-2 text-3xl font-bold">{card.value}</h2>
                </div>
                <div className="rounded-xl bg-primary/10 p-3">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Enrollment Trend</CardTitle></CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={analytics.enrollmentTrend}>
                <CartesianGrid strokeDasharray="3 3"/>
                <XAxis dataKey="month"/>
                <Tooltip/>
                <Area dataKey="count" type="monotone"/>
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Completion Trend</CardTitle></CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={analytics.completionTrend}>
                <CartesianGrid strokeDasharray="3 3"/>
                <XAxis dataKey="month"/>
                <Tooltip/>
                <Line dataKey="count" type="monotone"/>
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Top Performing Courses</CardTitle></CardHeader>
          <CardContent className="space-y-5">
            {analytics.topCourses.map(course=>(
              <div key={course._id}>
                <div className="mb-2 flex justify-between">
                  <div>
                    <p className="font-medium">{course.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {course.completed}/{course.enrolled} completed
                    </p>
                  </div>
                  <span className="font-semibold">{course.completionRate}%</span>
                </div>
                <Progress value={course.completionRate}/>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Group Performance</CardTitle></CardHeader>
          <CardContent className="space-y-5">
            {analytics.groupPerformance.map(group=>(
              <div key={group._id}>
                <div className="mb-2 flex justify-between">
                  <div>
                    <p className="font-medium">{group.name}</p>
                    <p className="text-xs text-muted-foreground">{group.users} users</p>
                  </div>
                  <span>{group.averageProgress}%</span>
                </div>
                <Progress value={group.averageProgress}/>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle>Recent Activity</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          {analytics.recentActivity.map(item=>(
            <div key={item._id} className="flex items-start justify-between border-b pb-3 last:border-0">
              <div>
                <p className="font-medium">{item.title}</p>
                <p className="text-sm text-muted-foreground">{item.time}</p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
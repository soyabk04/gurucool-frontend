// src/types/organization.ts

export interface Organization {
  _id:string;
  name: string;
  domain: string;
  primaryColor: string;
  secondaryColor: string;
  logoUrl: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface OrganizationUser {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface CreateOraganization {
  name: string;
  domain: string;
  primaryColor: string;
  secondaryColor: string;
  users: {
    name: string;
    ID: string;
    email: string;
    role: "admin";
  }[];
}
export interface AnalyticsOverview {
  users: number;
  groups: number;
  courses: number;
  coordinators: number;
}

export interface LearningAnalytics {
  enrollments: number;

  completedEnrollments: number;

  averageProgress: number;

  completionRate: number;
}

export interface TrendData {
  month: string;
  count: number;
}

export interface TopCourse {
  _id: string;

  title: string;

  enrolled: number;

  completed: number;

  completionRate: number;
}

export interface GroupPerformance {
  _id: string;

  name: string;

  users: number;

  averageProgress: number;
}
export interface RecentActivity {
  _id: string;

  title: string;

  time: string;
}

export interface OrganizationAnalytics {
  overview: AnalyticsOverview;

  learning: LearningAnalytics;

  enrollmentTrend: TrendData[];

  completionTrend: TrendData[];

  topCourses: TopCourse[];

  groupPerformance: GroupPerformance[];

  recentActivity: RecentActivity[];
}

export interface OrganizationDetails {
  _id: string;
  status: string;
  name: string;
  domain: string;

  logoUrl: string;

  primaryColor: string;
  secondaryColor: string;

  stats: OrganizationAnalytics;
}


export interface DashboardResponse {
  organization: Organization;

  stats: DashboardStats;

  charts: DashboardCharts;

  groups: GroupOverview[];

  recentActivities: RecentActivity[];

  coordinatorPerformance: CoordinatorPerformance[];

  topGroups: TopGroup[];

  lowestGroups: LowestGroup[];
}

export interface Organization {
  _id: string;
  name: string;
  primaryColor: string;
  secondaryColor: string;
  logoUrl: string;
}

export interface DashboardStats {
  totalStudents: number;
  totalCoordinators: number;
  totalGroups: number;
  totalCourses: number;
  totalEnrollments: number;

  activeStudents: number;

  averageProgress: number;

  completionRate: number;
}

export interface DashboardCharts {
  studentActivity: StudentActivity[];

  enrollmentTrend: EnrollmentTrend[];

  completion: CompletionChart[];

  popularCourses: PopularCourse[];
}

export interface StudentActivity {
  day: string;
  activeStudents: number;
}

export interface EnrollmentTrend {
  month: string;
  enrollments: number;
}

export interface CompletionChart {
  name: "Completed" | "In Progress" | "Not Started";
  value: number;
}

export interface PopularCourse {
  id: string;
  name: string;
  students: number;
}

export interface GroupOverview {
  _id: string;

  name: string;

  coordinator: string;

  students: number;

  progress: number;

  completion: number;
}

export interface RecentActivity {
  _id: string;

  user: string;

  action: "completed" | "enrolled";

  target: string;

  createdAt: string;
}

export interface CoordinatorPerformance {
  _id: string;

  name: string;

  students: number;

  progress: number;
}

export interface TopGroup {
  _id: string;

  name: string;

  progress: number;
}

export interface LowestGroup {
  _id: string;

  name: string;

  coordinator: string;

  students: number;

  progress: number;

  completion: number;
}

export interface CoordinatorDashboardData {
  group: {
    id: string;
    name: string;
    groupCode?: string;
  };

  stats: {
    totalStudents: number;
    activeStudents: number;
    totalCourses: number;
    totalEnrollments: number;
    averageProgress: number;
    completionRate: number;
  };

  charts: {
    studentActivity: {
      day: string;
      activeStudents: number;
    }[];

    coursePerformance: {
      id: string;
      name: string;
      students: number;
      progress: number;
      completed: number;
      completionRate: number;
    }[];

    completion: {
      name: string;
      value: number;
    }[];
  };

  studentsNeedingAttention: {
    id: string;
    name: string;
    email: string;
    course: string;
    progress: number;
    status: string;
    updatedAt: string;
  }[];

  recentActivities: {
    _id: string;
    user: string;
    action: string;
    target: string;
    progress: number;
    createdAt: string;
  }[];
}
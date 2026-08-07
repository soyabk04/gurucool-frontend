import {
  BookOpen,
  Building2,
  GraduationCap,
  LayoutDashboard,
  Link2,
  Settings,
  Shield,
  Users,
  UsersRound,
  type LucideIcon,
} from "lucide-react";

import type { UserRole } from "@/services/auth.service";

export interface NavigationItem {
  title: string;
  href: string;
  icon: LucideIcon;
  roles: UserRole[];
  badge?: string;
}

export interface NavigationGroup {
  title: string;
  items: NavigationItem[];
}

export const navigation: NavigationGroup[] = [
  {
    title: "Overview",

    items: [
      {
        title: "Dashboard",
        href: "/dashboard",
        icon: LayoutDashboard,
        roles: [
          "superadmin",
          "admin",
          "coordinator",
          "user",
        ],
      },
    ],
  },

  {
    title: "Management",

    items: [
      {
        title: "Organizations",
        href: "/organization",
        icon: Building2,
        roles: ["superadmin"],
      },

      {
        title: "Users",
        href: "/users",
        icon: Users,
        roles: [
          "superadmin",
          "admin",
          "coordinator",
        ],
      },

      {
        title: "Groups",
        href: "/group",
        icon: UsersRound,
        roles: [
          "admin",
          "coordinator",
        ],
      },
    ],
  },

  {
    title: "Learning",

    items: [
      {
        title: "Courses",
        href: "/courses",
        icon: BookOpen,
        roles: [
          "superadmin",
          "admin",
          "coordinator",
          "user",
        ],
      },

      {
        title: "Assign Organization",
        href: "/courses/assignOrg",
        icon: Link2,
        roles: ["superadmin"],
      },

      {
        title: "Assign Group",
        href: "/courses/assigngrp",
        icon: GraduationCap,
        roles: ["admin"],
      },

      {
        title: "Assign Users",
        href: "/courses/assign-course",
        icon: Link2,
        roles: ["coordinator"],
      },
    ],
  },

  {
    title: "Administration",

    items: [
      {
        title: "Settings",
        href: "/settings",
        icon: Settings,
        roles: [
          "superadmin",
          "admin",
        ],
      },

      {
        title: "Permissions",
        href: "/permissions",
        icon: Shield,
        roles: ["superadmin"],
        badge: "Soon",
      },
    ],
  },
];
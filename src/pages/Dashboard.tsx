import { Link } from "react-router-dom";
import {
  Building2Icon,
  UsersIcon,
  UsersRoundIcon,
  BookOpenIcon,
  Link2Icon,
  ArrowRightIcon,
  type LucideIcon,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import type { UserRole } from "@/services/auth.service";

interface QuickAction {
  title: string;
  description: string;
  url: string;
  icon: LucideIcon;
  roles: UserRole[];
}

const QUICK_ACTIONS: QuickAction[] = [
  {
    title: "Courses",
    description: "Browse, manage, or continue learning",
    url: "/courses",
    icon: BookOpenIcon,
    roles: ["superadmin", "admin", "coordinator", "user"],
  },
  {
    title: "Organizations",
    description: "Manage tenant organizations",
    url: "/organization",
    icon: Building2Icon,
    roles: ["superadmin"],
  },
  {
    title: "Users",
    description: "View and manage user accounts",
    url: "/users",
    icon: UsersIcon,
    roles: ["superadmin", "admin", "coordinator"],
  },
  {
    title: "Groups",
    description: "Organize learners into groups",
    url: "/group",
    icon: UsersRoundIcon,
    roles: ["admin", "coordinator"],
  },
  {
    title: "Assign Courses",
    description: "Assign courses to your team",
    url: "/courses/assign-course",
    icon: Link2Icon,
    roles: ["coordinator"],
  },
  {
    title: "Assign to Organization",
    description: "Roll out courses org-wide",
    url: "/courses/assignOrg",
    icon: Link2Icon,
    roles: ["superadmin"],
  },
  {
    title: "Assign to Group",
    description: "Roll out courses to a group",
    url: "/courses/assigngrp",
    icon: Link2Icon,
    roles: ["admin"],
  },
];

function greetingForTime() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

const Dashboard = () => {
  const { user } = useAuth();

  const actions = user
    ? QUICK_ACTIONS.filter((action) => action.roles.includes(user.role))
    : [];

  return (
    <div className="space-y-8">
      <div className="rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent p-6 ring-1 ring-primary/10 sm:p-8">
        <p className="text-sm font-medium text-primary">{greetingForTime()}</p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
          Welcome back{user?.name ? `, ${user.name}` : ""}
        </h1>
        <p className="mt-2 max-w-xl text-sm text-muted-foreground sm:text-base">
          {user?.role === "user"
            ? "Pick up where you left off, or explore courses assigned to you."
            : "Here's a quick jump-off point to manage your organization."}
        </p>
      </div>

      {actions.length > 0 && (
        <div>
          <h2 className="mb-3 text-sm font-medium text-muted-foreground">
            Quick actions
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {actions.map((action) => (
              <Link key={action.url} to={action.url} className="group">
                <Card className="h-full transition-all hover:-translate-y-0.5 hover:shadow-md hover:ring-primary/30">
                  <CardContent className="flex items-start gap-4">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <action.icon className="size-5" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="font-medium leading-none">{action.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {action.description}
                      </p>
                    </div>
                    <ArrowRightIcon className="mt-1 size-4 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;

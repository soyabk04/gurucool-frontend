import {
  GraduationCap,
  Users,
  BookOpen,
} from "lucide-react";

import { Link } from "react-router-dom";

import { Card } from "@/components/ui/card";

const actions = [
  {
    title: "View Students",
    description: "Manage students in your group",
    icon: GraduationCap,
    href: "/users",
  },
  {
    title: "View Courses",
    description: "Review assigned courses",
    icon: BookOpen,
    href: "/courses",
  },
  {
    title: "Manage Group",
    description: "View your group details",
    icon: Users,
    href: "/groups",
  },
];

export function CoordinatorQuickActions() {
  return (
    <Card className="rounded-2xl p-6">
      <div className="mb-6">
        <h2 className="text-lg font-semibold">
          Quick Actions
        </h2>

        <p className="text-sm text-muted-foreground">
          Manage your students and learning group.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {actions.map((action) => {
          const Icon = action.icon;

          return (
            <Link
              key={action.title}
              to={action.href}
              className="group"
            >
              <div className="flex items-center gap-4 rounded-xl border p-4 transition-all hover:border-primary hover:bg-muted/40 hover:shadow-md">
                <div className="rounded-xl bg-primary/10 p-3">
                  <Icon className="h-6 w-6 text-primary" />
                </div>

                <div className="flex-1">
                  <h3 className="font-medium group-hover:text-primary">
                    {action.title}
                  </h3>

                  <p className="text-sm text-muted-foreground">
                    {action.description}
                  </p>
                </div>

                <span className="text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100">
                  →
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </Card>
  );
}
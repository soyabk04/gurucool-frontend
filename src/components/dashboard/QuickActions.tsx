import {
  BookOpen,
  FileSpreadsheet,
  FolderPlus,
  GraduationCap,
  Plus,
  UserCog,
} from "lucide-react";
import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface Action {
  title: string;
  description: string;
  icon: React.ElementType;
  href: string;
}

const actions: Action[] = [
  {
    title: "Add Student",
    description: "Create a new student",
    icon: GraduationCap,
    href: "/users/create",
  },
  {
    title: "Create Group",
    description: "Organize learners",
    icon: FolderPlus,
    href: "/groups/create",
  },
  {
    title: "Assign Course",
    description: "Assign courses to groups",
    icon: BookOpen,
    href: "/assign-course",
  },
  {
    title: "Add Coordinator",
    description: "Manage learning groups",
    icon: UserCog,
    href: "/users/create?role=coordinator",
  },
  {
    title: "Import CSV",
    description: "Bulk create students",
    icon: FileSpreadsheet,
    href: "/users/import",
  },
  {
    title: "New Course",
    description: "Create course",
    icon: Plus,
    href: "/courses/create",
  },
];

export function QuickActions() {
  return (
    <Card className="rounded-2xl p-6">
      <div className="mb-6">
        <h2 className="text-lg font-semibold">
          Quick Actions
        </h2>

        <p className="text-sm text-muted-foreground">
          Frequently used shortcuts.
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

                <Button
                  variant="ghost"
                  size="icon"
                  className="opacity-0 transition-opacity group-hover:opacity-100"
                >
                  →
                </Button>
              </div>
            </Link>
          );
        })}
      </div>
    </Card>
  );
}
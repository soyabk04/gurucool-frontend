import {
  BookOpen,
  GraduationCap,
  Plus,
  Users,
} from "lucide-react";
import { Link } from "react-router-dom";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";

export function EmptyStats() {
  return (
    <Card className="rounded-2xl border-dashed">
      <CardHeader className="text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
          <GraduationCap className="h-8 w-8 text-primary" />
        </div>

        <CardTitle className="mt-4">
          Welcome to your LMS
        </CardTitle>

        <CardDescription className="mx-auto max-w-md">
          Your organization doesn't have any learning data yet.
          Start by creating groups, inviting students, and
          assigning courses.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className="grid gap-4 sm:grid-cols-3">
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center gap-3 py-6 text-center">
              <Users className="h-8 w-8 text-primary" />

              <div>
                <h3 className="font-medium">
                  Create Group
                </h3>

                <p className="mt-1 text-sm text-muted-foreground">
                  Organize students into learning groups.
                </p>
              </div>

              <Button  className="w-full">
                <Link to="/groups/create">
                  <Plus className="mr-2 h-4 w-4" />
                  New Group
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center gap-3 py-6 text-center">
              <GraduationCap className="h-8 w-8 text-primary" />

              <div>
                <h3 className="font-medium">
                  Add Students
                </h3>

                <p className="mt-1 text-sm text-muted-foreground">
                  Invite students or import them using CSV.
                </p>
              </div>

              <Button  className="w-full">
                <Link to="/users">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Students
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center gap-3 py-6 text-center">
              <BookOpen className="h-8 w-8 text-primary" />

              <div>
                <h3 className="font-medium">
                  Assign Courses
                </h3>

                <p className="mt-1 text-sm text-muted-foreground">
                  Give your students something to learn.
                </p>
              </div>

              <Button  className="w-full">
                <Link to="/assign-course">
                  <Plus className="mr-2 h-4 w-4" />
                  Assign Course
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  );
}
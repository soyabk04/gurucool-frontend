import {
  CheckCircle2,
  UserPlus,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { formatDistanceToNow } from "date-fns";

interface Activity {
  _id: string;
  user: string;
  action: "enrolled" | "completed";
  target: string;
  createdAt: string;
}

interface RecentActivityProps {
  activities: Activity[];
}

const activityConfig = {
  enrolled: {
    icon: UserPlus,
    color: "bg-blue-100 text-blue-600",
    text: "enrolled in",
  },

  completed: {
    icon: CheckCircle2,
    color: "bg-green-100 text-green-600",
    text: "completed",
  },
};

export function RecentActivity({
  activities,
}: RecentActivityProps) {
  return (
    <Card className="rounded-2xl">
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>

        <CardDescription>
          Latest events from your organization
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-5">
        {activities.length === 0 && (
          <p className="text-sm text-muted-foreground">
            No recent activity.
          </p>
        )}

        {activities.map((activity) => {
          const config = activityConfig[activity.action];
          const Icon = config.icon;

          return (
            <div
              key={activity._id}
              className="flex items-start gap-4"
            >
              <div
                className={`rounded-full p-2 ${config.color}`}
              >
                <Icon className="h-4 w-4" />
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-sm leading-6">
                  <span className="font-semibold">
                    {activity.user}
                  </span>{" "}
                  {config.text}{" "}
                  <span className="font-medium">
                    {activity.target}
                  </span>
                </p>

                <p className="text-xs text-muted-foreground">
                  {formatDistanceToNow(
                    new Date(activity.createdAt),
                    {
                      addSuffix: true,
                    }
                  )}
                </p>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
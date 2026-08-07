import { AlertCircle, RefreshCw } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface DashboardErrorProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
}

export function DashboardError({
  title = "Unable to load dashboard",
  description = "Something went wrong while fetching your dashboard data.",
  onRetry,
}: DashboardErrorProps) {
  return (
    <Card className="rounded-2xl border-destructive/30">
      <CardContent className="flex flex-col items-center justify-center py-16">
        <div className="rounded-full bg-destructive/10 p-4">
          <AlertCircle className="h-10 w-10 text-destructive" />
        </div>

        <CardHeader className="text-center">
          <CardTitle>{title}</CardTitle>

          <CardDescription className="max-w-md">
            {description}
          </CardDescription>
        </CardHeader>

        {onRetry && (
          <Button onClick={onRetry}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Try Again
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
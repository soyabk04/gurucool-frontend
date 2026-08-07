import { CalendarDays, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface DashboardHeaderProps {
  title?: string;
  organizationName?: string;
  loading?: boolean;
  onRefresh?: () => void;
  className?: string;
}

export function DashboardHeader({
  title = "Dashboard",
  organizationName,
  loading = false,
  onRefresh,
  className,
}: DashboardHeaderProps) {
  const hour = new Date().getHours();

  const greeting =
    hour < 12
      ? "Good Morning ☀️"
      : hour < 17
      ? "Good Afternoon 👋"
      : "Good Evening 🌙";

  const today = new Intl.DateTimeFormat("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date());

  return (
    <div
      className={cn(
        "flex flex-col gap-6 rounded-2xl border bg-background p-6 shadow-sm lg:flex-row lg:items-center lg:justify-between",
        className
      )}
    >
      {/* Left */}
      <div className="space-y-2">
        <p className="text-sm font-medium text-muted-foreground">
          {greeting}
        </p>

        <h1 className="text-3xl font-bold tracking-tight">{title}</h1>

        {organizationName && (
          <p className="text-muted-foreground">
            {organizationName}
          </p>
        )}

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <CalendarDays className="h-4 w-4" />
          <span>{today}</span>
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          onClick={onRefresh}
          disabled={loading}
        >
          <RefreshCw
            className={`mr-2 h-4 w-4 ${
              loading ? "animate-spin" : ""
            }`}
          />
          Refresh
        </Button>
      </div>
    </div>
  );
}
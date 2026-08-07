import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function DashboardSkeleton() {
  return (
    <div className="space-y-6">

      {/* Header */}
      <Card>
        <CardContent className="space-y-4 p-6">
          <Skeleton className="h-5 w-36" />
          <Skeleton className="h-9 w-72" />
          <Skeleton className="h-4 w-48" />
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Card key={index}>
            <CardContent className="space-y-4 p-6">
              <div className="flex items-center justify-between">
                <Skeleton className="h-10 w-10 rounded-xl" />
                <Skeleton className="h-5 w-12" />
              </div>

              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-8 w-20" />
              <Skeleton className="h-4 w-32" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardContent className="space-y-4 p-6">
            <Skeleton className="h-6 w-44" />
            <Skeleton className="h-[320px] w-full rounded-xl" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="space-y-4 p-6">
            <Skeleton className="h-6 w-40" />
            <Skeleton className="mx-auto h-52 w-52 rounded-full" />
          </CardContent>
        </Card>
      </div>

      {/* Bottom */}
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardContent className="space-y-4 p-6">
            <Skeleton className="h-6 w-44" />
            <Skeleton className="h-[320px] w-full rounded-xl" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="space-y-4 p-6">
            <Skeleton className="h-6 w-36" />

            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="flex items-center gap-3"
              >
                <Skeleton className="h-10 w-10 rounded-full" />

                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-3 w-20" />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Table */}
      <Card>
        <CardContent className="space-y-4 p-6">
          <Skeleton className="h-6 w-40" />

          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton
              key={i}
              className="h-12 w-full"
            />
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
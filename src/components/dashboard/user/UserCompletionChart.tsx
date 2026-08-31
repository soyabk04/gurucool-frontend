import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface Completion {
  name: string;
  value: number;
}

interface Props {
  data: Completion[];
}

export function UserCompletionChart({ data }: Props) {
  const total = data.reduce(
    (sum, item) => sum + item.value,
    0
  );

  return (
    <Card className="rounded-2xl">
      <CardHeader>
        <CardTitle>Course Completion</CardTitle>

        <CardDescription>
          Your course completion overview
        </CardDescription>
      </CardHeader>

      <CardContent className="h-[350px]">
        {total === 0 ? (
          <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
            No course data available.
          </div>
        ) : (
          <ResponsiveContainer
            width="100%"
            height="100%"
          >
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={70}
                outerRadius={110}
                paddingAngle={3}
              >
                {data.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={
                      index === 0
                        ? "hsl(var(--primary))"
                        : "hsl(var(--muted-foreground) / 0.25)"
                    }
                  />
                ))}
              </Pie>

              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface CoursePerformance {
  id: string;
  name: string;
  students: number;
  progress: number;
  completed: number;
  completionRate: number;
}

interface Props {
  data: CoursePerformance[];
}

export function CoursePerformanceChart({ data }: Props) {
  return (
    <Card className="rounded-2xl">
      <CardHeader>
        <CardTitle>Course Performance</CardTitle>

        <CardDescription>
          Average student progress by course
        </CardDescription>
      </CardHeader>

      <CardContent className="h-[360px]">
        {data.length === 0 ? (
          <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
            No course data available.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              layout="vertical"
              data={data}
              margin={{
                left: 20,
                right: 40,
              }}
            >
              <CartesianGrid
                horizontal={false}
                strokeDasharray="3 3"
              />

              <XAxis
                type="number"
                domain={[0, 100]}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${value}%`}
              />

              <YAxis
                type="category"
                dataKey="name"
                width={140}
                tickLine={false}
                axisLine={false}
              />

              <Tooltip
                formatter={(value) => [
                  `${Number(value ?? 0)}%`,
                  "Progress",
                ]}
              />

              <Bar
                dataKey="progress"
                radius={[0, 8, 8, 0]}
                fill="hsl(var(--primary))"
              >
                <LabelList
                  dataKey="progress"
                  position="right"
                  formatter={(value) =>
                    `${Number(value ?? 0)}%`
                  }
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
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

interface PopularCourse {
  id: string;
  name: string;
  students: number;
}

interface PopularCoursesChartProps {
  data: PopularCourse[];
}

export function PopularCoursesChart({
  data,
}: PopularCoursesChartProps) {
  return (
    <Card className="rounded-2xl">
      <CardHeader>
        <CardTitle>Popular Courses</CardTitle>

        <CardDescription>
          Top enrolled courses
        </CardDescription>
      </CardHeader>

      <CardContent className="h-[360px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            layout="vertical"
            data={data}
            margin={{
              left: 20,
              right: 20,
            }}
          >
            <CartesianGrid
              horizontal={false}
              strokeDasharray="3 3"
            />

            <XAxis
              type="number"
              tickLine={false}
              axisLine={false}
            />

            <YAxis
              type="category"
              dataKey="name"
              width={140}
              tickLine={false}
              axisLine={false}
            />

            <Tooltip />

            <Bar
              dataKey="students"
              radius={[0, 8, 8, 0]}
              fill="hsl(var(--primary))"
            >
              <LabelList
                dataKey="students"
                position="right"
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
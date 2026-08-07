import {
  Cell,
  Label,
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

interface CompletionData {
  name: "Completed" | "In Progress" | "Not Started";
  value: number;
}

interface CompletionChartProps {
  data: CompletionData[];
}

const COLORS: Record<CompletionData["name"], string> = {
  Completed: "#22c55e",
  "In Progress": "#3b82f6",
  "Not Started": "#f59e0b",
};

export function CompletionChart({
  data,
}: CompletionChartProps) {
  const total = data.reduce((sum, item) => sum + item.value, 0);

  const completed =
    data.find((item) => item.name === "Completed")?.value ?? 0;

  const percentage =
    total === 0 ? 0 : Math.round((completed / total) * 100);

  return (
    <Card className="rounded-2xl">
      <CardHeader>
        <CardTitle>Course Completion</CardTitle>

        <CardDescription>
          Student learning progress
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className="h-[260px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                innerRadius={70}
                outerRadius={95}
                paddingAngle={4}
                dataKey="value"
              >
                {data.map((entry) => (
                  <Cell
                    key={entry.name}
                    fill={COLORS[entry.name]}
                  />
                ))}

                <Label
                  position="center"
                  content={({ viewBox }) => {
                    if (
                      !viewBox ||
                      !("cx" in viewBox) ||
                      !("cy" in viewBox)
                    ) {
                      return null;
                    }

                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          className="fill-foreground text-2xl font-bold"
                        >
                          {percentage}%
                        </tspan>

                        <tspan
                          x={viewBox.cx}
                          dy={22}
                          className="fill-muted-foreground text-sm"
                        >
                          Completed
                        </tspan>
                      </text>
                    );
                  }}
                />
              </Pie>

              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-6 space-y-4">
          {data.map((item) => (
            <div
              key={item.name}
              className="flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div
                  className="h-3 w-3 rounded-full"
                  style={{
                    backgroundColor: COLORS[item.name],
                  }}
                />

                <span className="text-sm">
                  {item.name}
                </span>
              </div>

              <div className="text-right">
                <p className="font-semibold">
                  {item.value}
                </p>

                <p className="text-xs text-muted-foreground">
                  {total === 0
                    ? 0
                    : Math.round((item.value / total) * 100)}
                  %
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
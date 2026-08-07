import {
  BookOpen,
  ShieldCheck,
  Users,
  UsersRound,
  TrendingUp,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import type { OrganizationDetails } from "@/types/organization";

interface OrganizationStatsProps {
  stats: OrganizationDetails["stats"];
}

const cards = [
  {
    key: "users",
    label: "Users",
    icon: Users,
    color:
      "from-blue-500/20 to-cyan-500/10 text-blue-600 border-blue-500/20",
  },
  {
    key: "groups",
    label: "Groups",
    icon: UsersRound,
    color:
      "from-purple-500/20 to-pink-500/10 text-purple-600 border-purple-500/20",
  },
  {
    key: "courses",
    label: "Courses",
    icon: BookOpen,
    color:
      "from-orange-500/20 to-yellow-500/10 text-orange-600 border-orange-500/20",
  },
  {
    key: "coordinators",
    label: "Coordinators",
    icon: ShieldCheck,
    color:
      "from-emerald-500/20 to-green-500/10 text-emerald-600 border-emerald-500/20",
  },
] as const;

export default function OrganizationStats({
  stats,
}: OrganizationStatsProps) {
  return (
    <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((item) => {
        const Icon = item.icon;
        const value = stats?.overview?.[item.key] ?? 0;

        return (
          <Card
            key={item.key}
            className="group overflow-hidden rounded-2xl border-0 shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
          >
            <CardContent className="relative p-6">
              {/* Background Glow */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-40`}
              />

              <div className="relative flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    {item.label}
                  </p>

                  <h2 className="mt-2 text-4xl font-bold tracking-tight">
                    {value}
                  </h2>

                  <div className="mt-4 flex items-center gap-1 text-xs font-medium text-emerald-600">
                    <TrendingUp className="h-3.5 w-3.5" />
                    Active
                  </div>
                </div>

                <div
                  className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${item.color}`}
                >
                  <Icon className="h-7 w-7" />
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </section>
  );
}
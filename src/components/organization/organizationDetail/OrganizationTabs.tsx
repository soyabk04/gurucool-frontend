import {
  BookOpen,
  LayoutDashboard,
  Settings,
  Users,
  UsersRound,
  BarChart3,
} from "lucide-react";

import {
  TabsList,
  TabsTab,
} from "@/components/ui/tabs";

const tabs = [
  {
    value: "overview",
    label: "Overview",
    icon: LayoutDashboard,
  },
  {
    value: "users",
    label: "Users",
    icon: Users,
  },
  {
    value: "groups",
    label: "Groups",
    icon: UsersRound,
  },
  {
    value: "courses",
    label: "Courses",
    icon: BookOpen,
  },
  {
    value: "analytics",
    label: "Analytics",
    icon: BarChart3,
  },
  {
    value: "settings",
    label: "Settings",
    icon: Settings,
  },
] as const;

export default function OrganizationTabs() {
  return (
    <TabsList
      className="
        flex w-full items-center gap-2
        rounded-2xl border
        bg-background/80
        p-2
        backdrop-blur-xl
      "
    >
      {tabs.map((tab) => {
        const Icon = tab.icon;

        return (
          <TabsTab
            key={tab.value}
            value={tab.value}
            className="
              flex h-11 items-center gap-2
              rounded-xl px-5
              transition-all duration-300

              data-[selected]:bg-primary
              data-[selected]:text-primary-foreground
              data-[selected]:shadow-lg

              hover:bg-muted
            "
          >
            <Icon className="h-4 w-4" />

            {tab.label}
          </TabsTab>
        );
      })}
    </TabsList>
  );
}
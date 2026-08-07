import { Link, useLocation } from "react-router-dom";

import {
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

import { Badge } from "@/components/ui/badge";

import { navigation } from "./navigation";

import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";

interface SidebarNavigationProps {
  search: string;
}

export function SidebarNavigation({
  search,
}: SidebarNavigationProps) {
  const { user } = useAuth();
  const { theme } = useTheme();

  const location = useLocation();

  if (!user) return null;

  return (
    <SidebarContent className="py-2">
      {navigation.map((group) => {
        const items = group.items
          .filter((item) =>
            item.roles.includes(user.role)
          )
          .filter((item) =>
            item.title
              .toLowerCase()
              .includes(search.toLowerCase())
          );

        if (!items.length) return null;

        return (
          <SidebarGroup
            key={group.title}
            className="px-3"
          >
            <SidebarGroupLabel
              className="
                mb-2
                px-2
                text-[11px]
                font-bold
                uppercase
                tracking-widest
                text-muted-foreground
              "
            >
              {group.title}
            </SidebarGroupLabel>

            <SidebarMenu className="space-y-1">
              {items.map((item) => {
                const active =
                  location.pathname === item.href ||
                  (item.href !== "/dashboard" &&
                    location.pathname.startsWith(
                      item.href
                    ));

                return (
                  <SidebarMenuItem
                    key={item.href}
                  >
                    <SidebarMenuButton
                      tooltip={item.title}
                      isActive={active}
                      className="
                        h-11
                        rounded-xl
                        transition-all
                        duration-300
                        hover:translate-x-1
                      "
                      style={
                        active
                          ? {
                              backgroundColor:
                                `${theme?.primaryColor}18`,
                              color:
                                theme?.primaryColor,
                              borderLeft:
                                `4px solid ${theme?.primaryColor}`,
                            }
                          : undefined
                      }
                    >
                      <Link
                        to={item.href}
                        className="flex items-center gap-3"
                      >
                        <div
                          className="flex h-8 w-8 items-center justify-center rounded-lg transition-all"
                          style={{
                            background: active
                              ? `${theme?.primaryColor}20`
                              : "transparent",
                          }}
                        >
                          <item.icon
                            className="h-4 w-4"
                            style={{
                              color: active
                                ? theme?.primaryColor
                                : undefined,
                            }}
                          />
                        </div>

                        <span className="flex-1 truncate font-medium">
                          {item.title}
                        </span>

                        {item.badge && (
                          <Badge
                            variant="secondary"
                            className="text-[10px]"
                          >
                            {item.badge}
                          </Badge>
                        )}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroup>
        );
      })}
    </SidebarContent>
  );
}
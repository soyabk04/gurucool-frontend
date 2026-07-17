import * as React from "react";
import { Link, useLocation } from "react-router-dom";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import {
  GalleryVerticalEndIcon,
  LayoutDashboardIcon,
  Building2Icon,
  UsersIcon,
  UsersRoundIcon,
  BookOpenIcon,
  Link2Icon,
  LogOutIcon,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import type { UserRole } from "@/services/auth.service";

interface NavItem {
  title: string;
  url: string;
  icon: React.ComponentType<{ className?: string }>;
  roles: UserRole[];
}

// Single source of truth for "who can see what" in the sidebar. Keep this
// in sync with the role restrictions enforced server-side in the backend
// route files — this list only controls *visibility*, the backend is what
// actually enforces access.
const NAV_ITEMS: NavItem[] = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboardIcon,
    roles: ["superadmin", "admin", "coordinator", "user"],
  },
  {
    title: "Organizations",
    url: "/organization",
    icon: Building2Icon,
    roles: ["superadmin"],
  },
  {
    title: "Groups",
    url: "/group",
    icon: UsersRoundIcon,
    roles: ["admin", "coordinator"],
  },
  {
    title: "Users",
    url: "/users",
    icon: UsersIcon,
    roles: ["superadmin", "admin", "coordinator"],
  },
  {
    title: "Courses",
    url: "/courses",
    icon: BookOpenIcon,
    roles: ["superadmin", "admin", "coordinator", "user"],
  },
  {
    title: "Assign Course to Organization",
    url: "/courses/assignOrg",
    icon: Link2Icon,
    roles: ["superadmin"],
  },
  {
    title: "Assign Course to Group",
    url: "/courses/assigngrp",
    icon: Link2Icon,
    roles: ["admin"],
  },
  
  {
    title: "Assign Course to Users",
    url: "/courses/assign-course",
    icon: Link2Icon,
    roles: ["coordinator"],
  },
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user, logout } = useAuth();
  const location = useLocation();

  const visibleItems = user
    ? NAV_ITEMS.filter((item) => item.roles.includes(user.role))
    : [];

  const handleLogout = async () => {
    await logout();
    window.location.href = "/login";
  };

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" render={<Link to="/dashboard" />}>
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                <GalleryVerticalEndIcon className="size-4" />
              </div>
              <div className="flex flex-col gap-0.5 leading-none">
                <span className="font-medium">GuruCool</span>
                {user && (
                  <span className="text-xs capitalize text-muted-foreground">
                    {user.role}
                  </span>
                )}
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarMenu>
            {visibleItems.map((item) => {
              const isActive =
                location.pathname === item.url ||
                (item.url !== "/dashboard" &&
                  location.pathname.startsWith(item.url));

              return (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton
                    isActive={isActive}
                    render={<Link to={item.url} />}
                  >
                    <item.icon className="size-4" />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={handleLogout}>
              <LogOutIcon className="size-4" />
              <span>Log out</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}

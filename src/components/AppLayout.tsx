import { Outlet, useLocation, Link } from "react-router-dom";
import { Fragment } from "react";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { AppSidebar } from "@/components/app-sidebar";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";

function toTitle(segment: string) {
  return segment
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function useBreadcrumbs() {
  const { pathname } = useLocation();
  const segments = pathname.split("/").filter(Boolean);

  return segments.map((segment, index) => ({
    label: toTitle(segment),
    href: "/" + segments.slice(0, index + 1).join("/"),
    isLast: index === segments.length - 1,
  }));
}

function initials(name?: string) {
  if (!name) return "?";
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

export default function AppLayout() {
  const { user } = useAuth();
  const {theme}=useTheme()
  const crumbs = useBreadcrumbs();
  if (!user) return <div>Loading...</div>;
  return (
    <SidebarProvider>
      <AppSidebar />

      <SidebarInset>
        <header className="sticky top-0 z-20 flex h-16 shrink-0 items-center gap-3 border-b bg-background/80 px-4 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="h-5" />

          <Breadcrumb className="min-w-0 flex-1">
            <BreadcrumbList>
              {crumbs.length === 0 ? (
                <BreadcrumbItem>
                  <BreadcrumbPage>{theme?.name}</BreadcrumbPage>
                </BreadcrumbItem>
              ) : (
                crumbs.map((crumb) => (
                  <Fragment key={crumb.href}>
                    <BreadcrumbItem>
                      {crumb.isLast ? (
                        <BreadcrumbPage className="truncate">{crumb.label}</BreadcrumbPage>
                      ) : (
                        <BreadcrumbLink render={<Link to={crumb.href} />}>
                          {crumb.label}
                        </BreadcrumbLink>
                      )}
                    </BreadcrumbItem>
                    {!crumb.isLast && <BreadcrumbSeparator />}
                  </Fragment>
                ))
              )}
            </BreadcrumbList>
          </Breadcrumb>

          {user && (
            <div className="flex items-center gap-2.5 pl-2">
              <Badge variant="default" className="hidden capitalize sm:inline-flex">
                {user.role}
              </Badge>
              <Avatar size="sm">
                <AvatarFallback className="bg-primary/10 text-xs font-medium text-primary">
                  {initials(user.name)}
                </AvatarFallback>
              </Avatar>
            </div>
          )}
        </header>

        <main className="flex-1 p-4 sm:p-6">
          <div className="mx-auto w-full max-w-6xl">
            <Outlet />
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}

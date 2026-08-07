import { useLocation } from "react-router-dom";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

const routeNames: Record<string, string> = {
  dashboard: "Dashboard",

  organization: "Organizations",

  users: "Users",

  group: "Groups",

  courses: "Courses",

  assignOrg: "Assign Organization",

  assigngrp: "Assign Group",

  "assign-course": "Assign Users",

  settings: "Settings",
};

export function SidebarBreadcrumb() {
  const location = useLocation();

  const segments = location.pathname
    .split("/")
    .filter(Boolean);

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {segments.map((segment, index) => {
          const href =
            "/" +
            segments
              .slice(0, index + 1)
              .join("/");

          const title =
            routeNames[segment] ??
            decodeURIComponent(segment);

          return (
            <div
              key={href}
              className="flex items-center"
            >
              {index > 0 && (
                <BreadcrumbSeparator />
              )}

              <BreadcrumbItem>
                <BreadcrumbLink
                  href={href}
                >
                  {title}
                </BreadcrumbLink>
              </BreadcrumbItem>
            </div>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
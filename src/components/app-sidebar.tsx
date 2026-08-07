import * as React from "react";

import {
  Sidebar,
  SidebarRail,
} from "@/components/ui/sidebar";

import { SidebarHeader } from "../components/sidebar/SidebarHeader";
import { SidebarSearch } from "../components/sidebar/SidebarSearch";
import { SidebarNavigation } from "../components/sidebar/SidebarNavigation";
import { SidebarFooter } from "../components/sidebar/SidebarFooter";

export function AppSidebar(
  props: React.ComponentProps<typeof Sidebar>
) {
  const [search, setSearch] = React.useState("");

  return (
    <Sidebar
      collapsible="icon"
      {...props}
    >
      <SidebarHeader />

      <SidebarSearch
        value={search}
        onChange={setSearch}
      />

      <SidebarNavigation
        search={search}
      />

      <SidebarFooter />

      <SidebarRail />
    </Sidebar>
  );
}
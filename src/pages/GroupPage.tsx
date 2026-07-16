import { Input } from "@/components/ui/input";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import GroupTable from "@/components/group/GroupTable";
import CreateGroupDialog from "@/components/group/CreateGroupDialog";

export default function GroupPage() {
  return (
    <SidebarProvider>
      <AppSidebar />

      <SidebarInset>
        <header className="flex h-16 items-center border-b px-4">
          <SidebarTrigger />
          <h1 className="ml-4 text-xl font-semibold">GuruCool</h1>
        </header>

        <main className="p-6">
          <div className="container mx-auto space-y-6 py-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold">
                  Groups
                </h1>

                <p className="text-muted-foreground">
                  Manage groups in your organization.
                </p>
              </div>

              <CreateGroupDialog />
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Group List</CardTitle>
              </CardHeader>

              <CardContent className="space-y-4">
                <Input placeholder="Search group..." />

                <GroupTable />
              </CardContent>
            </Card>
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
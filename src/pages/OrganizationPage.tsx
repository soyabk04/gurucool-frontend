import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import CreateOrganizationForm from "@/components/organization/CreateOrganizationForm";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import OrganizationTable from "@/components/organization/OrganizationTable";
import CreateOrganizationDialog from "@/components/organization/CreateOrganizationDialog";

export default function OrganizationPage() {
  return (
    <>    <SidebarProvider>
      <AppSidebar />

      <SidebarInset>
        <header className="flex h-16 items-center border-b px-4">
          <SidebarTrigger />
          <h1 className="ml-4 text-xl font-semibold">GuruCool</h1>
        </header>

        <main className="p-6">
              <div className="container mx-auto py-8 space-y-6">

      <div className="flex items-center justify-between">

        <div>
          <h1 className="text-3xl font-bold">
            Organizations
          </h1>
          <p className="text-muted-foreground">
            Manage organizations in your platform.
          </p>
        </div>

        <CreateOrganizationDialog />
      </div>

      <Card>

        <CardHeader>

          <CardTitle>Organization List</CardTitle>

        </CardHeader>

        <CardContent className="space-y-4">

          <Input
            placeholder="Search organization..."
          />

          <OrganizationTable />

        </CardContent>

      </Card>

    </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
    </>

  );
}
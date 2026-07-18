import { Input } from "@/components/ui/input";
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
    <div className="container mx-auto space-y-6 py-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Groups</h1>
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
  );
}

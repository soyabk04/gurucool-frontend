import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import UserTable from "@/components/user/UserTable";

export default function UserPage() {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto space-y-6 py-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Users</h1>
          <p className="text-muted-foreground">
            Manage users in your organization.
          </p>
        </div>

        <Button onClick={() => navigate("/users/create")}>Add User</Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>User List</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <Input placeholder="Search users..." />
          <UserTable />
        </CardContent>
      </Card>
    </div>
  );
}

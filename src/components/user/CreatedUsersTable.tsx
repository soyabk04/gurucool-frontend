import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Badge } from "@/components/ui/badge";
import type { PendingUser } from "./UserEntryForm";

interface Props {
  users: PendingUser[];
}

export default function CreatedUsersTable({ users }: Props) {
  if (users.length === 0) {
    return (
      <div className="rounded-md border py-8 text-center text-muted-foreground">
        No users have been created.
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Employee ID</TableHead>
          <TableHead>Role</TableHead>
          <TableHead>Group</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {users.map((user, index) => (
          <TableRow key={`${user.email}-${index}`}>
            <TableCell>{user.name}</TableCell>

            <TableCell>{user.email}</TableCell>

            <TableCell>{user.ID}</TableCell>

            <TableCell className="capitalize">
              {user.role}
            </TableCell>

            <TableCell>{user.groupCode}</TableCell>

            <TableCell>
              <Badge>Created</Badge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
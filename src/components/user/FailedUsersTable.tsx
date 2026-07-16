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

export interface FailedUser {
  user: PendingUser;
  error: string;
}

interface Props {
  users: FailedUser[];
}

export default function FailedUsersTable({ users }: Props) {
  if (users.length === 0) {
    return (
      <div className="rounded-md border py-8 text-center text-muted-foreground">
        No failed users.
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
          <TableHead>Error</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {users.map((item, index) => (
          <TableRow key={`${item.user.email}-${index}`}>
            <TableCell>{item.user.name}</TableCell>

            <TableCell>{item.user.email}</TableCell>

            <TableCell>{item.user.ID}</TableCell>

            <TableCell className="capitalize">
              {item.user.role}
            </TableCell>

            <TableCell>{item.user.groupCode}</TableCell>

            <TableCell>
              <Badge variant="destructive">
                {item.error}
              </Badge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
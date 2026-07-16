import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

import type { PendingUser } from "./UserEntryForm";

interface Props {
  users: PendingUser[];
  onRemove: (index: number) => void;
}

export default function PendingUsersTable({
  users,
  onRemove,
}: Props) {
  if (users.length === 0) {
    return (
      <div className="rounded-md border py-8 text-center text-muted-foreground">
        No users added yet.
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
          <TableHead className="text-right">
            Action
          </TableHead>
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

            <TableCell>
              {user.groupCode}
            </TableCell>

            <TableCell className="text-right">
              <Button
                size="icon"
                variant="destructive"
                onClick={() => onRemove(index)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
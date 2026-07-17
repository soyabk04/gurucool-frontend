import { useEffect, useState } from "react";

import { Checkbox } from "@/components/ui/checkbox";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { getUsers } from "@/services/user.service";

interface GroupUser {
  _id: string;
  name: string;
  email: string;
}

interface UserTableProps {
  selected: string[];
  onChange: (users: string[]) => void;
}

export default function UserTable({
  selected,
  onChange,
}: UserTableProps) {
  const [users, setUsers] = useState<GroupUser[]>([]);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    const data = await getUsers();
    console.log(data)
    setUsers(data.users);
  };

  const toggleUser = (id: string) => {
    if (selected.includes(id)) {
      onChange(selected.filter((x) => x !== id));
    } else {
      onChange([...selected, id]);
    }
  };

  const toggleAll = () => {
    if (selected.length === users.length) {
      onChange([]);
    } else {
      onChange(users.map((u) => u._id));
    }
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-12">
            <Checkbox
              checked={
                users.length > 0 &&
                selected.length === users.length
              }
              onCheckedChange={toggleAll}
            />
          </TableHead>

          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {users.map((user) => (
          <TableRow key={user._id}>
            <TableCell>
              <Checkbox
                checked={selected.includes(user._id)}
                onCheckedChange={() =>
                  toggleUser(user._id)
                }
              />
            </TableCell>

            <TableCell>{user.name}</TableCell>

            <TableCell>{user.email}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
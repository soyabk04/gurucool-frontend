import { useEffect, useState } from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Button } from "@/components/ui/button";
import { getUsers } from "@/services/user.service";

interface User {
  _id: string;
  name: string;
  email: string;
  ID: string;
  role: string;
  group: string;
}

export default function UserTable() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);

      const response = await getUsers();

      if (response.success) {
        setUsers(response.users);
      }
    } catch (error) {
      console.error("Failed to fetch users:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (id: string) => {
    console.log("Edit user:", id);
  };

  const handleDelete = async (id: string) => {
    console.log("Delete user:", id);

    // Example:
    // const response = await deleteUser(id);
    // if (response.success) fetchUsers();
  };

  if (loading) {
    return <p>Loading users...</p>;
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
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {users.map((user) => (
          <TableRow key={user._id}>
            <TableCell>{user.name}</TableCell>
            <TableCell>{user.email}</TableCell>
            <TableCell>{user.ID}</TableCell>
            <TableCell className="capitalize">{user.role}</TableCell>
            <TableCell>{user.group || "-"}</TableCell>

            <TableCell className="space-x-2 text-right">
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleEdit(user._id)}
              >
                Edit
              </Button>

              <Button
                size="sm"
                variant="destructive"
                onClick={() => handleDelete(user._id)}
              >
                Delete
              </Button>
            </TableCell>
          </TableRow>
        ))}

        {users.length === 0 && (
          <TableRow>
            <TableCell colSpan={6} className="text-center">
              No users found.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
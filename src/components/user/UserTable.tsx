import { useEffect, useState } from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { getUsers } from "@/services/user.service";

interface User {
  _id: string;
  name: string;
  email: string;
  ID: string;
  role: string;
  group: string;
}

interface UserTableProps {
  organizationId?: string;
}

interface Pagination {
  page: number;
  limit: number;
  totalUsers: number;
  totalPages: number;
}

export default function UserTable({
  organizationId,
}: UserTableProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);

  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 10,
    totalUsers: 0,
    totalPages: 1,
  });

  useEffect(() => {
    setCurrentPage(1);
  }, [organizationId]);

  useEffect(() => {
    fetchUsers();
  }, [organizationId, currentPage]);

  const fetchUsers = async () => {
    try {
      setLoading(true);

      const response = await getUsers({
        page: currentPage,
        limit: 10,
        organizationId,
      });

      if (response.success) {
        setUsers(response.users);

        setPagination({
          page: response.pagination.page,
          limit: response.pagination.limit,
          totalUsers: response.pagination.totalUsers,
          totalPages: response.pagination.totalPages,
        });
      }
    } catch (error) {
      console.error("Failed to fetch users:", error);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < pagination.totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-10">
        Loading users...
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Employee ID</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Group</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {users.map((user) => (
              <TableRow key={user._id}>
                <TableCell className="font-medium">
                  {user.name}
                </TableCell>

                <TableCell>
                  {user.email}
                </TableCell>

                <TableCell>
                  {user.ID || "-"}
                </TableCell>

                <TableCell className="capitalize">
                  {user.role}
                </TableCell>

                <TableCell>
                  {user.group || "-"}
                </TableCell>
              </TableRow>
            ))}

            {users.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="h-24 text-center"
                >
                  No users found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Page {pagination.page} of {pagination.totalPages}
        </p>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handlePrevious}
            disabled={currentPage === 1 || loading}
            className="rounded-md border px-4 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50"
          >
            Previous
          </button>

          <button
            type="button"
            onClick={handleNext}
            disabled={
              currentPage === pagination.totalPages || loading
            }
            className="rounded-md border px-4 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
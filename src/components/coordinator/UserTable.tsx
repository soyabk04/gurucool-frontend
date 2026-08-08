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

interface Pagination {
  page: number;
  limit: number;
  totalUsers: number;
  totalPages: number;
}

export default function UserTable({
  selected,
  onChange,
}: UserTableProps) {
  const [users, setUsers] = useState<GroupUser[]>([]);
  const [loading, setLoading] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);

  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 10,
    totalUsers: 0,
    totalPages: 1,
  });

  useEffect(() => {
    loadUsers();
  }, [currentPage]);

  const loadUsers = async () => {
    try {
      setLoading(true);

      const data = await getUsers({
        page: currentPage,
        limit: 10,
      });

      console.log(data);

      if (data.success) {
        setUsers(data.users);

        setPagination({
          page: data.pagination.page,
          limit: data.pagination.limit,
          totalUsers: data.pagination.totalUsers,
          totalPages: data.pagination.totalPages,
        });
      }
    } catch (error) {
      console.error("Failed to load users:", error);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const toggleUser = (id: string) => {
    if (selected.includes(id)) {
      onChange(
        selected.filter((userId) => userId !== id)
      );
    } else {
      onChange([...selected, id]);
    }
  };

  // Select/deselect only users on the CURRENT page
  const toggleAll = () => {
    const currentPageIds = users.map((user) => user._id);

    const allSelected = currentPageIds.every((id) =>
      selected.includes(id)
    );

    if (allSelected) {
      // Remove current page users from selection
      onChange(
        selected.filter(
          (id) => !currentPageIds.includes(id)
        )
      );
    } else {
      // Add current page users
      const newSelected = [
        ...selected,
        ...currentPageIds.filter(
          (id) => !selected.includes(id)
        ),
      ];

      onChange(newSelected);
    }
  };

  const allCurrentPageSelected =
    users.length > 0 &&
    users.every((user) =>
      selected.includes(user._id)
    );

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

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">
                <Checkbox
                  checked={allCurrentPageSelected}
                  onCheckedChange={toggleAll}
                  disabled={
                    loading || users.length === 0
                  }
                />
              </TableHead>

              <TableHead>Name</TableHead>

              <TableHead>Email</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell
                  colSpan={3}
                  className="h-24 text-center"
                >
                  Loading users...
                </TableCell>
              </TableRow>
            ) : users.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={3}
                  className="h-24 text-center"
                >
                  No users found.
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow key={user._id}>
                  <TableCell>
                    <Checkbox
                      checked={selected.includes(
                        user._id
                      )}
                      onCheckedChange={() =>
                        toggleUser(user._id)
                      }
                    />
                  </TableCell>

                  <TableCell className="font-medium">
                    {user.name}
                  </TableCell>

                  <TableCell>
                    {user.email}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Page {pagination.page} of{" "}
          {pagination.totalPages}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handlePrevious}
            disabled={
              currentPage === 1 || loading
            }
            className="rounded-md border px-4 py-2 text-sm transition hover:bg-muted disabled:pointer-events-none disabled:opacity-50"
          >
            Previous
          </button>

          <button
            type="button"
            onClick={handleNext}
            disabled={
              currentPage === pagination.totalPages ||
              loading
            }
            className="rounded-md border px-4 py-2 text-sm transition hover:bg-muted disabled:pointer-events-none disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>

      {/* Selected count */}
      <div className="text-sm text-muted-foreground">
        {selected.length} user
        {selected.length !== 1 ? "s" : ""} selected
      </div>
    </div>
  );
}
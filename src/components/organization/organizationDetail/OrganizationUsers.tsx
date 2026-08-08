import { useEffect, useState } from "react";
import {
  Search,
  UserPlus,
  MoreHorizontal,
  Shield,
  Users,
} from "lucide-react";

import {
  Avatar,
  AvatarFallback,
} from "@/components/ui/avatar";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { getUsers } from "@/services/user.service";
import type { User } from "@/types/user";

interface Props {
  organizationId: string;
}

interface Pagination {
  page: number;
  limit: number;
  totalUsers: number;
  totalPages: number;
}

export default function OrganizationUsers({
  organizationId,
}: Props) {
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState("");

  const [currentPage, setCurrentPage] = useState(1);

  const [loading, setLoading] = useState(false);

  const [pagination, setPagination] =
    useState<Pagination>({
      page: 1,
      limit: 10,
      totalUsers: 0,
      totalPages: 1,
    });

  /*
   * Reset page when organization changes
   */
  useEffect(() => {
    setCurrentPage(1);
  }, [organizationId]);

  /*
   * Fetch users
   */
  useEffect(() => {
    fetchUsers();
  }, [organizationId, currentPage]);

  const fetchUsers = async () => {
    try {
      setLoading(true);

      const response = await getUsers({
        organizationId,
        page: currentPage,
        limit: 10,
      });

      if (response.success) {
        setUsers(response.users);

        if (response.pagination) {
          setPagination({
            page: response.pagination.page,
            limit: response.pagination.limit,
            totalUsers: response.pagination.totalUsers,
            totalPages: response.pagination.totalPages,
          });
        }
      } else {
        setUsers([]);
      }
    } catch (error) {
      console.error(
        "Failed to fetch organization users:",
        error
      );

      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  /*
   * Search users on the current page
   */
  const filteredUsers = users.filter((user) => {
    const searchValue = search.toLowerCase().trim();

    if (!searchValue) {
      return true;
    }

    return (
      user.name
        ?.toLowerCase()
        .includes(searchValue) ||
      user.email
        ?.toLowerCase()
        .includes(searchValue) ||
      user.ID
        ?.toLowerCase()
        .includes(searchValue) ||
      user.role
        ?.toLowerCase()
        .includes(searchValue)
    );
  });

  /*
   * Pagination
   */
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

  /*
   * Optional actions
   */
  const handleViewProfile = (user: User) => {
    console.log("View profile:", user);
  };

  const handleEditUser = (user: User) => {
    console.log("Edit user:", user);
  };

  const handleDeleteUser = (user: User) => {
    console.log("Delete user:", user);
  };

  return (
    <Card className="border-none shadow-none">
      {/* ================= HEADER ================= */}

      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-xl font-semibold">
            Organization Users
          </h2>

          <p className="text-sm text-muted-foreground">
            Manage all users in this organization.
          </p>
        </div>

        <Button>
          <UserPlus className="mr-2 h-4 w-4" />
          Add User
        </Button>
      </div>

      {/* ================= SEARCH ================= */}

      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

          <Input
            className="pl-9"
            placeholder="Search users..."
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
          />
        </div>

        <p className="text-sm text-muted-foreground">
          {pagination.totalUsers} users
        </p>
      </div>

      {/* ================= TABLE ================= */}

      <div className="overflow-hidden rounded-xl border">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/40">
              <tr className="border-b">
                <th className="p-4 text-left text-sm font-medium">
                  User
                </th>

                <th className="p-4 text-left text-sm font-medium">
                  Email
                </th>

                <th className="p-4 text-left text-sm font-medium">
                  ID
                </th>

                <th className="p-4 text-left text-sm font-medium">
                  Role
                </th>

                <th className="p-4 text-left text-sm font-medium">
                  Status
                </th>

                <th className="w-[60px] p-4" />
              </tr>
            </thead>

            <tbody>
              {/* Loading */}

              {loading && (
                <tr>
                  <td
                    colSpan={6}
                    className="h-32 text-center text-sm text-muted-foreground"
                  >
                    Loading users...
                  </td>
                </tr>
              )}

              {/* Users */}

              {!loading &&
                filteredUsers.length > 0 &&
                filteredUsers.map((user) => (
                  <tr
                    key={user._id}
                    className="border-b last:border-b-0 transition-colors hover:bg-muted/30"
                  >
                    {/* User */}

                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarFallback>
                            {user.name
                              ?.charAt(0)
                              .toUpperCase() || "U"}
                          </AvatarFallback>
                        </Avatar>

                        <div className="min-w-0">
                          <p className="truncate font-medium">
                            {user.name}
                          </p>

                          <p className="truncate text-xs text-muted-foreground">
                            {user.organizationName ||
                              "Organization User"}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Email */}

                    <td className="p-4 text-sm">
                      {user.email}
                    </td>

                    {/* ID */}

                    <td className="p-4 text-sm">
                      {user.ID || "-"}
                    </td>

                    {/* Role */}

                    <td className="p-4">
                      <Badge
                        variant="default"
                        className="capitalize"
                      >
                        <Shield className="mr-1 h-3 w-3" />

                        {user.role}
                      </Badge>
                    </td>

                    {/* Status */}

                    <td className="p-4">
                      {user.active ? (
                        <Badge variant="default">
                          Active
                        </Badge>
                      ) : (
                        <Badge variant="outline">
                          Pending
                        </Badge>
                      )}
                    </td>

                    {/* Actions */}

                    <td className="p-4">
                      <DropdownMenu>
                        <DropdownMenuTrigger>
                          <Button
                            variant="ghost"
                            size="icon"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() =>
                              handleViewProfile(user)
                            }
                          >
                            View Profile
                          </DropdownMenuItem>

                          <DropdownMenuItem
                            onClick={() =>
                              handleEditUser(user)
                            }
                          >
                            Edit User
                          </DropdownMenuItem>

                          <DropdownMenuItem
                            className="text-red-600 focus:text-red-600"
                            onClick={() =>
                              handleDeleteUser(user)
                            }
                          >
                            Delete User
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}

              {/* Empty */}

              {!loading &&
                filteredUsers.length === 0 && (
                  <tr>
                    <td
                      colSpan={6}
                      className="h-48"
                    >
                      <div className="flex flex-col items-center justify-center text-center">
                        <Users className="mb-3 h-10 w-10 text-muted-foreground" />

                        <h3 className="font-semibold">
                          No users found
                        </h3>

                        <p className="mt-1 text-sm text-muted-foreground">
                          {search
                            ? "Try another search."
                            : "No users have been added to this organization yet."}
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ================= PAGINATION ================= */}

      {pagination.totalPages > 0 && (
        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-muted-foreground">
            Page {pagination.page} of{" "}
            {pagination.totalPages}
          </p>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrevious}
              disabled={
                currentPage === 1 || loading
              }
            >
              Previous
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={handleNext}
              disabled={
                currentPage >=
                  pagination.totalPages ||
                loading
              }
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
}
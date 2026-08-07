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

export default function OrganizationUsers({
  organizationId,
}: Props) {
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      const res = await getUsers(organizationId);
      setUsers(res.users);
    };

    fetchUsers();
  }, [organizationId]);

  const filtered = users.filter((user) => {
    return (
      user.name
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      user.email
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  });

  return (
    <Card className="rounded-2xl p-6">
      {/* Header */}

      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-xl font-semibold">
            Organization Users
          </h2>

          <p className="text-muted-foreground">
            Manage all users in this organization.
          </p>
        </div>

        <Button>
          <UserPlus className="mr-2 h-4 w-4" />
          Add User
        </Button>
      </div>

      {/* Search */}

      <div className="relative mb-6 max-w-md">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />

        <Input
          className="pl-9"
          placeholder="Search users..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
        />
      </div>

      {/* Table */}

      <div className="overflow-hidden rounded-xl border">
        <table className="w-full">
          <thead className="bg-muted/40">
            <tr>
              <th className="p-4 text-left">
                User
              </th>

              <th>Email</th>

              <th>ID</th>

              <th>Role</th>

              <th>Status</th>

              <th />
            </tr>
          </thead>

          <tbody>
            {filtered.map((user) => (
              <tr
                key={user._id}
                className="border-t transition hover:bg-muted/30"
              >
                <td className="p-5">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback>
                        {user.name
                          ?.charAt(0)
                          .toUpperCase()}
                      </AvatarFallback>
                    </Avatar>

                    <div>
                      <p className="font-medium align-center">
                        {user.name}
                      </p>

                      <p className="text-xs text-muted-foreground">
                        {user.organizationName}
                      </p>
                    </div>
                  </div>
                </td>

                <td>{user.email}</td>

                <td>{user.ID}</td>

                <td>
                  <Badge variant="default">
                    <Shield className="mr-1 h-3 w-5" />
                    {user.role}
                  </Badge>
                </td>

                <td>
                  {user.active ? (
                    <Badge>
                      Active
                    </Badge>
                  ) : (
                    <Badge variant="outline">
                      Pending
                    </Badge>
                  )}
                </td>

                <td>
                  <DropdownMenu>
                    <DropdownMenuTrigger >
                      <Button
                        variant="ghost"
                        size="icon"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        View Profile
                      </DropdownMenuItem>

                      <DropdownMenuItem>
                        Edit User
                      </DropdownMenuItem>

                      <DropdownMenuItem className="text-red-600">
                        Delete User
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {!filtered.length && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Users className="mb-3 h-12 w-12 text-muted-foreground" />

            <h3 className="font-semibold">
              No users found
            </h3>

            <p className="text-sm text-muted-foreground">
              Try another search or add a new user.
            </p>
          </div>
        )}
      </div>
    </Card>
  );
}
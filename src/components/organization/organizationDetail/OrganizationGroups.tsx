import { useEffect, useState } from "react";
import {
  Search,
  Plus,
  Users,
  MoreHorizontal,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { getGroups } from "@/services/group.service";

interface Props {
  organizationId: string;
}

interface Group {
  _id: string;
  name: string;
  coordinator: string;
  totalUsers: number;
}

export default function OrganizationGroups({
  organizationId,
}: Props) {
  const [groups, setGroups] = useState<Group[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchGroups = async () => {
      const res = await getGroups(organizationId);
      console.log(res.res.data);
      setGroups(res.res.data);
    };

    fetchGroups();
  }, [organizationId]);

  const filtered = groups.filter((group) =>
    group.name
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <Card className="rounded-2xl">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Groups</CardTitle>

          <p className="text-sm text-muted-foreground">
            Manage organization groups.
          </p>
        </div>

        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Create Group
        </Button>
      </CardHeader>

      <CardContent>
        <div className="relative mb-6 max-w-sm">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />

          <Input
            className="pl-9"
            placeholder="Search groups..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />
        </div>

        <div className="overflow-hidden rounded-xl border">
          <table className="w-full">
            <thead className="bg-muted/40">
              <tr>
                <th className="p-4 text-left">
                  Group
                </th>

                <th>Coordinator</th>

                <th>Total Users</th>

                <th>Status</th>

                <th />
              </tr>
            </thead>

            <tbody>
              {filtered.map((group) => (
                <tr
                  key={group._id}
                  className="border-t hover:bg-muted/40"
                >
                  <td className="p-4 font-medium">
                    {group.name}
                  </td>

                  <td>{group.coordinator}</td>

                  <td>{group.totalUsers}</td>

                  <td>
                    <Badge>
                      Active
                    </Badge>
                  </td>

                  <td>
                    <DropdownMenu>
                      <DropdownMenuTrigger >
                        <Button
                          size="icon"
                          variant="ghost"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>

                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          View
                        </DropdownMenuItem>

                        <DropdownMenuItem>
                          Edit
                        </DropdownMenuItem>

                        <DropdownMenuItem className="text-red-600">
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {!filtered.length && (
            <div className="flex flex-col items-center justify-center py-16">
              <Users className="mb-3 h-12 w-12 text-muted-foreground" />

              <h3 className="font-semibold">
                No groups found
              </h3>

              <p className="text-muted-foreground">
                Create your first group.
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
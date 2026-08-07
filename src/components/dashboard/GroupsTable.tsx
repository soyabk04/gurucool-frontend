import { Eye, MoreHorizontal, Users } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Group {
  _id: string;
  name: string;
  coordinator: string;
  students: number;
  progress: number;
  completion: number;
}

interface GroupsTableProps {
  groups: Group[];
}

export function GroupsTable({
  groups,
}: GroupsTableProps) {
  return (
    <Card className="rounded-2xl">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Groups</CardTitle>

          <CardDescription>
            Learning groups inside your organization
          </CardDescription>
        </div>

        <Button variant="outline">
          <Users className="mr-2 h-4 w-4" />
          View All
        </Button>
      </CardHeader>

      <CardContent>
        {groups.length === 0 ? (
          <div className="py-10 text-center text-sm text-muted-foreground">
            No groups found.
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Group</TableHead>
                <TableHead>Coordinator</TableHead>
                <TableHead className="text-center">
                  Students
                </TableHead>
                <TableHead className="w-[220px]">
                  Progress
                </TableHead>
                <TableHead className="text-center">
                  Completion
                </TableHead>
                <TableHead className="w-12" />
              </TableRow>
            </TableHeader>

            <TableBody>
              {groups.map((group) => (
                <TableRow key={group._id}>
                  <TableCell className="font-medium">
                    {group.name}
                  </TableCell>

                  <TableCell>
                    {group.coordinator}
                  </TableCell>

                  <TableCell className="text-center">
                    {group.students}
                  </TableCell>

                  <TableCell>
                    <div className="space-y-2">
                      <Progress value={group.progress} />

                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>{group.progress}%</span>
                      </div>
                    </div>
                  </TableCell>

                  <TableCell className="text-center font-medium">
                    {group.completion}%
                  </TableCell>

                  <TableCell>
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
                          <Eye className="mr-2 h-4 w-4" />
                          View Group
                        </DropdownMenuItem>

                        <DropdownMenuItem>
                          Manage Students
                        </DropdownMenuItem>

                        <DropdownMenuItem>
                          Assign Course
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
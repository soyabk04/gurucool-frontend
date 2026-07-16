import { Users, UserRound, Hash } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export interface Group {
  _id: string;
  name: string;
  groupCode: string;
  coordinator: string;
  totalUsers: number;
  status?: "Active" | "Inactive";
}

interface GroupCardProps {
  group: Group;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export default function GroupCard({
  group,
  onEdit,
  onDelete,
}: GroupCardProps) {
  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted">
            <Users className="h-6 w-6" />
          </div>

          <div>
            <CardTitle>{group.name}</CardTitle>
            <p className="text-sm text-muted-foreground">
              {group.groupCode}
            </p>
          </div>
        </div>

        {group.status && (
          <Badge
            variant={
              group.status === "Active"
                ? "default"
                : "secondary"
            }
          >
            {group.status}
          </Badge>
        )}
      </CardHeader>

      <CardContent className="space-y-3">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Hash className="h-4 w-4" />
          Group Code: {group.groupCode}
        </div>

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <UserRound className="h-4 w-4" />
          Coordinator: {group.coordinator}
        </div>

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Users className="h-4 w-4" />
          {group.totalUsers} Users
        </div>
      </CardContent>

      <CardFooter className="flex justify-end gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onEdit?.(group._id)}
        >
          Edit
        </Button>

        <Button
          variant="destructive"
          size="sm"
          onClick={() => onDelete?.(group._id)}
        >
          Delete
        </Button>
      </CardFooter>
    </Card>
  );
}
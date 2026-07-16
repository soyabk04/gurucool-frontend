import { Mail, Users, BadgeCheck, User } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export interface UserData {
  _id: string;
  name: string;
  email: string;
  ID: string;
  role: "admin" | "coordinator" | "user";
  group?: string;
}

interface UserCardProps {
  user: UserData;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export default function UserCard({
  user,
  onEdit,
  onDelete,
}: UserCardProps) {
  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted">
            <User className="h-6 w-6" />
          </div>

          <div>
            <CardTitle>{user.name}</CardTitle>

            <p className="text-sm text-muted-foreground">
              {user.email}
            </p>
          </div>
        </div>

        <Badge
          variant={
            user.role === "admin"
              ? "default"
              : user.role === "coordinator"
              ? "secondary"
              : "outline"
          }
          className="capitalize"
        >
          {user.role}
        </Badge>
      </CardHeader>

      <CardContent className="space-y-3">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <BadgeCheck className="h-4 w-4" />
          Employee ID: {user.ID}
        </div>

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Mail className="h-4 w-4" />
          {user.email}
        </div>

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Users className="h-4 w-4" />
          Group: {user.group || "Not Assigned"}
        </div>
      </CardContent>

      <CardFooter className="flex justify-end gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onEdit?.(user._id)}
        >
          Edit
        </Button>

        <Button
          variant="destructive"
          size="sm"
          onClick={() => onDelete?.(user._id)}
        >
          Delete
        </Button>
      </CardFooter>
    </Card>
  );
}
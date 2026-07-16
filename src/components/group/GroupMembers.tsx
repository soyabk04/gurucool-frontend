import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import { Trash2 } from "lucide-react";

export interface GroupMember {
  _id: string;
  name: string;
  email: string;
  role: string;
  avatarUrl?: string;
}

type Props = {
  members: GroupMember[];
  onRemove?: (id: string) => void;
};

export default function GroupMembers({
  members,
  onRemove,
}: Props) {
  if (members.length === 0) {
    return (
      <Card>
        <CardContent className="py-10 text-center text-muted-foreground">
          No members in this group.
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          Members ({members.length})
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {members.map((member) => (
          <div
            key={member._id}
            className="flex items-center justify-between rounded-lg border p-3"
          >
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarImage src={member.avatarUrl} />
                <AvatarFallback>
                  {member.name
                    .split(" ")
                    .map((word) => word[0])
                    .join("")
                    .toUpperCase()}
                </AvatarFallback>
              </Avatar>

              <div>
                <p className="font-medium">{member.name}</p>
                <p className="text-sm text-muted-foreground">
                  {member.email}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Badge variant="secondary">
                {member.role}
              </Badge>

              <Button
                variant="destructive"
                size="icon"
                onClick={() => onRemove?.(member._id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
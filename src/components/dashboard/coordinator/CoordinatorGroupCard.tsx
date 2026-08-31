import { Users } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface Props {
  group: {
    id: string;
    name: string;
    groupCode?: string;
  };
}

export function CoordinatorGroupCard({ group }: Props) {
  return (
    <Card className="rounded-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5 text-primary" />
          Your Group
        </CardTitle>

        <CardDescription>
          Group currently assigned to you
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className="rounded-xl border bg-muted/30 p-4">
          <p className="text-lg font-semibold">
            {group.name}
          </p>

          {group.groupCode && (
            <p className="mt-1 text-sm text-muted-foreground">
              Group Code: {group.groupCode}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
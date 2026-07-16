import { Building2, Globe, Users } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export interface Organization {
  id: string;
  name: string;
  domain: string;
  users: number;
  status: "Active" | "Inactive";
}

interface OrganizationCardProps {
  organization: Organization;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export default function OrganizationCard({
  organization,
  onEdit,
  onDelete,
}: OrganizationCardProps) {
  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted">
            <Building2 className="h-6 w-6" />
          </div>

          <div>
            <CardTitle>{organization.name}</CardTitle>
            <p className="text-sm text-muted-foreground">
              {organization.domain}
            </p>
          </div>
        </div>

        <Badge
          variant={
            organization.status === "Active"
              ? "default"
              : "secondary"
          }
        >
          {organization.status}
        </Badge>
      </CardHeader>

      <CardContent className="space-y-3">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Globe className="h-4 w-4" />
          {organization.domain}
        </div>

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Users className="h-4 w-4" />
          {organization.users} Users
        </div>
      </CardContent>

      <CardFooter className="flex justify-end gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onEdit?.(organization.id)}
        >
          Edit
        </Button>

        <Button
          variant="destructive"
          size="sm"
          onClick={() => onDelete?.(organization.id)}
        >
          Delete
        </Button>
      </CardFooter>
    </Card>
  );
}
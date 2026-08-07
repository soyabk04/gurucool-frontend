import {
  Building2,
  Globe,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Props {
  register: any;
  errors: any;
  domain: string;
  loading?: boolean;
}

export function OrganizationInfoCard({
  register,
  errors,
  domain,
  loading,
}: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building2 className="h-5 w-5" />
          General Information
        </CardTitle>

        <CardDescription>
          Update your organization information.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="name">
            Organization Name
          </Label>

          <Input
            id="name"
            disabled={loading}
            {...register("name")}
          />

          {errors.name && (
            <p className="text-sm text-destructive">
              {errors.name.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            Domain
          </Label>

          <Input
            value={domain}
            disabled
          />

          <p className="text-xs text-muted-foreground">
            Domain cannot be changed.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
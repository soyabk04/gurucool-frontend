import {
 
  Globe,
  Palette,
  Building2,
  Shield,
  CheckCircle2,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

import type { OrganizationDetails } from "@/types/organization";

interface OrganizationOverviewProps {
  organization: OrganizationDetails;
}

export default function OrganizationOverview({
  organization,
}: OrganizationOverviewProps) {
  const InfoItem = ({
    icon: Icon,
    label,
    value,
  }: {
    icon: any;
    label: string;
    value: React.ReactNode;
  }) => (
    <div className="flex items-start gap-4 rounded-xl border bg-background/40 p-4 transition-all hover:shadow-md">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
        <Icon className="h-5 w-5" />
      </div>

      <div className="flex-1">
        <p className="text-xs uppercase tracking-wide text-muted-foreground">
          {label}
        </p>

        <div className="mt-1 text-base font-semibold">
          {value}
        </div>
      </div>
    </div>
  );

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {/* Left Side */}
      <div className="space-y-6 lg:col-span-2">
        <Card className="rounded-2xl shadow-lg">
          <CardHeader>
            <CardTitle>General Information</CardTitle>
          </CardHeader>

          <CardContent className="grid gap-4 md:grid-cols-2">
            <InfoItem
              icon={Building2}
              label="Organization Name"
              value={organization.name}
            />

            <InfoItem
              icon={Globe}
              label="Domain"
              value={organization.domain}
            />

          </CardContent>
        </Card>

        <Card className="rounded-2xl shadow-lg">
          <CardHeader>
            <CardTitle>Brand Identity</CardTitle>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <InfoItem
                icon={Palette}
                label="Primary Color"
                value={
                  <div className="flex items-center gap-3">
                    <div
                      className="h-6 w-6 rounded-full border"
                      style={{
                        background: organization.primaryColor,
                      }}
                    />

                    {organization.primaryColor}
                  </div>
                }
              />

              <InfoItem
                icon={Palette}
                label="Secondary Color"
                value={
                  <div className="flex items-center gap-3">
                    <div
                      className="h-6 w-6 rounded-full border"
                      style={{
                        background: organization.secondaryColor,
                      }}
                    />

                    {organization.secondaryColor}
                  </div>
                }
              />
            </div>

            <Separator />

            <div className="rounded-xl border p-5">
              <p className="mb-4 text-sm font-medium text-muted-foreground">
                Brand Preview
              </p>

              <div
                className="flex h-40 items-center justify-center rounded-2xl text-2xl font-bold text-white"
                style={{
                  background: `linear-gradient(
                    135deg,
                    ${organization.primaryColor},
                    ${organization.secondaryColor}
                  )`,
                }}
              >
                {organization.name}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Right Side */}
      <div className="space-y-6">
        <Card className="rounded-2xl shadow-lg">
          <CardHeader>
            <CardTitle>Status</CardTitle>
          </CardHeader>

          <CardContent>
            <Badge
              className="w-full justify-center py-2 text-base"
              variant={
                organization.status === "Active"
                  ? "default"
                  : "secondary"
              }
            >
              <CheckCircle2 className="mr-2 h-4 w-4" />
              {organization.status}
            </Badge>
          </CardContent>
        </Card>

        <Card className="rounded-2xl shadow-lg">
          <CardHeader>
            <CardTitle>Quick Summary</CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">
                Users
              </span>

              <span className="font-semibold">
                {organization.stats.overview.users}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">
                Groups
              </span>

              <span className="font-semibold">
                {organization.stats.overview.groups}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">
                Courses
              </span>

              <span className="font-semibold">
                {organization.stats.overview.courses}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">
                Coordinators
              </span>

              <span className="font-semibold">
                {organization.stats.overview.coordinators}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl shadow-lg">
          <CardHeader>
            <CardTitle>Administrator</CardTitle>
          </CardHeader>

          <CardContent className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
              <Shield className="h-6 w-6 text-primary" />
            </div>

            <div>
              <p className="font-semibold">
                Organization Admin
              </p>

              <p className="text-sm text-muted-foreground">
                Administrator information will appear here.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
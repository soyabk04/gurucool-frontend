import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import {
  Tabs,
  TabsPanel,
} from "@/components/ui/tabs";

import OrganizationHero from "../components/organization/organizationDetail/OrganizationHero";
import OrganizationStats from "../components/organization/organizationDetail/OrganizationStats";
import OrganizationTabs from "../components/organization/organizationDetail/OrganizationTabs";
import OrganizationOverview from "../components/organization/organizationDetail/OrganizationOverview";
import OrganizationUsers from "../components/organization/organizationDetail/OrganizationUsers";
import OrganizationGroups from "../components/organization/organizationDetail/OrganizationGroups";
import OrganizationCourses from "../components/organization/organizationDetail/OrganizationCourses";
import OrganizationSettings from "../components/organization/organizationDetail/OrganizationSettings";
import OrganizationAnalytics from "../components/organization/organizationDetail/OrganizationAnalytics";

import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { getOrgById } from "@/services/organization.service";
import type { OrganizationDetails } from "@/types/organization";

export default function OrganizationDetailsPage() {
  const { id } = useParams<{ id: string }>();

  const [organization, setOrganization] =
    useState<OrganizationDetails | null>(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;

    const fetchOrganization = async () => {
      try {
        setLoading(true);

        const res = await getOrgById(id);
      
        setOrganization(res);
      } catch (err: any) {
        setError(
          err?.response?.data?.message ??
            "Failed to load organization."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchOrganization();
  }, [id]);

  if (loading) {
    return (
      <div className="container mx-auto space-y-6 py-8">
        <Skeleton className="h-64 rounded-3xl" />
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  if (error || !organization) {
    return (
      <div className="container mx-auto py-10">
        <Card>
          <CardContent className="py-16 text-center">
            {error || "Organization not found"}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto space-y-8 py-8">
      <OrganizationHero
        organization={organization}
      />

      <OrganizationStats
        stats={organization.stats}
      />

      <Tabs defaultValue="overview">
        <OrganizationTabs />

        <TabsPanel value="overview">
          <OrganizationOverview
            organization={organization}
          />
        </TabsPanel>

        <TabsPanel value="users">
          <OrganizationUsers
            organizationId={organization._id}
          />
        </TabsPanel>

        <TabsPanel value="groups">
          <OrganizationGroups
            organizationId={organization._id}
          />
        </TabsPanel>

        <TabsPanel value="courses">
          <OrganizationCourses
            organizationId={organization._id}
          />
        </TabsPanel>

        <TabsPanel value="analytics">
          <OrganizationAnalytics
            analytics={organization?.stats}
          />
        </TabsPanel>

        <TabsPanel value="settings">
          <OrganizationSettings
            organization={organization}
          />
        </TabsPanel>
      </Tabs>
    </div>
  );
}
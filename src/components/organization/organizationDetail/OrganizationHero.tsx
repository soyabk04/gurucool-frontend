import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Building2,
  
  Globe,
  Pencil,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import type { OrganizationDetails } from "@/types/organization";

interface OrganizationHeroProps {
  organization: OrganizationDetails;
  onEdit?: () => void;
}

function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0].toUpperCase())
    .join("");
}

export default function OrganizationHero({
  organization,
  onEdit,
}: OrganizationHeroProps) {

  return (
    <section
      className="relative overflow-hidden rounded-3xl border shadow-xl"
      style={{
        background: `linear-gradient(135deg,
          ${organization?.primaryColor},
          ${organization?.secondaryColor})`,
      }}
    >
      {/* Decorative Background */}
      <div className="absolute inset-0">
        <div className="absolute -left-16 top-0 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -right-20 bottom-0 h-80 w-80 rounded-full bg-white/10 blur-3xl" />
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.12),transparent_40%)]" />
      </div>

      {/* Glass Overlay */}
      <div className="relative rounded-3xl bg-black/10 backdrop-blur-md">
        <div className="flex flex-col gap-8 p-8 lg:flex-row lg:items-center lg:justify-between">
          {/* Left */}
          <div className="space-y-8">
            <Link
              to="/organization"
              className="inline-flex items-center gap-2 text-sm font-medium text-white/80 transition hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Organizations
            </Link>

            <div className="flex items-center gap-6">
              <Avatar className="h-24 w-24 rounded-2xl border-4 border-white/20 shadow-lg">
                <AvatarImage
                  src={organization.logoUrl}
                  alt={organization.name}
                />

                <AvatarFallback className="rounded-2xl bg-white/20 text-3xl font-bold text-white">
                  {organization.name ? (
                    initials(organization.name)
                  ) : (
                    <Building2 className="h-10 w-10" />
                  )}
                </AvatarFallback>
              </Avatar>

              <div className="space-y-3">
                <h1 className="text-4xl font-bold tracking-tight text-white">
                  {organization.name}
                </h1>

                <div className="flex flex-wrap items-center gap-4 text-white/80">
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4" />
                    {organization.domain}
                  </div>

                  <Badge
                    className={
                      organization.status === "Active"
                        ? "bg-emerald-500 hover:bg-emerald-500"
                        : "bg-orange-500 hover:bg-orange-500"
                    }
                  >
                    {organization.status}
                  </Badge>
                </div>


              </div>
            </div>
          </div>

          {/* Right */}
          <div className="flex flex-col items-start gap-4 lg:items-end">
            <Button
              size="lg"
              onClick={onEdit}
              className="rounded-xl bg-white text-black shadow-lg hover:bg-white/90"
            >
              <Pencil className="mr-2 h-4 w-4" />
              Edit Organization
            </Button>

            <div className="rounded-2xl border border-white/20 bg-white/10 px-6 py-4 backdrop-blur-xl">
              <p className="text-sm text-white/70">
                Organization Status
              </p>

              <h2 className="mt-1 text-2xl font-semibold text-white">
                {organization.status}
              </h2>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
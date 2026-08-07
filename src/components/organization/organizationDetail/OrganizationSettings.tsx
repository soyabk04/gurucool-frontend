import { useEffect, useState } from "react";
import {
  Save,
  Building2,
  Globe,
  Palette,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { toast } from "sonner";

import { editOrganization } from "@/services/organization.service";
import type { OrganizationDetails } from "@/types/organization";

interface Props {
  organization: OrganizationDetails;
}

export default function OrganizationSettings({
  organization,
}: Props) {
  const [loading, setLoading] = useState(false);

  const [logo, setLogo] = useState<File | null>(null);

  const [form, setForm] = useState({
    name: organization.name,
    domain: organization.domain,
    primaryColor: organization.primaryColor,
    secondaryColor: organization.secondaryColor,
  });

  useEffect(() => {
    setForm({
      name: organization.name,
      domain: organization.domain,
      primaryColor: organization.primaryColor,
      secondaryColor: organization.secondaryColor,
    });
  }, [organization]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);

      await editOrganization(
        organization._id,
        form,
        logo ?? undefined
      );

      toast.success(
        "Organization updated successfully"
      );
    } catch (err: any) {
      toast.error(
        err.response?.data?.message ??
          "Failed to update organization"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid gap-6 xl:grid-cols-3">
      {/* Left */}

      <div className="xl:col-span-2">
        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle>
              Organization Settings
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-6">
            <div>
              <Label>Name</Label>

              <Input
                name="name"
                value={form.name}
                onChange={handleChange}
              />
            </div>

            <div>
              <Label>Domain</Label>

              <Input
                name="domain"
                value={form.domain}
                onChange={handleChange}
              />
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <Label>Primary Color</Label>

                <Input
                  type="color"
                  name="primaryColor"
                  value={form.primaryColor}
                  onChange={handleChange}
                />
              </div>

              <div>
                <Label>Secondary Color</Label>

                <Input
                  type="color"
                  name="secondaryColor"
                  value={form.secondaryColor}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <Label>Organization Logo</Label>

              <Input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  setLogo(e.target.files?.[0] ?? null)
                }
              />
            </div>

            <Button
              className="w-full"
              onClick={handleSubmit}
              disabled={loading}
            >
              <Save className="mr-2 h-4 w-4" />

              {loading
                ? "Saving..."
                : "Save Changes"}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Right */}

      <div className="space-y-6">
        <Card className="overflow-hidden rounded-2xl">
          <div
            className="flex h-48 items-center justify-center"
            style={{
              background: `linear-gradient(
                  135deg,
                  ${form.primaryColor},
                  ${form.secondaryColor}
              )`,
            }}
          >
            {logo ? (
              <img
                src={URL.createObjectURL(logo)}
                className="h-28 w-28 rounded-2xl bg-white object-cover shadow-xl"
              />
            ) : (
              <img
                src={organization.logoUrl}
                className="h-28 w-28 rounded-2xl bg-white object-cover shadow-xl"
              />
            )}
          </div>

          <CardContent className="space-y-4 p-6">
            <h3 className="text-xl font-bold">
              {form.name}
            </h3>

            <div className="space-y-3 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Building2 className="h-4 w-4" />

                {form.name}
              </div>

              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4" />

                {form.domain}
              </div>

              <div className="flex items-center gap-2">
                <Palette className="h-4 w-4" />

                Theme Preview
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle>
              Branding Preview
            </CardTitle>
          </CardHeader>

          <CardContent>
            <div
              className="flex h-40 items-center justify-center rounded-2xl text-2xl font-bold text-white shadow-lg"
              style={{
                background: `linear-gradient(
                    135deg,
                    ${form.primaryColor},
                    ${form.secondaryColor}
                )`,
              }}
            >
              {form.name}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
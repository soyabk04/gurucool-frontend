import { useEffect, useRef, useState } from "react";
import { ImagePlus, Loader2, Save } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  editOrganization,
  getOrg,
} from "@/services/organization.service";

interface Organization {
  _id: string;
  name: string;
  domain: string;
  logoUrl?: string;
  primaryColor?: string;
  secondaryColor?: string;
}

interface OrganizationSettingsProps {
  organizationId: string;
}

export default function OrganizationSettings({
  organizationId,
}: OrganizationSettingsProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [organization, setOrganization] =
    useState<Organization | null>(null);

  const [name, setName] = useState("");
  const [domain, setDomain] = useState("");
  const [primaryColor, setPrimaryColor] = useState("#2563eb");
  const [secondaryColor, setSecondaryColor] = useState("#0f172a");

  const [logo, setLogo] = useState<File | undefined>();
  const [logoPreview, setLogoPreview] = useState<string>();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  organization
  // Fetch organization
  useEffect(() => {
    const fetchOrganization = async () => {
      try {
        setLoading(true);

        const response = await getOrg();

        const data = response.data;

        setOrganization(data);

        setName(data.name ?? "");
        setDomain(data.domain ?? "");
        setPrimaryColor(data.primaryColor ?? "#2563eb");
        setSecondaryColor(data.secondaryColor ?? "#0f172a");

        if (data.logoUrl) {
          setLogoPreview(data.logoUrl);
        }
      } catch (error) {
        console.error(error);
        toast.error("Failed to load organization");
      } finally {
        setLoading(false);
      }
    };

    fetchOrganization();
  }, [organizationId]);

  // Handle logo selection
  const handleLogoChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (!file) return;

    // Optional validation
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Logo must be smaller than 5MB");
      return;
    }

    setLogo(file);

    const previewUrl = URL.createObjectURL(file);
    setLogoPreview(previewUrl);
  };

  // Save organization
  const handleSave = async () => {
    try {
      setSaving(true);
      setUploadProgress(0);

      const data: Partial<Organization> = {
        name: name.trim(),
        domain: domain.trim().toLowerCase(),
        primaryColor,
        secondaryColor,
      };

      await editOrganization(
        organizationId,
        data,
        logo,
        (progress) => {
          setUploadProgress(progress);
        }
      );

      toast.success("Organization settings updated successfully");

      // Logo has now been uploaded
      setLogo(undefined);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to update organization");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-4xl space-y-6 p-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold">
          Organization Settings
        </h1>

        <p className="text-muted-foreground">
          Manage your organization's information and branding.
        </p>
      </div>

      {/* General Information */}
      <Card>
        <CardHeader>
          <CardTitle>General Information</CardTitle>

          <CardDescription>
            Update your organization's basic information.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="organization-name">
              Organization Name
            </Label>

            <Input
              id="organization-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter organization name"
              disabled={saving}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="organization-domain">
              Organization Domain
            </Label>

            <Input
              id="organization-domain"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              placeholder="example.com"
              disabled={saving}
            />

            <p className="text-sm text-muted-foreground">
              The domain associated with your organization.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Branding */}
      <Card>
        <CardHeader>
          <CardTitle>Branding</CardTitle>

          <CardDescription>
            Customize how your organization appears across the platform.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Logo */}
          <div className="space-y-3">
            <Label>Organization Logo</Label>

            <div className="flex items-center gap-5">
              <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-lg border bg-muted">
                {logoPreview ? (
                  <img
                    src={logoPreview}
                    alt="Organization logo"
                    className="h-full w-full object-contain"
                  />
                ) : (
                  <ImagePlus className="h-8 w-8 text-muted-foreground" />
                )}
              </div>

              <div className="space-y-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/webp,image/svg+xml"
                  className="hidden"
                  onChange={handleLogoChange}
                />

                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={saving}
                >
                  <ImagePlus className="mr-2 h-4 w-4" />
                  Choose Logo
                </Button>

                <p className="text-xs text-muted-foreground">
                  PNG, JPG, WEBP or SVG. Maximum 5MB.
                </p>
              </div>
            </div>
          </div>

          {/* Colors */}
          <div className="grid gap-5 sm:grid-cols-2">
            {/* Primary */}
            <div className="space-y-2">
              <Label htmlFor="primary-color">
                Primary Color
              </Label>

              <div className="flex gap-2">
                <Input
                  id="primary-color"
                  type="color"
                  value={primaryColor}
                  onChange={(e) =>
                    setPrimaryColor(e.target.value)
                  }
                  className="h-10 w-14 cursor-pointer p-1"
                  disabled={saving}
                />

                <Input
                  value={primaryColor}
                  onChange={(e) =>
                    setPrimaryColor(e.target.value)
                  }
                  placeholder="#2563eb"
                  disabled={saving}
                />
              </div>
            </div>

            {/* Secondary */}
            <div className="space-y-2">
              <Label htmlFor="secondary-color">
                Secondary Color
              </Label>

              <div className="flex gap-2">
                <Input
                  id="secondary-color"
                  type="color"
                  value={secondaryColor}
                  onChange={(e) =>
                    setSecondaryColor(e.target.value)
                  }
                  className="h-10 w-14 cursor-pointer p-1"
                  disabled={saving}
                />

                <Input
                  value={secondaryColor}
                  onChange={(e) =>
                    setSecondaryColor(e.target.value)
                  }
                  placeholder="#0f172a"
                  disabled={saving}
                />
              </div>
            </div>
          </div>

          {/* Preview */}
          <div className="space-y-2">
            <Label>Brand Preview</Label>

            <div
              className="rounded-lg border p-6"
              style={{
                backgroundColor: secondaryColor,
              }}
            >
              <div className="flex items-center gap-3">
                {logoPreview && (
                  <div className="h-10 w-10 overflow-hidden rounded-md bg-white">
                    <img
                      src={logoPreview}
                      alt=""
                      className="h-full w-full object-contain"
                    />
                  </div>
                )}

                <div>
                  <p className="font-semibold text-white">
                    {name || "Organization Name"}
                  </p>

                  <p className="text-sm text-white/70">
                    {domain || "example.com"}
                  </p>
                </div>

                <div className="ml-auto">
                  <div
                    className="rounded-md px-4 py-2 text-sm font-medium text-white"
                    style={{
                      backgroundColor: primaryColor,
                    }}
                  >
                    Primary Action
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Save */}
      <div className="flex justify-end">
        <Button
          onClick={handleSave}
          disabled={saving}
          className="min-w-[140px]"
        >
          {saving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {logo ? `Uploading ${uploadProgress}%` : "Saving..."}
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
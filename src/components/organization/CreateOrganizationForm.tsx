import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { createOrg } from "@/services/organization.service";

export default function CreateOrganization() {
  const [form, setForm] = useState({
    name: "",
    domain: "",
    primaryColor: "#2563eb",
    secondaryColor: "#ffffff",
    firstName: "",
    role: "",
    email: "",
    id: "",
  });

  const [logo, setLogo] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  loading
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleLogoChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (e.target.files?.length) {
      setLogo(e.target.files[0]);
    }
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);

      const formData = new FormData();

      formData.append(
        "organization",
        JSON.stringify({
          name: form.name,
          domain: form.domain,
          primaryColor: form.primaryColor,
          secondaryColor: form.secondaryColor,
          users: [
            {
              name: form.firstName,
              ID: form.id,
              email: form.email,
              role: "admin",
            },
          ],
        })
      );

      if (logo) {
        formData.append("logo", logo);
      }

      const response = await createOrg(formData);

      if (response.success) {

        // Optional: Reset form
        setForm({
          name: "",
          domain: "",
          primaryColor: "#2563eb",
          secondaryColor: "#ffffff",
          firstName: "",
          role: "",
          email: "",
          id: "",
        });

        setLogo(null);
      } else {
        console.error(response);
      }
    } catch (error) {
      console.error("Failed to create organization:", error);
    } finally {
      setLoading(false);
    }
  };
    return (
    <Card className="max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>Create Organization</CardTitle>
      </CardHeader>

            <CardContent className="space-y-8">
                <div>
                    <h3 className="mb-4 text-lg font-semibold">
                        Organization Details
                    </h3>

                    <div className="grid gap-4 md:grid-cols-2">
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

                        <div>
                            <Label htmlFor="logo">Organization Logo</Label>
                            {logo && (
                                <img
                                    src={URL.createObjectURL(logo)}
                                    alt="Logo Preview"
                                    className="mt-2 h-24 w-24 rounded-md border object-cover"
                                />
                            )}
                            <Input
                                id="logo"
                                type="file"
                                accept="image/*"
                                onChange={handleLogoChange}

                            />
                        </div>

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
                </div>

                <div>
                    <h3 className="mb-4 text-lg font-semibold">
                        Organization Admin
                    </h3>

                    <div className="grid gap-4 md:grid-cols-2">
                        <div>
                            <Label>First Name</Label>
                            <Input
                                name="firstName"
                                value={form.firstName}
                                onChange={handleChange}
                            />
                        </div>

                        <div>
                            <Label>Id</Label>
                            <Input
                                name="id"
                                value={form.id}
                                onChange={handleChange}
                            />
                        </div>

                        <div>
                            <Label>Email</Label>
                            <Input
                                type="email"
                                name="email"
                                value={form.email}
                                onChange={handleChange}
                            />
                        </div>

                    </div>
                </div>

                <Button onClick={handleSubmit} className="w-full">
                    Create Organization
                </Button>
            </CardContent>
        </Card>
    );
}
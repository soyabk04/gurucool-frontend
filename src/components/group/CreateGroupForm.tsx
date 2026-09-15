import { useState } from "react";
import {
  Users,
  UserRound,
  Hash,
  Mail,
  IdCard,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";

import { createGroup } from "@/services/group.service";

export default function CreateGroup() {
  const [form, setForm] = useState({
    groupName: "",
    groupCode: "",
    coordinatorName: "",
    coordinatorEmail: "",
    coordinatorId: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    if (!form.groupName.trim()) {
      toast.error("Group name is required");
      return;
    }

    if (!form.groupCode.trim()) {
      toast.error("Group code is required");
      return;
    }

    if (!form.coordinatorName.trim()) {
      toast.error("Coordinator name is required");
      return;
    }

    if (!form.coordinatorId.trim()) {
      toast.error("Coordinator ID is required");
      return;
    }

    if (!form.coordinatorEmail.trim()) {
      toast.error("Coordinator email is required");
      return;
    }

    try {
      setLoading(true);

      const data = {
        group: {
          name: form.groupName.trim(),
          groupCode: form.groupCode.trim(),
          users: [
            {
              name: form.coordinatorName.trim(),
              email: form.coordinatorEmail.trim(),
              ID: form.coordinatorId.trim(),
              role: "coordinator",
            },
          ],
        },
      };

      const response = await createGroup(data);
      // console.log(response)
      if (response.success) {
        toast.success(
          response.message || "Group created successfully"
        );

        setForm({
          groupName: "",
          groupCode: "",
          coordinatorName: "",
          coordinatorEmail: "",
          coordinatorId: "",
        });
      } else {
        toast.error(
          response.message || "Failed to create group"
        );
      }
    } catch (error: any) {
      console.error("Failed to create group:", error);

      toast.error(
        error?.response?.data?.message ||
          "Failed to create group"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-full bg-background">
      <div className="mx-auto max-w-5xl px-6 py-8">

        {/* ========================= */}
        {/* PAGE HEADER */}
        {/* ========================= */}

        <div className="mb-8">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10">
              <Users className="h-5 w-5 text-primary" />
            </div>

            <div>
              <h1 className="text-2xl font-semibold tracking-tight">
                Create Group
              </h1>

              <p className="mt-1 text-sm text-muted-foreground">
                Create a new group and assign its coordinator.
              </p>
            </div>
          </div>
        </div>

        {/* ========================= */}
        {/* GROUP DETAILS */}
        {/* ========================= */}

        <Card className="mb-6 overflow-hidden">
          <div className="border-b px-6 py-5">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                <Hash className="h-4 w-4 text-primary" />
              </div>

              <div>
                <h2 className="font-semibold">
                  Group Details
                </h2>

                <p className="text-sm text-muted-foreground">
                  Enter the basic information for the group.
                </p>
              </div>
            </div>
          </div>

          <CardContent className="p-6">
            <div className="grid gap-6 md:grid-cols-2">

              {/* Group Name */}
              <div className="space-y-2">
                <Label htmlFor="groupName">
                  Group Name
                </Label>

                <Input
                  id="groupName"
                  name="groupName"
                  value={form.groupName}
                  onChange={handleChange}
                  placeholder="Enter group name"
                  disabled={loading}
                />
              </div>

              {/* Group Code */}
              <div className="space-y-2">
                <Label htmlFor="groupCode">
                  Group Code
                </Label>

                <Input
                  id="groupCode"
                  name="groupCode"
                  value={form.groupCode}
                  onChange={handleChange}
                  placeholder="e.g. GRP-001"
                  disabled={loading}
                />

                <p className="text-xs text-muted-foreground">
                  A unique code used to identify the group.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ========================= */}
        {/* COORDINATOR DETAILS */}
        {/* ========================= */}

        <Card className="mb-6 overflow-hidden">
          <div className="border-b px-6 py-5">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                <UserRound className="h-4 w-4 text-primary" />
              </div>

              <div>
                <h2 className="font-semibold">
                  Coordinator Details
                </h2>

                <p className="text-sm text-muted-foreground">
                  Assign the coordinator responsible for this
                  group.
                </p>
              </div>
            </div>
          </div>

          <CardContent className="p-6">
            <div className="grid gap-6 md:grid-cols-2">

              {/* Name */}
              <div className="space-y-2">
                <Label htmlFor="coordinatorName">
                  Name
                </Label>

                <div className="relative">
                  <UserRound className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                  <Input
                    id="coordinatorName"
                    name="coordinatorName"
                    value={form.coordinatorName}
                    onChange={handleChange}
                    placeholder="John Doe"
                    disabled={loading}
                    className="pl-9"
                  />
                </div>
              </div>

              {/* Employee ID */}
              <div className="space-y-2">
                <Label htmlFor="coordinatorId">
                  Employee ID
                </Label>

                <div className="relative">
                  <IdCard className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                  <Input
                    id="coordinatorId"
                    name="coordinatorId"
                    value={form.coordinatorId}
                    onChange={handleChange}
                    placeholder="EMP001"
                    disabled={loading}
                    className="pl-9"
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="coordinatorEmail">
                  Email Address
                </Label>

                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                  <Input
                    id="coordinatorEmail"
                    type="email"
                    name="coordinatorEmail"
                    value={form.coordinatorEmail}
                    onChange={handleChange}
                    placeholder="coordinator@example.com"
                    disabled={loading}
                    className="pl-9"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ========================= */}
        {/* ACTIONS */}
        {/* ========================= */}

        <div className="flex items-center justify-end gap-3 border-t pt-6">
          <Button
            type="button"
            variant="outline"
            disabled={loading}
            onClick={() => window.history.back()}
          >
            Cancel
          </Button>

          <Button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            className="min-w-[150px]"
          >
            {loading ? "Creating..." : "Create Group"}
          </Button>
        </div>
      </div>
    </div>
  );
}
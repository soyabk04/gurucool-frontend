import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import {
  ArrowLeft,
  Loader2,
  Save,
  UserRound,
  Users,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  getGroup,
  updateGroupService,
} from "@/services/group.service";

type CoordinatorForm = {
  name: string;
  email: string;
  ID: string;
};

type GroupData = {
  _id?: string;
  groupCode?: string;
  name?: string;
  coordinator?: {
    _id?: string;
    name?: string;
    email?: string;
    ID?: string;
  } | null;
};

export default function UpdateGroup() {
  const { groupId } = useParams<{ groupId: string }>();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [groupData, setGroupData] = useState({
    groupCode: "",
    name: "",
  });

  const [coordinator, setCoordinator] =
    useState<CoordinatorForm>({
      name: "",
      email: "",
      ID: "",
    });

  useEffect(() => {
    if (!groupId) {
      toast.error("Group ID is missing");
      setLoading(false);
      return;
    }

    loadGroup();
  }, [groupId]);

  const loadGroup = async () => {
    if (!groupId) return;

    try {
      setLoading(true);

      const group = (await getGroup(groupId)) as GroupData;

      if (!group) {
        toast.error("Group not found");
        return;
      }

      setGroupData({
        groupCode: group.groupCode ?? "",
        name: group.name ?? "",
      });

      if (group.coordinator) {
        setCoordinator({
          name: group.coordinator.name ?? "",
          email: group.coordinator.email ?? "",
          ID: group.coordinator.ID ?? "",
        });
      }
    } catch (error: any) {
      console.error("Failed to load group:", error);

      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to load group"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGroupChange = (
    field: keyof typeof groupData,
    value: string
  ) => {
    setGroupData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleCoordinatorChange = (
    field: keyof CoordinatorForm,
    value: string
  ) => {
    setCoordinator((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (!groupId) {
      toast.error("Group ID is missing");
      return;
    }

    const groupCode = groupData.groupCode.trim();
    const groupName = groupData.name.trim();

    const coordinatorName = coordinator.name.trim();
    const coordinatorEmail = coordinator.email.trim();
    const coordinatorID = coordinator.ID.trim();

    if (!groupCode) {
      toast.error("Group code is required");
      return;
    }

    if (!groupName) {
      toast.error("Group name is required");
      return;
    }

    if (!coordinatorName) {
      toast.error("Coordinator name is required");
      return;
    }

    if (!coordinatorEmail) {
      toast.error("Coordinator email is required");
      return;
    }

    if (!coordinatorID) {
      toast.error("Coordinator ID is required");
      return;
    }

    try {
      setSaving(true);

      const result = await updateGroupService(
        groupId,
        {
          groupCode: groupCode.toUpperCase(),
          name: groupName,
        },
        [
          {
            name: coordinatorName,
            email: coordinatorEmail,
            ID: coordinatorID,
          } as any,
        ]
      );

      toast.success(
        result?.message ||
          "Group updated successfully"
      );

      navigate(-1);
    } catch (error: any) {
      console.error("Update group error:", error);

      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to update group"
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">

        {/* Header */}

        <div className="mb-8">
          <Button
            type="button"
            variant="ghost"
            onClick={() => navigate(-1)}
            className="-ml-2 mb-4"
            disabled={saving}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>

          <h1 className="text-2xl font-semibold tracking-tight">
            Update Group
          </h1>

          <p className="mt-1 text-sm text-muted-foreground">
            Update the group information and coordinator.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-6"
        >

          {/* Group Information */}

          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Users className="h-5 w-5" />
                </div>

                <div>
                  <CardTitle>
                    Group Information
                  </CardTitle>

                  <p className="mt-1 text-sm text-muted-foreground">
                    Update the basic group information.
                  </p>
                </div>
              </div>
            </CardHeader>

            <CardContent className="grid gap-5 sm:grid-cols-2">

              {/* Group Name */}

              <div className="space-y-2">
                <label
                  htmlFor="groupName"
                  className="text-sm font-medium"
                >
                  Group Name
                </label>

                <Input
                  id="groupName"
                  value={groupData.name}
                  onChange={(event) =>
                    handleGroupChange(
                      "name",
                      event.target.value
                    )
                  }
                  disabled={saving}
                  placeholder="Enter group name"
                />
              </div>

              {/* Group Code */}

              <div className="space-y-2">
                <label
                  htmlFor="groupCode"
                  className="text-sm font-medium"
                >
                  Group Code
                </label>

                <Input
                  id="groupCode"
                  value={groupData.groupCode}
                  onChange={(event) =>
                    handleGroupChange(
                      "groupCode",
                      event.target.value
                    )
                  }
                  disabled={saving}
                  placeholder="Enter group code"
                />

                <p className="text-xs text-muted-foreground">
                  The group code will be saved in uppercase.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Coordinator */}

          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <UserRound className="h-5 w-5" />
                </div>

                <div>
                  <CardTitle>
                    Coordinator
                  </CardTitle>

                  <p className="mt-1 text-sm text-muted-foreground">
                    Update the coordinator information.
                  </p>
                </div>
              </div>
            </CardHeader>

            <CardContent className="grid gap-5 sm:grid-cols-2">

              {/* Name */}

              <div className="space-y-2 sm:col-span-2">
                <label
                  htmlFor="coordinatorName"
                  className="text-sm font-medium"
                >
                  Full Name
                </label>

                <Input
                  id="coordinatorName"
                  value={coordinator.name}
                  onChange={(event) =>
                    handleCoordinatorChange(
                      "name",
                      event.target.value
                    )
                  }
                  disabled={saving}
                  placeholder="Enter coordinator name"
                />
              </div>

              {/* Email */}

              <div className="space-y-2">
                <label
                  htmlFor="coordinatorEmail"
                  className="text-sm font-medium"
                >
                  Email
                </label>

                <Input
                  id="coordinatorEmail"
                  type="email"
                  value={coordinator.email}
                  onChange={(event) =>
                    handleCoordinatorChange(
                      "email",
                      event.target.value
                    )
                  }
                  disabled={saving}
                  placeholder="coordinator@example.com"
                />
              </div>

              {/* ID */}

              <div className="space-y-2">
                <label
                  htmlFor="coordinatorID"
                  className="text-sm font-medium"
                >
                  Coordinator ID
                </label>

                <Input
                  id="coordinatorID"
                  value={coordinator.ID}
                  onChange={(event) =>
                    handleCoordinatorChange(
                      "ID",
                      event.target.value
                    )
                  }
                  disabled={saving}
                  placeholder="Enter coordinator ID"
                />
              </div>
            </CardContent>
          </Card>

          {/* Actions */}

          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate(-1)}
              disabled={saving}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={saving}
            >
              {saving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Update Group
                </>
              )}
            </Button>
          </div>

        </form>
      </div>
    </div>
  );
};

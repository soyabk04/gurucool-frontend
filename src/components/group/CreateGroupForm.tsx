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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const data = {
        group: {
          name: form.groupName,
          groupCode: form.groupCode,
          users: [{
            name: form.coordinatorName,
            email: form.coordinatorEmail,
            ID: form.coordinatorId,
            role:'coordinator'
          }],
        }
      }
      const response = await createGroup(data);

      if (response.success) {
        setForm({
          groupName: "",
          groupCode: "",
          coordinatorName: "",
          coordinatorEmail: "",
          coordinatorId: "",
        });

        console.log("Group created");
      }
    } catch (error) {
      console.error("Failed to create group:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Create Group</CardTitle>
      </CardHeader>
      <h3 className="mb-4 text-lg font-semibold">
        Group Details
      </h3>
      <CardContent className="space-y-8">
        <div className="flex flex-row gap-4">


          <div>
            <Label htmlFor="groupName">Group Name</Label>
            <Input
              id="groupName"
              name="groupName"
              value={form.groupName}
              onChange={handleChange}
              placeholder="Enter group name"
            />
          </div>
          <div>
            <Label htmlFor="groupName">Group Code</Label>
            <Input
              id="groupCode"
              name="groupCode"
              value={form.groupCode}
              onChange={handleChange}
              placeholder="Enter group Code"
            />
          </div>
        </div>

        <div>
          <h3 className="mb-4 text-lg font-semibold">
            Coordinator Details
          </h3>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label htmlFor="coordinatorName">Name</Label>
              <Input
                id="coordinatorName"
                name="coordinatorName"
                value={form.coordinatorName}
                onChange={handleChange}
              />
            </div>

            <div>
              <Label htmlFor="coordinatorId">Employee ID</Label>
              <Input
                id="coordinatorId"
                name="coordinatorId"
                value={form.coordinatorId}
                onChange={handleChange}
              />
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="coordinatorEmail">Email</Label>
              <Input
                id="coordinatorEmail"
                type="email"
                name="coordinatorEmail"
                value={form.coordinatorEmail}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        <Button
          className="w-full"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? "Creating..." : "Create Group"}
        </Button>
      </CardContent>
    </Card>
  );
}
import { Users, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import GroupTable from "@/components/group/GroupTable";

export default function GroupPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-full bg-background">
      <div className="mx-auto max-w-7xl px-6 py-8">

        {/* ========================= */}
        {/* PAGE HEADER */}
        {/* ========================= */}

        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10">
              <Users className="h-5 w-5 text-primary" />
            </div>

            <div>
              <h1 className="text-2xl font-semibold tracking-tight">
                Groups
              </h1>

              <p className="mt-1 text-sm text-muted-foreground">
                Manage groups in your organization.
              </p>
            </div>
          </div>

          <Button
            onClick={() => navigate("/group/create")}
            className="gap-2"
          >
            <Plus className="h-4 w-4" />
            Create Group
          </Button>
        </div>

        {/* ========================= */}
        {/* GROUP LIST */}
        {/* ========================= */}

        <Card className="overflow-hidden">
          <CardHeader className="border-b px-6 py-5">
            <div className="flex items-center justify-between gap-4">
              <div>
                <CardTitle className="text-lg">
                  Group List
                </CardTitle>

                <p className="mt-1 text-sm text-muted-foreground">
                  View and manage all groups in your organization.
                </p>
              </div>

              <div className="w-full max-w-xs">
                <Input
                  placeholder="Search groups..."
                />
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-0">
            <GroupTable />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
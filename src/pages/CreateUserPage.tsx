import { useCallback, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import UserEntryForm, {
  type PendingUser,
} from "@/components/user/UserEntryForm";

import CsvUpload from "@/components/user/CsvUpload";
import PendingUsersTable from "@/components/user/PendingUsersTable";
import CreatedUsersTable from "@/components/user/CreatedUsersTable";
import FailedUsersTable from "@/components/user/FailedUsersTable";

import { createUsers } from "@/services/user.service";
import { toast } from "sonner";

export interface FailedUser {
  user: PendingUser;
  error: string;
}

export default function CreateUserPage() {
  const [pendingUsers, setPendingUsers] = useState<PendingUser[]>([]);
  const [createdUsers, setCreatedUsers] = useState<PendingUser[]>([]);
  const [failedUsers, setFailedUsers] = useState<FailedUser[]>([]);
  const [loading, setLoading] = useState(false);

  /**
   * Normalize user input
   */
  const normalizeUser = (user: PendingUser): PendingUser => ({
    ...user,
    name: user.name?.trim() || "",
    email: user.email?.trim().toLowerCase() || "",
    ID: user.ID?.trim() || "",
    groupCode: user.groupCode?.trim().toUpperCase() || "",
  });

  /**
   * Add single user
   */
  const addUser = useCallback((user: PendingUser) => {
    const normalized = normalizeUser(user);

    if (!normalized.email || !normalized.ID) {
      toast.warning("Invalid user data");
      return;
    }

    setPendingUsers((prev) => {
      const exists = prev.some(
        (u) =>
          u.email === normalized.email ||
          u.ID === normalized.ID
      );

      if (exists) {
        toast.warning("User already exists in pending list.");
        return prev;
      }

      return [...prev, normalized];
    });
  }, []);

  /**
   * Add users from CSV
   */
  const addCsvUsers = useCallback((users: PendingUser[]) => {
    if (!users || users.length === 0) {
      toast.warning("No users received from CSV");
      return;
    }

    setPendingUsers((prev) => {
      const emailSet = new Set(prev.map((u) => u.email));
      const idSet = new Set(prev.map((u) => u.ID));

      const usersToAdd: PendingUser[] = [];

      for (const rawUser of users) {
        if (
          !rawUser?.email ||
          !rawUser?.ID ||
          !rawUser?.name ||
          !rawUser?.groupCode
        ) {
          toast.warning(`Skipping invalid row: ${rawUser}`);
          continue;
        }

        const user = normalizeUser(rawUser);

        if (
          emailSet.has(user.email) ||
          idSet.has(user.ID)
        ) {
          toast.warning(`Duplicate skipped: ${user.email}`);
          continue;
        }

        emailSet.add(user.email);
        idSet.add(user.ID);

        usersToAdd.push(user);
      }

      if (usersToAdd.length === 0) {
        toast.warning("No valid users added from CSV");
      }

      return [...prev, ...usersToAdd];
    });
  }, []);

  /**
   * Remove user
   */
  const removeUser = useCallback((index: number) => {
    setPendingUsers((prev) =>
      prev.filter((_, i) => i !== index)
    );
  }, []);

  /**
   * Create users API call
   */
  const handleCreateUsers = async () => {
    if (pendingUsers.length === 0) return;

    try {
      setLoading(true);
      setFailedUsers([]);

      const response = await createUsers(pendingUsers);

      if (!response?.success) {
        console.error("API failed:", response);
        toast.error(response?.data?.message)
        return;
      }

      const created = response?.user?.createdUsers || [];
      const failed = response?.user?.failedUsers || [];

      setCreatedUsers((prev) => [...prev, ...created]);
      setFailedUsers(failed);

      // Keep only failed users in pending
      setPendingUsers(failed.map((f: FailedUser) => f.user));
    } catch (error:any) {
      toast.error(error.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto space-y-6 p-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Create Users</h1>
        <p className="text-muted-foreground">
          Add users manually or upload a CSV file.
        </p>
      </div>

      {/* Manual Entry */}
      <Card>
        <CardHeader>
          <CardTitle>Add User</CardTitle>
        </CardHeader>
        <CardContent>
          <UserEntryForm onAdd={addUser} />
        </CardContent>
      </Card>

      {/* CSV Upload */}
      <Card>
        <CardHeader>
          <CardTitle>Upload CSV</CardTitle>
        </CardHeader>
        <CardContent>
          <CsvUpload onUpload={addCsvUsers} />
        </CardContent>
      </Card>

      {/* Pending Users */}
      <Card>
        <CardHeader>
          <CardTitle>
            Pending Users ({pendingUsers.length})
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <PendingUsersTable
            users={pendingUsers}
            onRemove={removeUser}
          />

          <div className="flex justify-end">
            <Button
              disabled={loading || pendingUsers.length === 0}
              onClick={handleCreateUsers}
            >
              {loading
                ? "Creating..."
                : `Create ${pendingUsers.length} User${
                    pendingUsers.length > 1 ? "s" : ""
                  }`}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Created Users */}
      {createdUsers.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>
              Successfully Created ({createdUsers.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CreatedUsersTable users={createdUsers} />
          </CardContent>
        </Card>
      )}

      {/* Failed Users */}
      {failedUsers.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>
              Failed Users ({failedUsers.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <FailedUsersTable users={failedUsers} />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
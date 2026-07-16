import { useCallback, useState } from "react";

import { AppSidebar } from "@/components/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

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

export interface FailedUser {
  user: PendingUser;
  error: string;
}

export default function CreateUserPage() {
  const [pendingUsers, setPendingUsers] = useState<PendingUser[]>([]);
  const [createdUsers, setCreatedUsers] = useState<PendingUser[]>([]);
  const [failedUsers, setFailedUsers] = useState<FailedUser[]>([]);
  const [loading, setLoading] = useState(false);

  const normalizeUser = (user: PendingUser): PendingUser => ({
    ...user,
    name: user.name.trim(),
    email: user.email.trim().toLowerCase(),
    ID: user.ID.trim(),
    groupCode: user.groupCode.trim().toUpperCase(),
  });

  /**
   * Add one user manually
   */
  const addUser = useCallback((user: PendingUser) => {
    const normalized = normalizeUser(user);

    setPendingUsers((prev) => {
      const exists = prev.some(
        (u) =>
          u.email === normalized.email ||
          u.ID === normalized.ID
      );

      if (exists) {
        alert("User already exists in pending list.");
        return prev;
      }

      return [...prev, normalized];
    });
  }, []);

  /**
   * Add users from CSV
   */
  const addCsvUsers = useCallback((users: PendingUser[]) => {
    setPendingUsers((prev) => {
      const emailSet = new Set(
        prev.map((u) => u.email)
      );

      const idSet = new Set(
        prev.map((u) => u.ID)
      );

      const usersToAdd: PendingUser[] = [];

      for (const rawUser of users) {
        if (
          !rawUser ||
          !rawUser.email ||
          !rawUser.ID ||
          !rawUser.name ||
          !rawUser.groupCode
        ) {
          continue;
        }

        const user = normalizeUser(rawUser);

        if (
          emailSet.has(user.email) ||
          idSet.has(user.ID)
        ) {
          console.warn(
            `Duplicate skipped: ${user.email}`
          );
          continue;
        }

        emailSet.add(user.email);
        idSet.add(user.ID);

        usersToAdd.push(user);
      }

      return [...prev, ...usersToAdd];
    });
  }, []);

  /**
   * Remove pending user
   */
  const removeUser = useCallback((index: number) => {
    setPendingUsers((prev) =>
      prev.filter((_, i) => i !== index)
    );
  }, []);

  /**
   * Create users
   */
  const handleCreateUsers = async () => {
    if (pendingUsers.length === 0) return;

    try {
      setLoading(true);
      setFailedUsers([]);

      const response = await createUsers(pendingUsers);

      if (!response.success) {
        return;
      }

      // Adjust this if your backend returns a different shape
      const created = response.user.createdUsers;
      const failed = response.user.failedUsers;

      setCreatedUsers((prev) => [
        ...prev,
        ...created,
      ]);

      setFailedUsers(failed);

      // Only failed users stay in the pending list
      setPendingUsers(
        failed.map((item: FailedUser) => item.user)
      );
    } catch (error) {
      console.error("Failed to create users:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SidebarProvider>
      <AppSidebar />

      <SidebarInset>
        <header className="flex h-16 items-center border-b px-4">
          <SidebarTrigger />
          <h1 className="ml-4 text-xl font-semibold">
            GuruCool
          </h1>
        </header>

        <main className="container mx-auto space-y-6 p-6">
          <div>
            <h1 className="text-3xl font-bold">
              Create Users
            </h1>

            <p className="text-muted-foreground">
              Add users manually or upload a CSV file.
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Add User</CardTitle>
            </CardHeader>

            <CardContent>
              <UserEntryForm onAdd={addUser} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Upload CSV</CardTitle>
            </CardHeader>

            <CardContent>
              <CsvUpload onUpload={addCsvUsers} />
            </CardContent>
          </Card>

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
                  disabled={
                    loading ||
                    pendingUsers.length === 0
                  }
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
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
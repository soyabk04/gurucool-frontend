import { useCallback, useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export type UserRole = "user" | "coordinator" | "admin";

export interface PendingUser {
  name: string;
  email: string;
  ID: string;
  role: UserRole;
  groupCode: string;
}

interface Props {
  onAdd: (user: PendingUser) => void;
}

const defaultForm: PendingUser = {
  name: "",
  email: "",
  ID: "",
  role: "user",
  groupCode: "",
};

export default function UserEntryForm({ onAdd }: Props) {
  const [form, setForm] = useState<PendingUser>(defaultForm);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;

      setForm((prev) => ({
        ...prev,
        [name]: value,
      }));
    },
    []
  );

  const handleRoleChange = useCallback((value: UserRole) => {
    setForm((prev) => ({
      ...prev,
      role: value,
    }));
  }, []);

  const isValid = useMemo(() => {
    return (
      form.name.trim() !== "" &&
      form.email.trim() !== "" &&
      form.ID.trim() !== "" &&
      form.groupCode.trim() !== ""
    );
  }, [form]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!isValid) return;

    onAdd({
      ...form,
      name: form.name.trim(),
      email: form.email.trim(),
      ID: form.ID.trim(),
      groupCode: form.groupCode.trim().toUpperCase(),
    });

    setForm(defaultForm);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>

          <Input
            id="name"
            name="name"
            placeholder="John Doe"
            value={form.name}
            onChange={handleChange}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>

          <Input
            id="email"
            type="email"
            name="email"
            placeholder="john@example.com"
            value={form.email}
            onChange={handleChange}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="ID">Employee ID</Label>

          <Input
            id="ID"
            name="ID"
            placeholder="EMP001"
            value={form.ID}
            onChange={handleChange}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="groupCode">Group Code</Label>

          <Input
            id="groupCode"
            name="groupCode"
            placeholder="ENG"
            value={form.groupCode}
            onChange={handleChange}
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label>Role</Label>

          <Select
            value={form.role}
            onValueChange={(value) => handleRoleChange(value as UserRole)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="user">User</SelectItem>
              <SelectItem value="coordinator">
                Coordinator
              </SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={!isValid}>
          Add User
        </Button>
      </div>
    </form>
  );
}
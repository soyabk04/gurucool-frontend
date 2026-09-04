import { useEffect, useState } from "react";

import {
  Table,
  TableHeader,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { getGroups ,deleteGroupService} from "@/services/group.service";

interface Group {
  _id: string;
  name: string;
  groupCode: string;
  coordinator: string;
  totalUsers: number;
}

export default function GroupTable() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
const deleteGroup = async (groupId: string) => {
  const confirmed = window.confirm(
    "Are you sure you want to delete this group? This action cannot be undone."
  );

  if (!confirmed) return;

  try {
    const response = await deleteGroupService(groupId);

    if (response.success) {
      toast.success(
        response.message || "Group deleted successfully"
      );

      setGroups((prev) =>
        prev.filter((group) => group._id !== groupId)
      );
    } else {
      toast.error(
        response.message || "Failed to delete group"
      );
    }
  } catch (error: any) {
    console.error("Error deleting group:", error);

    toast.error(
      error?.response?.data?.message ||
        error?.message ||
        "Failed to delete group"
    );
  }
};

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const response = await getGroups();
        console.log(response)
        if (response.success) {
          setGroups(response.data);
        }
      } catch (error:any) {
        alert(`Failed to fetch groups: ${error}`)
        console.error("Failed to fetch groups:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchGroups();
  }, []);

  if (loading) {
    return <p>Loading groups...</p>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Group Name</TableHead>
          <TableHead>Group Code</TableHead>
          <TableHead>Coordinator</TableHead>
          <TableHead>Users</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {groups.map((group) => (
          <TableRow key={group._id}>
            <TableCell>{group.name}</TableCell>
            <TableCell>{group.groupCode}</TableCell>
            <TableCell>{group.coordinator}</TableCell>
            <TableCell>{group.totalUsers}</TableCell>

            <TableCell className="text-right space-x-2">
              <Button size="sm" variant="outline"
              onClick={() => window.location.href = `/groups/${group._id}/edit`}>
                Edit
              </Button>

              <Button size="sm" variant="destructive"
              onClick={() => deleteGroup(group._id)}>
                Delete
              </Button>
            </TableCell>
          </TableRow>
        ))}

        {groups.length === 0 && (
          <TableRow>
            <TableCell colSpan={5} className="text-center">
              No groups found.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
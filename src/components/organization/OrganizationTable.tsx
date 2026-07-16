import { useEffect, useState } from "react";

import {
  Table,
  TableHeader,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
} from "@/components/ui/table";

import { Button } from "@/components/ui/button";
import { getOrg } from "@/services/organization.service";

interface Organization {
  _id: string;
  name: string;
  domain: string;
  totalUsers: number;
}

export default function OrganizationTable() {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrganizations = async () => {
      try {
        const response = await getOrg();

        if (response.success) {
          setOrganizations(response.res);
        }
      } catch (error) {
        console.error("Failed to fetch organizations:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrganizations();
  }, []);

  if (loading) {
    return <p>Loading organizations...</p>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Domain</TableHead>
          <TableHead>Users</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {organizations.map((org) => (
          <TableRow key={org._id}>
            <TableCell>{org.name}</TableCell>
            <TableCell>{org.domain}</TableCell>
            <TableCell>{org.totalUsers}</TableCell>

            <TableCell className="text-right space-x-2">
              <Button size="sm" variant="outline">
                Edit
              </Button>

              <Button size="sm" variant="destructive">
                Delete
              </Button>
            </TableCell>
          </TableRow>
        ))}

        {organizations.length === 0 && (
          <TableRow>
            <TableCell colSpan={4} className="text-center">
              No organizations found.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
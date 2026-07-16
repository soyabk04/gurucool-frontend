import { useEffect, useState } from "react";
import { toast } from "sonner";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Badge } from "@/components/ui/badge";

import { getGroupCourses } from "@/services/groupCourse.service";

interface GroupCourse {
  _id: string;
  groupId: {
    _id: string;
    name: string;
  };
  courseId: {
    _id: string;
    title: string;
  };
  status: "active" | "inactive";
  assignedAt: string;
}

export default function GroupCourseTable() {
  const [assignments, setAssignments] = useState<GroupCourse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAssignments();
  }, []);

  const fetchAssignments = async () => {
    try {
      setLoading(true);

      const res = await getGroupCourses();
    
      setAssignments(res.data);
    } catch (err) {
      toast.error("Failed to load assigned courses");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Assigned Courses</CardTitle>
      </CardHeader>

      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Group</TableHead>
              <TableHead>Course</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Assigned At</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center">
                  Loading...
                </TableCell>
              </TableRow>
            ) : assignments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center">
                  No course assignments found.
                </TableCell>
              </TableRow>
            ) : (
              assignments.map((assignment) => (
                <TableRow key={assignment._id}>
                  <TableCell>
                    {assignment.groupId.name}
                  </TableCell>

                  <TableCell>
                    {assignment.courseId.title}
                  </TableCell>

                  <TableCell>
                    <Badge
                      variant={
                        assignment.status === "active"
                          ? "default"
                          : "secondary"
                      }
                    >
                      {assignment.status}
                    </Badge>
                  </TableCell>

                  <TableCell>
                    {new Date(
                      assignment.assignedAt
                    ).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
import { useState } from "react";

import CourseSelect from "@/components/coordinator/CourseSelect";
import UserTable from "@/components/coordinator/UserTable";
import { Button } from "@/components/ui/button";
import { assignCourseToUsers } from "@/services/coordinator";
import AppLayout from "@/components/AppLayout";

export default function AssignCoursePage() {
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const handleAssign = async () => {
    if (!selectedCourse) {
      alert("Please select a course.");
      return;
    }

    if (selectedUsers.length === 0) {
      alert("Please select at least one user.");
      return;
    }

    try {
      setLoading(true);

      await assignCourseToUsers(
        selectedCourse,
        selectedUsers
      );

      alert("Course assigned successfully.");

      setSelectedUsers([]);
    } catch (error) {
      console.error(error);
      alert("Failed to assign course.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <CourseSelect
        value={selectedCourse}
        onChange={(value) => setSelectedCourse(value ?? "")}
      />

      <UserTable
        selected={selectedUsers}
        onChange={setSelectedUsers}
      />

      <Button
        disabled={
          loading ||
          !selectedCourse ||
          selectedUsers.length === 0
        }
        onClick={handleAssign}
      >
        {loading ? "Assigning..." : "Assign Course"}
      </Button>
    </div>
  );
}
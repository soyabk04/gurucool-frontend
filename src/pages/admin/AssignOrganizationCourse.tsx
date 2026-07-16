import AssignGroupForm from "@/components/assign-course-group/AssignGroupForm";
import GroupCourseTable from "@/components/assign-course-group/GroupTable";

export default function AssignGroupCourse() {
  return (
    <div className="container mx-auto space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Assign Course to Group
        </h1>

        <p className="text-muted-foreground">
          Assign courses to Groups. Group coordinator can then assign
          those courses to students.
        </p>
      </div>

      <AssignGroupForm />

      <GroupCourseTable />
    </div>
  );
}
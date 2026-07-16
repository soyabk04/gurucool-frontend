import AssignOrganizationForm from "@/components/assign-course/AssignOrganizationForm";
import OrganizationCourseTable from "@/components/assign-course/OrganizationTable";

export default function AssignOrganizationCourse() {
  return (
    <div className="container mx-auto space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Assign Course to Organization
        </h1>

        <p className="text-muted-foreground">
          Assign courses to organizations. Organization admins can then assign
          those courses to groups.
        </p>
      </div>

      <AssignOrganizationForm />

      <OrganizationCourseTable />
    </div>
  );
}
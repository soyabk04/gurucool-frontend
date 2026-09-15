import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
        import { Button } from "@/components/ui/button";
  import { useNavigate } from "react-router-dom";


import OrganizationTable from "@/components/organization/OrganizationTable";
// import CreateOrganizationDialog from "@/components/organization/CreateOrganizationDialog";

export default function OrganizationPage() {
   const navigate = useNavigate();
  return (
    <div className="container mx-auto space-y-6 py-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Organizations</h1>
          <p className="text-muted-foreground">
            Manage organizations in your platform.
          </p>
        </div>
        <Button onClick={()=>{navigate('/organization/create')}}>
          Create Organization
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Organization List</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <Input placeholder="Search organization..." />
          <OrganizationTable />
        </CardContent>
      </Card>
    </div>
  );
}

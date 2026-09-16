import { useState } from "react";
import CreateOrganizationForm from "@/components/organization/CreateOrganizationForm";
import { Button } from "@/components/ui/button";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";


export default function CreateOrganizationDialog() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>

      <DialogTrigger >

        <Button>
          Create Organization
        </Button>

      </DialogTrigger>

      <DialogContent>

        <DialogHeader>

          <DialogTitle>
            Create Organization
          </DialogTitle>

        </DialogHeader>

    <div className="container mx-auto py-8">
      <CreateOrganizationForm />
    </div>

      </DialogContent>

    </Dialog>
  );
}
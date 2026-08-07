import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { OrganizationInfoCard } from "../components/organization/setting/OrganizationInfoCard";
import { BrandingCard } from "../components/organization/setting/BrandingCard";
import { BrandPreview } from "../components/organization/setting/BrandPreview";
import { useTheme } from "@/context/ThemeContext";
import { getOrg, editOrganization } from "@/services/organization.service";
import { organizationSchema, type OrganizationForm } from "../schema/organizationSchema";

export default function OrganizationSettingsPage() {
  const { refreshTheme } = useTheme();
  const [loading,setLoading]=useState(true);
  const [saving,setSaving]=useState(false);
  const [organization,setOrganization]=useState<any>(null);
  const [logo,setLogo]=useState<File|null>(null);
  const [logoPreview,setLogoPreview]=useState("");
  const [uploadProgress,setUploadProgress]=useState(0);

  const {register,handleSubmit,watch,reset,formState:{errors}}=useForm<OrganizationForm>({
    resolver:zodResolver(organizationSchema),
    defaultValues:{name:"",primaryColor:"#2563eb",secondaryColor:"#ffffff"}
  });

  useEffect(()=>{fetchOrganization();},[]);

  async function fetchOrganization(){
    try{
      setLoading(true);
      const data=await getOrg();
      console.log(data.res.data)
      setOrganization(data.res.data);
      reset({
        name:data.name,
        primaryColor:data.primaryColor,
        secondaryColor:data.secondaryColor
      });
      setLogoPreview(data.logoUrl);
    }catch(err:any){
      toast.error("Failed to load organization.");
    }finally{
      setLoading(false);
    }
  }

  function handleLogoChange(file:File|null){
    if(!file) return;
    setLogo(file);
    setLogoPreview(URL.createObjectURL(file));
  }

  async function onSubmit(values:OrganizationForm){
    if(!organization?._id) return;
    try{
      setSaving(true);
      await editOrganization(
        organization._id,
        values,
        logo ?? undefined,
        setUploadProgress
      );
      await refreshTheme();
      toast.success("Organization updated successfully.");
      fetchOrganization();
    }catch{
      toast.error("Failed to update organization.");
    }finally{
      setSaving(false);
      setUploadProgress(0);
    }
  }

  if(loading){
    return <div className="flex h-[60vh] items-center justify-center">Loading...</div>;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="container mx-auto max-w-7xl space-y-8 p-6">
      <div>
        <h1 className="text-3xl font-bold">Organization Settings</h1>
        <p className="text-muted-foreground">Manage your organization profile and branding.</p>
      </div>

      <div className="grid gap-8 xl:grid-cols-3">
        <div className="space-y-8 xl:col-span-2">
          <OrganizationInfoCard
            register={register}
            errors={errors}
            loading={saving}
            domain={organization?.domain ?? ""}
          />

          <BrandingCard
            register={register}
            errors={errors}
            loading={saving}
            logoPreview={logoPreview}
            onLogoChange={handleLogoChange}
          />
        </div>

        <BrandPreview
          name={watch("name")}
          logo={logoPreview || organization?.logoUrl}
          primaryColor={watch("primaryColor")}
          secondaryColor={watch("secondaryColor")}
        />
      </div>

      {saving && <Progress value={uploadProgress} className="h-2" />}

      <div className="sticky bottom-0 flex justify-end border-t bg-background/90 p-4 backdrop-blur">
        <Button type="submit" size="lg" disabled={saving}>
          {saving ? `Uploading ${uploadProgress}%` : "Save Changes"}
        </Button>
      </div>
    </form>
  );
}
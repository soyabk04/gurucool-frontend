import { api } from "@/api/axios";
import type {CreateOraganization} from "@/types/organization";
export const createOrg = async (
  data: CreateOraganization,
  logo?: File,
  onProgress?: (progress: number) => void
) => {
  const formData = new FormData();

  formData.append("organization", JSON.stringify(data));

  if (logo) {
    formData.append("logo", logo);
  }

  const response = await api.post("/organization", formData, {
    onUploadProgress: (event) => {
      if (!onProgress) return;

      if (event.total) {
        const progress = Math.round(
          (event.loaded / event.total) * 100
        );
        onProgress(progress);
      }
    },
  });

  return response.data;
};

export const getOrg = async () => {
  const response = await api.get("/organization/org");
  return response.data;
};
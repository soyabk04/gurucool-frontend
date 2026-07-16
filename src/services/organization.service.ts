import { api } from "@/api/axios";

export const createOrg = async (data: any) => {
  const response = await api.post("/organization", data);
  return response.data;
};

export const getOrg = async () => {
  const response = await api.get("/organization/org");
  return response.data;
};
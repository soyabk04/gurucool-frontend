import { api } from "@/api/axios";

export const getGroups = async () => {
  const response = await api.get("/organization/groups");
  return response.data;
};

export const deleteGroup = async (id:any) => {
  const response = await api.delete("/organization/groups",id);
  return response.data;
};
export const updateGroup = async (id:any,data:any) => {
  const response = await api.patch("/organization/groups",id);
  return response.data;
};

export const createGroup = async (data:any) => {
  const response = await api.post("/organization/group",data);
  return response.data;
};
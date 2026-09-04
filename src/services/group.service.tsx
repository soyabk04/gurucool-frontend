import { api } from "@/api/axios";
import type { User } from "@/types/user";

export const getGroups = async (organizationId?: string) => {
  if (!organizationId) {
    const response = await api.get("/organization/groups");

    return response.data.res;
  } else {
    const response = await api.get(
      `/organization/groups/?organizationId=${organizationId}`
    );

    return response.data;
  }
};

export const getGroup = async (groupId: string) => {
  const response = await api.get(
    `/organization/groups/${groupId}`
  );

  return response.data.data;
};
export const deleteGroupService = async (
  groupId: string
) => {
  const response = await api.delete(
    `/organization/groups/${groupId}`
  );

  return response.data;
};

export const createGroupService = async (
  groupData: any,
  coordinator: User[]
) => {
  const response = await api.post(
    "/organization/groups",
    {
      groupData,
      coordinator,
    }
  );

  return response.data;
};

export const updateGroupService = async (
  groupId: string,
  groupData: any,
  coordinator?: User[]
) => {
  const response = await api.put(
    `/organization/groups/${groupId}`,
    {
      groupData,
      coordinator,
    }
  );

  return response.data;
};

export const updateGroup = async (
  groupId: string,
  groupData: any,
  coordinator?: User[]
) => {
  const response = await api.put(
    `/groups/${groupId}`,
    {
      groupData,
      coordinator,
    }
  );

  return response.data;
};

export const createGroup = async (data:any) => {
  const response = await api.post("/organization/group",data);
  return response.data.data;
};


import { api } from "@/api/axios";

export const getUsers = async (organizationId?: string) => {
  if (!organizationId) {
    const response = await api.get("/auth/getusers");
    return response.data;
  } else {
    const response = await api.get(`/auth/getusers/?organizationId=${organizationId}`);
    return response.data;
  }

};

export const createUsers = async (data:any[]) => {
  const response = await api.post("/auth/createuser",{users:data});
  return response.data;
};

export const uploadUserCsv = async (formData: FormData) => {
    const res = await api.post(
        "auth/csvparse",
        formData,
        {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        }
    );
    return res.data;
};

export const forgotPassword = async (data: { email: string }) => {
  const response = await api.post("/auth/send-reset-password-email", data);
  return response.data;
};

export interface ChangePasswordData {
  token: string;
  newpass: string;
}

export const changePassword = async ({
  token,
  newpass,
}: ChangePasswordData) => {
  const response = await api.post("/auth/change-password", {
    token,
    newpass,
  });

  return response.data;
};
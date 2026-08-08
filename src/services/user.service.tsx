import { api } from "@/api/axios";

export const getUsers = async ({
  organizationId,
  page = 1,
  limit = 10,
}: {
  organizationId?: string;
  page?: number;
  limit?: number;
}) => {
  const response = await api.get("/auth/getusers", {
    params: {
      page,
      limit,
      ...(organizationId && { organizationId }),
    },
  });

  return response.data;
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

interface ChangemyPasswordData {
  currentPassword: string;
  newPassword: string;
}

interface ChangePasswordResponse {
  success: boolean;
  message: string;
}

export const changemyPassword = async (
  data: ChangemyPasswordData
): Promise<ChangePasswordResponse> => {
  const response = await api.patch(
    "/auth/change-mypassword",
    data
  );

  return response.data;
};
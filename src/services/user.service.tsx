import { api } from "@/api/axios";

export const getUsers = async () => {
  const response = await api.get("/auth/getusers");
  console.log(response.data)
  return response.data;
};

export const createUsers = async (data:any) => {
  const response = await api.post("/auth/createuser",data);
  console.log(response.data)
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


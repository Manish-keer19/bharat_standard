import axiosInstance from "./axiosInstance";

export const authService = {
  login: async (data: any) => {
    const res = await axiosInstance.post("/auth/login", data);
    return res.data;
  },
  register: async (data: any) => {
    const res = await axiosInstance.post("/auth/register-admin", data);
    return res.data;
  },
};

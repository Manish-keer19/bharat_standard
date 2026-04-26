import axiosInstance from "./axiosInstance";

export const publicService = {
  getArticles: async (params?: any) => {
    const res = await axiosInstance.get("/public/articles", { params });
    return res.data;
  },
  getArticle: async (slug: string) => {
    const res = await axiosInstance.get(`/public/articles/${slug}`);
    return res.data;
  },
  getCategories: async () => {
    const res = await axiosInstance.get("/public/categories");
    return res.data;
  },
  getListicles: async () => {
    const res = await axiosInstance.get("/public/listicles");
    return res.data;
  },
  getListicle: async (id: string) => {
    const res = await axiosInstance.get(`/public/listicles/${id}`);
    return res.data;
  },
};

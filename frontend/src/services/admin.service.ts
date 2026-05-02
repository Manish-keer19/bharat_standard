import axiosInstance from "./axiosInstance";

export const adminService = {
  getStats: async () => {
    const res = await axiosInstance.get("/admin/stats");
    return res.data;
  },
  // Articles
  getArticles: async (params?: any) => {

    const res = await axiosInstance.get("/admin/articles", { params });
    return res.data;
  },
  getArticle: async (id: string) => {
    const res = await axiosInstance.get(`/admin/articles/${id}`);
    return res.data;
  },
  createArticle: async (data: any) => {
    const res = await axiosInstance.post("/admin/articles", data);
    return res.data;
  },
  updateArticle: async (id: string, data: any) => {
    const res = await axiosInstance.put(`/admin/articles/${id}`, data);
    return res.data;
  },
  deleteArticle: async (id: string) => {
    const res = await axiosInstance.delete(`/admin/articles/${id}`);
    return res.data;
  },

  // Categories
  getCategories: async () => {
    const res = await axiosInstance.get("/admin/categories");
    return res.data;
  },
  createCategory: async (data: any) => {
    const res = await axiosInstance.post("/admin/categories", data);
    return res.data;
  },
  updateCategory: async (id: string, data: any) => {
    const res = await axiosInstance.put(`/admin/categories/${id}`, data);
    return res.data;
  },
  deleteCategory: async (id: string) => {
    const res = await axiosInstance.delete(`/admin/categories/${id}`);
    return res.data;
  },
  bulkCreateCategories: async (data: { names?: string; categories?: any[] }) => {
    const res = await axiosInstance.post("/admin/categories/bulk", data);
    return res.data;
  },

  // Magazine
  getMagazine: async () => {
    const res = await axiosInstance.get("/admin/magazine");
    return res.data;
  },
  updateMagazine: async (data: any) => {
    const res = await axiosInstance.put("/admin/magazine", data);
    return res.data;
  },

  // Listicles
  getListicles: async (params?: any) => {
    const res = await axiosInstance.get("/admin/listicles", { params });
    return res.data;
  },
  getListicle: async (id: string) => {
    const res = await axiosInstance.get(`/admin/listicles/${id}`);
    return res.data;
  },
  createListicle: async (data: any) => {
    const res = await axiosInstance.post("/admin/listicles", data);
    return res.data;
  },
  updateListicle: async (id: string, data: any) => {
    const res = await axiosInstance.put(`/admin/listicles/${id}`, data);
    return res.data;
  },
  deleteListicle: async (id: string) => {
    const res = await axiosInstance.delete(`/admin/listicles/${id}`);
    return res.data;
  },
};

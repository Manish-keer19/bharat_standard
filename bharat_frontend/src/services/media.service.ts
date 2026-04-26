import axiosInstance from "./axiosInstance";

export const mediaService = {
  uploadImage: async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    const res = await axiosInstance.post("/media/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    if (res.data.success) {
      return res.data.data.url;
    }
    throw new Error(res.data.message || "Upload failed");
  },
  uploadImages: async (files: File[]) => {
    const formData = new FormData();
    files.forEach((file) => formData.append("files", file));
    const res = await axiosInstance.post("/media/upload-multiple", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    if (res.data.success) {
      return res.data.data.urls;
    }
    throw new Error(res.data.message || "Upload failed");
  },
};

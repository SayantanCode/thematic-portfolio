import { api } from "./clients";

export const mediaService = {
  upload: (file, folder) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", folder);
    return api.post("/media/upload", formData);
  },
  remove: (publicId) => api.delete(`/media/${encodeURIComponent(publicId)}`),
};

import { api, publicApi } from "./clients";

export const projectService = {
  listPublished: () => publicApi.get("/projects"),

  listAllAdmin: () => api.get("/projects/admin/all"),
  fetchByIdAdmin: (id) => api.get(`/projects/admin/${id}`),
  create: (data) => api.post("/projects", data),
  update: (id, data) => api.put(`/projects/${id}`, data),
  remove: (id) => api.delete(`/projects/${id}`),
};

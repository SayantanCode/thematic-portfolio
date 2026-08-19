import { api, publicApi } from "./clients";
import { getClientId } from "@/shared/utils/clientId.js";

export const postService = {
  // Public — published only.
  listPublished: () => publicApi.get("/posts"),
  // clientId lets the backend include whether this visitor already liked
  // the post in the same response, instead of a second round trip.
  fetchBySlug: (slug) => publicApi.get(`/posts/${slug}`, { params: { clientId: getClientId() } }),
  trackView: (slug) => publicApi.post(`/posts/${slug}/view`, { clientId: getClientId() }),
  toggleLike: (slug) => publicApi.post(`/posts/${slug}/like`, { clientId: getClientId() }),

  // Admin.
  listAllAdmin: () => api.get("/posts/admin/all"),
  fetchByIdAdmin: (id) => api.get(`/posts/admin/${id}`),
  create: (data) => api.post("/posts", data),
  update: (id, data) => api.put(`/posts/${id}`, data),
  remove: (id) => api.delete(`/posts/${id}`),
};

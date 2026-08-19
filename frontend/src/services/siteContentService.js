import { api, publicApi } from "./clients";

export const siteContentService = {
  fetchByKey: (key) => publicApi.get(`/site-content/${key}`),
  updateByKey: (key, data) => api.put(`/site-content/${key}`, { data }),
};

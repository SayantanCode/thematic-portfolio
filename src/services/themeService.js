import { publicApi } from "../clients";

export const themeService = {
  fetchTheme: (query) =>
    publicApi.get("/theme", {
      params: {
        query,
      },
    }),
  updateTheme: (theme) => publicApi.put("/theme", theme),
  deleteTheme: (themeId) => publicApi.delete(`/theme/${themeId}`),
  createTheme: (theme) => publicApi.post("/theme", theme),
};

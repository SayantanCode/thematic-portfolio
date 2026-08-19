import { themeService } from "../services/theme.service.js";
import { createThemeSchema, updateThemeSchema } from "../validators/theme.validator.js";

export const themeController = {
  // Raw array, not the usual {success,data,message} envelope — the existing
  // frontend (ThemeContext.jsx) does `fetchThemeApi.execute().then((customThemes)
  // => customThemes.map(...))`, calling .map directly on the resolved body.
  // Matching that contract exactly means zero changes to already-finished
  // frontend code, at the cost of this one endpoint being the odd one out.
  async list(req, res) {
    const themes = await themeService.listAll();
    res.json(themes);
  },

  async update(req, res) {
    const dto = updateThemeSchema.parse(req.body);
    const theme = await themeService.upsertDefault(dto.name, dto.variables);
    res.success(theme, "Theme updated");
  },

  async create(req, res) {
    const dto = createThemeSchema.parse(req.body);
    const theme = await themeService.create(dto.name, dto.config);
    res.created(theme, "Theme created");
  },

  async remove(req, res) {
    await themeService.remove(req.params.id);
    res.deleted(null, "Theme deleted");
  },
};

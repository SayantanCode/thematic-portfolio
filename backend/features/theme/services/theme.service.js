import { themeRepository } from "../repositories/theme.repository.js";
import { NotFoundError } from "../../../shared/errors/index.js";

// `id` (not `_id`) because ThemeSwitcher.jsx/ThemeContext.jsx were written
// against that shape before this backend existed — matching their existing
// contract instead of rewriting already-finished, polished frontend code.
const toApiShape = (doc) => ({
  id: String(doc._id),
  name: doc.name,
  config: doc.config,
});

export const themeService = {
  async listAll() {
    const themes = await themeRepository.findAll();
    return themes.map(toApiShape);
  },

  // No name yet from the current UI (see theme.validator.js) — defaults to
  // a single shared "custom" slot, consistent with this being a public,
  // unauthenticated, visitor-facing write (explicit product decision, not
  // an oversight: any visitor can save/overwrite the shared custom theme).
  async upsertDefault(name, variables) {
    const doc = await themeRepository.upsertByName(name || "custom", { variables });
    return toApiShape(doc);
  },

  async create(name, config) {
    const doc = await themeRepository.create({ name, config });
    return toApiShape(doc);
  },

  async remove(id) {
    const deleted = await themeRepository.deleteById(id);
    if (!deleted) throw new NotFoundError("Theme not found");
  },
};

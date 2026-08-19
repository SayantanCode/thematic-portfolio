import { siteContentRepository } from "../repositories/siteContent.repository.js";
import { NotFoundError } from "../../../shared/errors/index.js";

export const siteContentService = {
  async getByKey(key) {
    const doc = await siteContentRepository.findByKey(key);
    if (!doc) {
      // Not seeded yet — the frontend falls back to its own hardcoded
      // defaults on a 404, so this is a normal, expected state pre-migration.
      throw new NotFoundError(`No content saved yet for "${key}"`);
    }
    return doc.data;
  },

  async updateByKey(key, data) {
    const doc = await siteContentRepository.upsertByKey(key, data);
    return doc.data;
  },
};

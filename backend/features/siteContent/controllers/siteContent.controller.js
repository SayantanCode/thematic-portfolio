import { siteContentService } from "../services/siteContent.service.js";
import { siteContentKeySchema, updateSiteContentSchema } from "../validators/siteContent.validator.js";

export const siteContentController = {
  async getByKey(req, res) {
    const key = siteContentKeySchema.parse(req.params.key);
    const data = await siteContentService.getByKey(key);
    res.success(data, "Site content fetched");
  },

  async updateByKey(req, res) {
    const key = siteContentKeySchema.parse(req.params.key);
    const dto = updateSiteContentSchema.parse(req.body);
    const data = await siteContentService.updateByKey(key, dto.data);
    res.success(data, "Site content updated");
  },
};

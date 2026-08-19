import { BaseRepository } from "../../../shared/baseClasses/BaseRepository.js";
import { SiteContent } from "../models/siteContent.model.js";

class SiteContentRepository extends BaseRepository {
  constructor() {
    super(SiteContent);
  }

  findByKey(key) {
    return this.model.findOne({ key }).lean();
  }

  upsertByKey(key, data) {
    return this.model.findOneAndUpdate(
      { key },
      { $set: { data } },
      { upsert: true, new: true, runValidators: true }
    );
  }
}

export const siteContentRepository = new SiteContentRepository();

import { BaseRepository } from "../../../shared/baseClasses/BaseRepository.js";
import { Theme } from "../models/theme.model.js";

class ThemeRepository extends BaseRepository {
  constructor() {
    super(Theme);
  }

  findAll() {
    return this.model.find({}).lean();
  }

  upsertByName(name, config) {
    return this.model.findOneAndUpdate(
      { name },
      { $set: { config } },
      { upsert: true, new: true, runValidators: true }
    );
  }
}

export const themeRepository = new ThemeRepository();

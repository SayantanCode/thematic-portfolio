import { BaseRepository } from "../../../shared/baseClasses/BaseRepository.js";
import { PostInteraction } from "../models/postInteraction.model.js";

const DUPLICATE_KEY_ERROR_CODE = 11000;

class PostInteractionRepository extends BaseRepository {
  constructor() {
    super(PostInteraction);
  }

  // Returns true if this is a new (post, clientId, type) pair, false if it
  // already existed — the unique index is the source of truth, not a
  // separate exists() check first (avoids a race between the two).
  async record(post, clientId, type) {
    try {
      await this.model.create({ post, clientId, type });
      return true;
    } catch (err) {
      if (err.code === DUPLICATE_KEY_ERROR_CODE) return false;
      throw err;
    }
  }

  exists(post, clientId, type) {
    return this.model.exists({ post, clientId, type });
  }

  deleteOne(post, clientId, type) {
    return this.model.findOneAndDelete({ post, clientId, type });
  }
}

export const postInteractionRepository = new PostInteractionRepository();

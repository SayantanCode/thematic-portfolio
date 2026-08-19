import { BaseRepository } from "../../../shared/baseClasses/BaseRepository.js";
import { Post } from "../models/post.model.js";

class PostRepository extends BaseRepository {
  constructor() {
    super(Post);
  }

  findPublished() {
    return this.model.find({ published: true }).sort({ publishedAt: -1 }).lean();
  }

  findBySlugPublished(slug) {
    return this.model.findOne({ slug, published: true }).lean();
  }

  findAllAdmin() {
    return this.model.find({}).sort({ createdAt: -1 }).lean();
  }

  slugExists(slug, excludeId) {
    const filter = excludeId ? { slug, _id: { $ne: excludeId } } : { slug };
    return this.model.exists(filter);
  }

  incrementViews(id) {
    return this.model.findByIdAndUpdate(id, { $inc: { views: 1 } }, { new: true }).select("views").lean();
  }

  incrementLikes(id, delta) {
    return this.model.findByIdAndUpdate(id, { $inc: { likes: delta } }, { new: true }).select("likes").lean();
  }
}

export const postRepository = new PostRepository();

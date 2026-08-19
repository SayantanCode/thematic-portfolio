import { postRepository } from "../repositories/post.repository.js";
import { postInteractionRepository } from "../repositories/postInteraction.repository.js";
import { slugify } from "../../../shared/utils/slugify.js";
import { sanitizeBlogHtml } from "../../../shared/utils/sanitizeHtml.js";
import { NotFoundError } from "../../../shared/errors/index.js";

// Appends -2, -3, ... until free. excludeId lets an update keep its own slug.
async function uniqueSlug(baseSlug, excludeId) {
  let candidate = baseSlug;
  let suffix = 2;
  while (await postRepository.slugExists(candidate, excludeId)) {
    candidate = `${baseSlug}-${suffix}`;
    suffix += 1;
  }
  return candidate;
}

export const postService = {
  listPublished: () => postRepository.findPublished(),

  async getBySlugPublished(slug, clientId) {
    const post = await postRepository.findBySlugPublished(slug);
    if (!post) throw new NotFoundError("Post not found");
    const viewerHasLiked = clientId
      ? Boolean(await postInteractionRepository.exists(post._id, clientId, "like"))
      : false;
    return { ...post, viewerHasLiked };
  },

  // Counted once per (post, visitor) forever, not time-windowed — "views"
  // here means distinct visitors seen, not raw page loads.
  async trackView(slug, clientId) {
    const post = await postRepository.findBySlugPublished(slug);
    if (!post) throw new NotFoundError("Post not found");

    const isNewView = await postInteractionRepository.record(post._id, clientId, "view");
    if (!isNewView) return { views: post.views };

    const updated = await postRepository.incrementViews(post._id);
    return { views: updated.views };
  },

  // Atomic delete-first toggle: a successful delete means it was liked
  // before (now unliking); nothing to delete means it wasn't (now liking).
  // Single decision point instead of a separate exists-then-act pair, which
  // would leave a race window between the check and the write.
  async toggleLike(slug, clientId) {
    const post = await postRepository.findBySlugPublished(slug);
    if (!post) throw new NotFoundError("Post not found");

    const removed = await postInteractionRepository.deleteOne(post._id, clientId, "like");
    if (removed) {
      const updated = await postRepository.incrementLikes(post._id, -1);
      return { liked: false, likes: updated.likes };
    }

    await postInteractionRepository.record(post._id, clientId, "like");
    const updated = await postRepository.incrementLikes(post._id, 1);
    return { liked: true, likes: updated.likes };
  },

  listAllAdmin: () => postRepository.findAllAdmin(),

  async getByIdAdmin(id) {
    const post = await postRepository.findById(id, { lean: true });
    if (!post) throw new NotFoundError("Post not found");
    return post;
  },

  async create(dto) {
    const baseSlug = slugify(dto.slug || dto.title);
    const slug = await uniqueSlug(baseSlug);
    const publishedAt = dto.published ? new Date() : null;
    const content = sanitizeBlogHtml(dto.content);

    return postRepository.create({ ...dto, content, slug, publishedAt });
  },

  async update(id, dto) {
    const existing = await postRepository.findById(id, { lean: true });
    if (!existing) throw new NotFoundError("Post not found");

    const patch = { ...dto };
    if (dto.content !== undefined) patch.content = sanitizeBlogHtml(dto.content);

    if (dto.slug || dto.title) {
      const baseSlug = slugify(dto.slug || dto.title);
      patch.slug = await uniqueSlug(baseSlug, id);
    }

    // Only stamp publishedAt on the false -> true transition, and only if
    // it was never set before — see model comment.
    if (dto.published && !existing.published && !existing.publishedAt) {
      patch.publishedAt = new Date();
    }

    const updated = await postRepository.updateById(id, patch, { lean: true });
    if (!updated) throw new NotFoundError("Post not found");
    return updated;
  },

  async remove(id) {
    const deleted = await postRepository.deleteById(id);
    if (!deleted) throw new NotFoundError("Post not found");
  },
};

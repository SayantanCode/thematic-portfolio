import { postService } from "../services/post.service.js";
import { createPostSchema, updatePostSchema, clientIdSchema } from "../validators/post.validator.js";

export const postController = {
  async listPublished(req, res) {
    const posts = await postService.listPublished();
    res.success(posts, "Posts fetched");
  },

  async getBySlugPublished(req, res) {
    const post = await postService.getBySlugPublished(req.params.slug, req.query.clientId);
    res.success(post, "Post fetched");
  },

  async trackView(req, res) {
    const { clientId } = clientIdSchema.parse(req.body);
    const result = await postService.trackView(req.params.slug, clientId);
    res.success(result, "View recorded");
  },

  async toggleLike(req, res) {
    const { clientId } = clientIdSchema.parse(req.body);
    const result = await postService.toggleLike(req.params.slug, clientId);
    res.success(result, "Like toggled");
  },

  async listAllAdmin(req, res) {
    const posts = await postService.listAllAdmin();
    res.success(posts, "Posts fetched");
  },

  async getByIdAdmin(req, res) {
    const post = await postService.getByIdAdmin(req.params.id);
    res.success(post, "Post fetched");
  },

  async create(req, res) {
    const dto = createPostSchema.parse(req.body);
    const post = await postService.create(dto);
    res.created(post, "Post created");
  },

  async update(req, res) {
    const dto = updatePostSchema.parse(req.body);
    const post = await postService.update(req.params.id, dto);
    res.success(post, "Post updated");
  },

  async remove(req, res) {
    await postService.remove(req.params.id);
    res.deleted(null, "Post deleted");
  },
};

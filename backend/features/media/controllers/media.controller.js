import { mediaService } from "../services/media.service.js";
import { uploadFolderSchema } from "../validators/media.validator.js";
import { BadRequestError } from "../../../shared/errors/index.js";

export const mediaController = {
  async upload(req, res) {
    if (!req.file) throw new BadRequestError("No file provided");
    const { folder } = uploadFolderSchema.parse(req.body);
    const result = await mediaService.upload(req.file.buffer, folder);
    res.created(result, "Image uploaded");
  },

  async remove(req, res) {
    await mediaService.remove(req.params.publicId);
    res.deleted(null, "Image deleted");
  },
};

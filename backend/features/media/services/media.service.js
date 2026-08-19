import { cloudinary } from "../../../platform/cloudinary/cloudinary.js";

// Keeps this project's assets under one prefix, separated by use — folder
// value itself is a whitelisted enum (media.validator.js), never taken
// verbatim from the client, so this mapping is also the injection guard.
const FOLDER_PATHS = {
  projects: "thematic-portfolio/projects",
  blog: "thematic-portfolio/blog",
};

export const mediaService = {
  upload(buffer, folder) {
    return new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: FOLDER_PATHS[folder], resource_type: "image" },
        (err, result) => {
          if (err) return reject(err);
          resolve({ url: result.secure_url, publicId: result.public_id });
        }
      );
      stream.end(buffer);
    });
  },

  remove(publicId) {
    return cloudinary.uploader.destroy(publicId);
  },
};

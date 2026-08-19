import { v2 as cloudinary } from "cloudinary";
import { env } from "../../config/index.js";

// Configured once, here, and imported wherever an upload/destroy call is
// needed — same "single source of truth" reasoning as config/env.js.
cloudinary.config({
  cloud_name: env.cloudinary.cloudName,
  api_key: env.cloudinary.apiKey,
  api_secret: env.cloudinary.apiSecret,
  secure: true,
});

export { cloudinary };

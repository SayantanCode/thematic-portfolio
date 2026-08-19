import { Router } from "express";
import multer from "multer";
import { asyncHandler } from "express-unified-response";
import { requireAdmin } from "../../../platform/auth/requireAdmin.js";
import { mediaController } from "../controllers/media.controller.js";
import { BadRequestError } from "../../../shared/errors/index.js";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      return cb(new BadRequestError("Only image uploads are allowed"));
    }
    cb(null, true);
  },
});

// multer's own middleware calls next(err) directly rather than throwing —
// asyncHandler wouldn't catch that, so errors are normalized to our
// AppError shape here before handing off to the shared error middleware.
function handleUpload(req, res, next) {
  upload.single("file")(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      const message = err.code === "LIMIT_FILE_SIZE" ? "Image must be 5MB or smaller" : err.message;
      return next(new BadRequestError(message));
    }
    if (err) return next(err);
    next();
  });
}

const router = Router();

router.post("/upload", requireAdmin, handleUpload, asyncHandler(mediaController.upload));
router.delete("/:publicId", requireAdmin, asyncHandler(mediaController.remove));

export const mediaRoutes = router;

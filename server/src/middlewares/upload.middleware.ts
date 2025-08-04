// server/src/middlewares/upload.middleware.ts
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../utils/cloudinary";

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (_req, file) => ({
    folder: "event-platform",
    resource_type: "image",
    public_id: `${Date.now()}-${file.originalname}`,
  }),
});

export const upload = multer({ storage });

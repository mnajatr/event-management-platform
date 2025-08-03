import express from 'express';
import prisma from '../prisma';
import { upload } from '../middlewares/upload.middleware';
import { authMiddleware } from '../middlewares/auth.middleware';

const userRoutes = express.Router();

// Upload profile picture
userRoutes.post(
  '/upload-profile-picture',
  authMiddleware,
  upload.single('profilePicture'),
  async (req, res, next) => {
    try {
      const userId = req.user?.id;
      const filePath = `/uploads/${req.file?.filename}`;

      await prisma.user.update({
        where: { id: userId },
        data: { profilePicture: filePath },
      });

      res.status(200).json({
        success: true,
        message: 'Profile picture updated',
        data: { profilePicture: filePath },
      });
    } catch (err) {
      next(err);
    }
  }
);

export default userRoutes;

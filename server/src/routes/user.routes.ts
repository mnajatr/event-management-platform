// server/src/routes/user.routes.ts
import express from 'express';
import prisma from '../prisma';
import { upload } from '../middlewares/upload.middleware';
import { authMiddleware } from '../middlewares/auth.middleware';

const userRoutes = express.Router();

userRoutes.post(
  '/upload-profile-picture',
  authMiddleware,
  upload.single('profilePicture'),
  async (req, res, next) => {
    try {
      const userId = req.user?.id;
      const imageUrl = req.file?.path;

      await prisma.user.update({
        where: { id: userId },
        data: { profilePicture: imageUrl },
      });

      res.status(200).json({
        success: true,
        message: 'Profile picture updated',
        data: { profilePicture: imageUrl },
      });
    } catch (err) {
      next(err);
    }
  }
);


export default userRoutes;

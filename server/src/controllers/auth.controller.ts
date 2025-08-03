import { Request, Response, NextFunction } from "express";
import { AuthService } from "../services/auth.service";
import { AppError } from "../errors/app.error";

const authService = new AuthService();

export class AuthController {
  async register(request: Request, response: Response, next: NextFunction) {
    try {
      const { fullName, email, password, profilePicture, role, referralCode } =
        request.body;

      const result = await authService.registerUser({
        fullName,
        email,
        password,
        profilePicture,
        role,
        referralCode,
      });

      response.status(201).json({
        success: true,
        message: "User registered successfully",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async login(request: Request, response: Response, next: NextFunction) {
    try {
      const { email, password } = request.body;

      const result = await authService.loginUser({ email, password });

      response.status(200).json({
        success: true,
        message: "Login successful",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async getProfile(request: Request, response: Response, next: NextFunction) {
    try {
      if (!request.user) {
        throw new AppError("Please register first");
      }

      const user = await authService.getUserById(request.user.id);

      response.status(200).json({
        success: true,
        message: "Profile retrieved successfully",
        data: user,
      });
    } catch (error) {
      next(error);
    }
  }

  async requestPasswordReset(
    request: Request,
    response: Response,
    next: NextFunction
  ) {
    try {
      const { email } = request.body;

      await authService.requestPasswordReset(email);

      response.status(200).json({
        success: true,
        message: "Password reset email sent",
      });
    } catch (error) {
      next(error);
    }
  }

  async updatePassword(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) throw new AppError("Unauthorized", 401);

    const { currentPassword, newPassword } = req.body;
    await authService.updateUserPassword(req.user.id, currentPassword, newPassword);

    res.status(200).json({ success: true, message: "Password updated successfully" });
  } catch (err) {
    next(err);
  }
}

}

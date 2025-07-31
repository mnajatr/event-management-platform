import { Request, Response, NextFunction } from "express";
import { AuthService } from "../services/auth.service";
import { AppError } from "../errors/app.error";

const authService = new AuthService();

export class AuthController {
  // Register umum (tetap dipakai jika perlu)
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

  async registerCustomer(
    request: Request,
    response: Response,
    next: NextFunction
  ) {
    try {
      const { fullName, email, password, profilePicture, referralCode } =
        request.body;

      const result = await authService.registerUser({
        fullName,
        email,
        password,
        profilePicture,
        role: "CUSTOMER",
        referralCode,
      });

      response.status(201).json({
        success: true,
        message: "Customer registered successfully",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async registerOrganizer(
    request: Request,
    response: Response,
    next: NextFunction
  ) {
    try {
      const { fullName, email, password, profilePicture, referralCode } =
        request.body;

      const result = await authService.registerUser({
        fullName,
        email,
        password,
        profilePicture,
        role: "ORGANIZER",
        referralCode,
      });

      response.status(201).json({
        success: true,
        message: "Organizer registered successfully",
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
}

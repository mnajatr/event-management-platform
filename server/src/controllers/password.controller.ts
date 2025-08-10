import { Request, Response } from "express";
import bcrypt from "bcrypt";
import prisma from "../prisma";
import { sendEmail } from "../utils/email";
import {
  signResetToken,
  verifyResetToken,
  ResetJwtPayload,
} from "../utils/reset-jwt";

const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000";
const IS_DEV = process.env.NODE_ENV !== "production";

/** POST /auth/forgot-password */
export async function forgotPassword(req: Request, res: Response) {
  const { email: rawEmail } = req.body as { email?: string };
  if (!rawEmail) return res.status(400).json({ message: "Email is required" });

  const email = rawEmail.trim();
  const user = await prisma.user.findFirst({
    where: { email: { equals: email, mode: "insensitive" } },
  });

  if (!user)
    return res.json({ success: true, message: "Password reset email sent" });

  const token = signResetToken(user.id, user.password);
  const link = `${FRONTEND_URL}/auth/reset-password?token=${encodeURIComponent(token)}`;

  await sendEmail({
    to: user.email,
    subject: "Reset your password",
    html: `
      <div style="font-family:Arial,Helvetica,sans-serif">
        <h2>Password Reset</h2>
        <p>Click the button below to reset your password. This link expires soon.</p>
        <p>
          <a href="${link}" style="display:inline-block;padding:10px 16px;border-radius:8px;background:#111;color:#fff;text-decoration:none">
            Reset Password
          </a>
        </p>
        <p>Or copy this link:<br>${link}</p>
      </div>
    `,
  });

  if (IS_DEV) {
    return res.json({
      success: true,
      message: "Password reset email sent",
      data: { dev_link: link },
    });
  }

  return res.json({ success: true, message: "Password reset email sent" });
}

/** POST /auth/reset-password */
export async function resetPassword(req: Request, res: Response) {
  const { token, password } = req.body as { token?: string; password?: string };
  if (!token || !password) {
    return res.status(400).json({ message: "Token and password are required" });
  }

  let payload: ResetJwtPayload;
  try {
    payload = verifyResetToken(token);
  } catch {
    return res.status(400).json({ message: "Invalid or expired token" });
  }

  const userId = parseInt(payload.sub, 10);
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user || user.password !== payload.pwd) {
    return res.status(400).json({ message: "Invalid or expired token" });
  }

  const hashed = await bcrypt.hash(password, 10);
  await prisma.user.update({
    where: { id: user.id },
    data: { password: hashed },
  });

  return res.json({ message: "Password updated. You can now sign in." });
}

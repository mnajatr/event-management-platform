import prisma from "../prisma";
import bcrypt from "bcrypt";
import { registerSchema } from "../validators/auth.validator";
import { sign } from "jsonwebtoken";
import { HttpException } from "../exceptions/http.exception";

export const registerService = async (input: unknown) => {
  const data = registerSchema.parse(input);

  const existingUser = await prisma.user.findUnique({
    where: { email: data.email },
  });
  if (existingUser) throw new HttpException(409, "Email already registered");

  const hashedPassword = await bcrypt.hash(data.password, 10);
  const referralCode = Math.random().toString(36).substring(2, 10);

  const newUser = await prisma.user.create({
    data: {
      email: data.email,
      password: hashedPassword,
      fullName: data.fullName,
      // role: data.role,
      referralCode,
    },
  });
  const token = sign(
    { id: newUser.id, role: newUser.role },
    process.env.JWT_SECRET!,
    { expiresIn: "1d" }
  );

  return {
    message: "User registered",
    token,
    user: {
      id: newUser.id,
      email: newUser.email,
      fullName: newUser.fullName,
      role: newUser.role,
    },
  };
};
import jwt, { JwtPayload, SignOptions, Secret } from "jsonwebtoken";

const SECRET: Secret = process.env.RESET_PASSWORD_JWT_SECRET as Secret;
const EXPIRES_RAW = process.env.RESET_PASSWORD_TOKEN_EXPIRES || "15m";
// tipe expiresIn yang valid untuk jsonwebtoken
type MsString = `${number}${"s"|"m"|"h"|"d"}`;
const EXPIRES: number | MsString = EXPIRES_RAW as MsString;

export type ResetJwtPayload = JwtPayload & {
  sub: string;         // standar JWT (string)
  purpose: "reset";
  pwd: string;         // snapshot hash password saat ini
};

export function signResetToken(userId: number, currentHashedPassword: string): string {
  const payload: ResetJwtPayload = {
    sub: String(userId),
    purpose: "reset",
    pwd: currentHashedPassword,
  };
  const options: SignOptions = { expiresIn: EXPIRES };
  return jwt.sign(payload, SECRET, options);
}

export function verifyResetToken(token: string): ResetJwtPayload {
  const decoded = jwt.verify(token, SECRET) as JwtPayload;

  const maybe = decoded as Partial<ResetJwtPayload>;
  if (
    typeof decoded !== "object" ||
    typeof maybe.sub !== "string" ||
    maybe.purpose !== "reset" ||
    typeof maybe.pwd !== "string"
  ) {
    throw new Error("Invalid token payload");
  }
  return maybe as ResetJwtPayload;
}
export interface User {
  id: number;
  email: string;
  fullName: string;
  profilePicture: string | null;
  role: "CUSTOMER" | "ORGANIZER";
  referralCode: string;
  pointsBalance: number;
  createdAt: string;
}

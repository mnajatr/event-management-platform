// src/components/LogoutButton.tsx
'use client';

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('token');
    toast.success("Logged out successfully");
    router.push('/auth/login');
  };

  return (
    <Button variant="destructive" size="sm" onClick={handleLogout}>
      Logout
    </Button>
  );
}

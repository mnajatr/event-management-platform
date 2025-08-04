"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { isAuthenticated, getUserRole, isTokenExpired } from "@/lib/auth";

interface ProtectedPageProps {
children: React.ReactNode;
allowedRoles?: string[]; // Misalnya: ['CUSTOMER'] atau ['ORGANIZER']
}

export default function ProtectedPage({ children, allowedRoles }: ProtectedPageProps) {
const [isAuthorized, setIsAuthorized] = useState(false);
const router = useRouter();

useEffect(() => {
if (!isAuthenticated()) {
toast.error("You must be logged in");
router.replace("/auth/login");
return;
}

if (isTokenExpired()) {  
  toast.error("Session expired, please login again");  
  localStorage.clear();  
  router.replace("/auth/login");  
  return;  
}  

if (allowedRoles && allowedRoles.length > 0) {  
  const role = getUserRole();  
  if (!role || !allowedRoles.includes(role)) {  
    toast.error("You are not allowed to access this page");  
    router.replace("/");  
    return;  
  }  
}  

setIsAuthorized(true);

}, [router, allowedRoles]);

if (!isAuthorized) {
return <div className="text-center py-10">Checking access...</div>;
}

return <>{children}</>;
}
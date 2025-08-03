import ProtectedRoute from "@/components/auth/ProtectedRoute";

export default function ProfilePage() {
  return (
    <ProtectedRoute>
      <div className="p-6">
        <h1 className="text-2xl font-bold">My Profile</h1>
        <p>This page is protected. You must be logged in to view it.</p>
      </div>
    </ProtectedRoute>
  );
}

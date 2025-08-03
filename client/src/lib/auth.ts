export function isAuthenticated() {
  if (typeof window === "undefined") return false; // Hindari error di SSR
  const token = localStorage.getItem("token");
  return !!token; // return true kalau token ada
}

// src/lib/auth.ts

export function isAuthenticated(): boolean {
  if (typeof window === "undefined") return false;
  const token = localStorage.getItem("token");
  return !!token;
}

export function getUserRole(): string | null {
  if (typeof window === "undefined") return null;
  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload?.role || null;
  } catch {
    return null;
  }
}

export function isTokenExpired(): boolean {
  if (typeof window === 'undefined') return true;
  const token = localStorage.getItem("token");
  if (!token) return true;

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    if (!payload.exp) return true;
    const now = Math.floor(Date.now() / 1000);
    return now >= payload.exp;
  } catch {
    return true;
  }
}
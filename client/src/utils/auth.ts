import { User } from "@/types/user.type";

export function setSession(token: string, user: User) {
  localStorage.clear();
  localStorage.setItem("token", token);
  localStorage.setItem("user", JSON.stringify(user));
}

export function getToken() {
  return localStorage.getItem("token");
}

export function getUser() {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
}

export function logout() {
  localStorage.clear();
  window.location.href = "/auth/login";
}
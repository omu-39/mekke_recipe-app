import client from "./client";
import type { LoginRequest, RegisterRequest, User } from "../types/User.types";

export const fetchCsrfCookie = () => client.get("/sanctum/csrf-cookie");

export const registerUser = async (data: RegisterRequest): Promise<User> => {
  await fetchCsrfCookie();
  const response = await client.post<User>("/register", data);
  return response.data;
};

export const loginUser = async (data: LoginRequest): Promise<void> => {
  await fetchCsrfCookie();
  await client.post("/login", data);
};

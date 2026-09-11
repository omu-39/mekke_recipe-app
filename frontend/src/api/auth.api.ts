import client from "./client";
import type { RegisterRequest, User } from "../types/User.types";

export const fetchCsrfCookie = () => client.get("/sanctum/csrf-cookie");

export const registerUser = async (data: RegisterRequest): Promise<User> => {
  await fetchCsrfCookie();
  const response = await client.post<User>("/register", data);
  return response.data;
};

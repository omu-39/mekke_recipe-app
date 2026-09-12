import client from "./client";
import type {
  LoginRequest,
  RegisterRequest,
  User,
  ForgotPasswordRequest,
  ResetPasswordRequest,
} from "../types/User.types";

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

export const logoutUser = async (): Promise<void> => {
  await client.post("/logout");
};

export const forgotPassword = async (
  data: ForgotPasswordRequest,
): Promise<void> => {
  await fetchCsrfCookie();
  await client.post("/forgot-password", data);
};

export const resetPassword = async (
  data: ResetPasswordRequest,
): Promise<void> => {
  await fetchCsrfCookie();
  await client.post("/reset-password", data);
};

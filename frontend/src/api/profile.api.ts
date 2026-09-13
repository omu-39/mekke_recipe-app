import client from "./client";
import type {
  User,
  UpdateProfileInformationRequest,
  UpdatePasswordRequest,
} from "../types/User.types";

export const fetchProfile = async (): Promise<User> => {
  const response = await client.get<User>("/profile");
  return response.data;
};

export const updateProfileInformation = async (
  data: UpdateProfileInformationRequest,
): Promise<void> => {
  await client.put("/user/profile-information", data);
};

export const updatePassword = async (
  data: UpdatePasswordRequest,
): Promise<void> => {
  await client.put("/user/password", data);
};

export const updateAvatar = async (file: File): Promise<User> => {
  const formData = new FormData();
  formData.append("avatar", file);
  const response = await client.post<User>("/profile/avatar", formData);
  return response.data;
};

import client from "./client";
import type { Ingredient, UserIngredient } from "../types/Ingredient.types";

export const fetchIngredients = async (
  query?: string,
): Promise<Ingredient[]> => {
  const response = await client.get<Ingredient[]>("/api/ingredients", {
    params: query ? { q: query } : undefined,
  });
  return response.data;
};

export const fetchUserIngredients = async (): Promise<UserIngredient[]> => {
  const response =
    await client.get<UserIngredient[]>("/api/user-ingredients");
  return response.data;
};

export const addUserIngredient = async (
  ingredientId: number,
): Promise<UserIngredient> => {
  const response = await client.post<UserIngredient>(
    "/api/user-ingredients",
    {
      ingredient_id: ingredientId,
    },
  );
  return response.data;
};

export const removeUserIngredient = async (
  ingredientId: number,
): Promise<void> => {
  await client.delete(`/api/user-ingredients/${ingredientId}`);
};

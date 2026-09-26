import client from "./client";
import type {
  RecipeSearchResult
} from "../types/Recipe.types";

export const searchRecipes = async (owned_ingredient_ids: number[]): Promise<RecipeSearchResult> => {
  const response = await client.get<RecipeSearchResult>("/api/recipes/search", {
    params: {
        owned_ingredient_ids: owned_ingredient_ids.join(","),
      }
  });
  return response.data;
};

import client from "./client";
import type {
  RecipeSearchRequest,
  RecipeSearchResult
} from "../types/Recipe.types";

export const searchRecipe = async (request: RecipeSearchRequest): Promise<RecipeSearchResult> => {
  const response = await client.get<RecipeSearchResult>("/api/recipes/search", {
    params: {
        owned_ingredient_ids: request.owned_ingredient_ids.join(","),
      }
  });
  return response.data;
};

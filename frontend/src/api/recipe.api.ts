import client from "./client";
import type {
  Recipe,
  RecipeSearchResult
} from "../types/Recipe.types";

export interface CreateRecipeIngredientInput {
  ingredient_id: number;
  quantity?: string;
}

export interface CreateRecipeInput {
  name: string;
  cooking_time: number;
  image: File | null;
  ingredients: CreateRecipeIngredientInput[];
  steps: string[];
}

export const searchRecipes = async (owned_ingredient_ids: number[]): Promise<RecipeSearchResult> => {
  const response = await client.get<RecipeSearchResult>("/api/recipes/search", {
    params: {
        owned_ingredient_ids: owned_ingredient_ids.join(","),
      }
  });
  return response.data;
};

export const fetchRecipe = async (recipeId: number): Promise<Recipe> => {
  const response = await client.get<Recipe>(`/api/recipes/${recipeId}`);
  return response.data;
};

export const createRecipe = async (input: CreateRecipeInput): Promise<Recipe> => {
  const formData = new FormData();
  formData.append("name", input.name);
  formData.append("cooking_time", String(input.cooking_time));
  if (input.image) {
    formData.append("image", input.image);
  }
  input.ingredients.forEach((ingredient, index) => {
    formData.append(`ingredients[${index}][ingredient_id]`, String(ingredient.ingredient_id));
    if (ingredient.quantity) {
      formData.append(`ingredients[${index}][quantity]`, ingredient.quantity);
    }
  });
  input.steps.forEach((step, index) => {
    formData.append(`steps[${index}]`, step);
  });

  const response = await client.post<Recipe>("/api/recipes", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

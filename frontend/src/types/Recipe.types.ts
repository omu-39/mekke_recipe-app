import type { RecipeIngredient } from "./Ingredient.types";

export interface Recipe {
    id: number;
    user_id: number;
    name: string;
    image_path: string | null;
    cooking_time: number;
    steps: string;
    created_at: string;
    updated_at: string;
    ingredients: RecipeIngredient[];
}

export interface RecipeSearchItem {
    recipe: Recipe;
    missingIngredientNames: string[];
    missingCount: number;
}

export interface RecipeSearchResult {
    makeable: RecipeSearchItem[];
    oneShort: RecipeSearchItem[];
    multiShortage: RecipeSearchItem[];
}

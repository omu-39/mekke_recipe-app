import type { RecipeIngredient } from "./Ingredient.types";

export interface RecipeAuthor {
    id: number;
    name: string;
}

export interface RecipeStep {
    id: number;
    recipe_id: number;
    step_number: number;
    content: string;
}

export interface Recipe {
    id: number;
    user_id: number;
    name: string;
    image_path: string | null;
    cooking_time: number;
    created_at: string;
    updated_at: string;
    ingredients: RecipeIngredient[];
    recipe_steps: RecipeStep[];
    user?: RecipeAuthor;
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

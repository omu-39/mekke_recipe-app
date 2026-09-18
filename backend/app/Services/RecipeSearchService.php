<?php

namespace App\Services;

use App\Models\Recipe;

class RecipeSearchService
{
    public function searchRecipes(array $ownedIngredientIds): array
    {
        $recipes = Recipe::with('ingredients')->get();

        $recipesWithMissingIngredients = $recipes->map(function ($recipe) use ($ownedIngredientIds) {
            $requiredIngredientIds = $recipe->ingredients->pluck('id');
            $missingIngredientIds = $requiredIngredientIds->diff($ownedIngredientIds);
            $missingIngredients = $recipe->ingredients->whereIn('id', $missingIngredientIds);

            return [
                'recipe' => $recipe,
                'missingIngredientNames' => $missingIngredients->pluck('name'),
                'missingCount' => $missingIngredientIds->count(),
            ];
        });

        $makeable = $recipesWithMissingIngredients->where('missingCount', 0)->values();
        $oneShort = $recipesWithMissingIngredients->where('missingCount', 1)->values();
        $multiShortage = $recipesWithMissingIngredients
            ->where('missingCount', '>=', 2)
            ->sortBy('missingCount')
            ->values();

        return [
            'makeable' => $makeable,
            'oneShort' => $oneShort,
            'multiShortage' => $multiShortage,
        ];
    }
}

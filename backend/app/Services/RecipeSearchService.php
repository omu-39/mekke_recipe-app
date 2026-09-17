<?php

namespace App\Services;

use App\Models\Recipe;

class RecipeSearchService
{
    public function searchRecipes(array $ownedIngredientIds): array
    {
        $recipes = Recipe::with('ingredients')->get();

        $recipesWithMissingCount = $recipes->map(function ($recipe) use ($ownedIngredientIds) {
            $requiredIngredientIds = $recipe->ingredients->pluck('id');
            $missingCount = $requiredIngredientIds->diff($ownedIngredientIds)->count();

            return [
                'recipe' => $recipe,
                'missingCount' => $missingCount,
            ];
        });

        $makeable = $recipesWithMissingCount->where('missingCount', 0)->values();
        $oneShort = $recipesWithMissingCount->where('missingCount', 1)->values();
        $multiShortage = $recipesWithMissingCount
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

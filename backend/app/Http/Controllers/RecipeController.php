<?php

namespace App\Http\Controllers;

use App\Services\RecipeSearchService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class RecipeController extends Controller
{
    protected $recipeSearchService;

    public function __construct(RecipeSearchService $recipeSearchService)
    {
        $this->recipeSearchService = $recipeSearchService;
    }

    public function search(Request $request): JsonResponse
    {
        if (! $request->owned_ingredient_ids) {
            return response()->json([
                'makeable' => [],
                'oneShort' => [],
                'multiShortage' => [],
            ]);
        }

        $ownedIngredientIds = array_map('intval', explode(',', $request->owned_ingredient_ids));
        $result = $this->recipeSearchService->searchRecipes($ownedIngredientIds);

        return response()->json([
            'makeable' => $result['makeable'],
            'oneShort' => $result['oneShort'],
            'multiShortage' => $result['multiShortage'],
        ]);
    }
}

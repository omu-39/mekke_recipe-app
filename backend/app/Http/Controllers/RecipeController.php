<?php

namespace App\Http\Controllers;

use App\Models\Recipe;
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

    /**
     * レシピ詳細を返す（UC-05-01）。
     * 材料一覧（分量含む）・投稿者情報も一緒に返す。
     * 投稿者情報はid・nameのみとし、メールアドレス等は含めない。
     */
    public function show(Recipe $recipe): JsonResponse
    {
        $recipe->load(['ingredients', 'user:id,name']);

        return response()->json($recipe);
    }
}

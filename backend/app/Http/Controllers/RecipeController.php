<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreRecipeRequest;
use App\Models\Recipe;
use App\Models\RecipeStep;
use App\Services\RecipeSearchService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

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
        $recipe->load(['ingredients', 'recipeSteps', 'user:id,name']);

        return response()->json($recipe);
    }

    /**
     * レシピを投稿する（UC-06-01）。
     * 画像アップロードはトランザクションの外で行い、
     * recipes・recipe_ingredient・recipe_stepsへの登録は
     * 原子的に扱う（spec_v2.md 10.4節）。
     */
    public function store(StoreRecipeRequest $request): JsonResponse
    {
        $validated = $request->validated();

        $imagePath = null;
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('recipes', 'public');
        }

        $recipe = DB::transaction(function () use ($request, $validated, $imagePath) {
            $recipe = Recipe::create([
                'user_id' => $request->user()->id,
                'name' => $validated['name'],
                'image_path' => $imagePath,
                'cooking_time' => $validated['cooking_time'],
            ]);

            foreach ($validated['ingredients'] as $ingredient) {
                $recipe->ingredients()->attach($ingredient['ingredient_id'], [
                    'quantity' => $ingredient['quantity'] ?? null,
                ]);
            }

            foreach ($validated['steps'] as $index => $content) {
                RecipeStep::create([
                    'recipe_id' => $recipe->id,
                    'step_number' => $index + 1,
                    'content' => $content,
                ]);
            }

            return $recipe;
        });

        $recipe->load(['ingredients', 'recipeSteps', 'user:id,name']);

        return response()->json($recipe, 201);
    }
}

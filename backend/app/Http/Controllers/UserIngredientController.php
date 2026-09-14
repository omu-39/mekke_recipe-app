<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreUserIngredientRequest;
use App\Models\Ingredient;
use App\Models\UserIngredient;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class UserIngredientController extends Controller
{
    /**
     * ログイン中ユーザーの所持食材一覧を返す（UC-03-01）。
     */
    public function index(Request $request): JsonResponse
    {
        return response()->json(
            $request->user()->ingredients()->orderBy('name')->get(),
        );
    }

    /**
     * 所持食材を登録する（UC-03-02）。
     * ADR-0001（食材マスタ方式）に基づき、食材マスタに存在するIDのみ
     * 登録を許可する（StoreUserIngredientRequestでバリデーション）。
     */
    public function store(StoreUserIngredientRequest $request): JsonResponse
    {
        $userIngredient = UserIngredient::firstOrCreate([
            'user_id' => $request->user()->id,
            'ingredient_id' => $request->validated('ingredient_id'),
        ]);

        return response()->json(
            $userIngredient->load('ingredient'),
            201,
        );
    }

    /**
     * 所持食材を削除する（UC-03-03）。
     */
    public function destroy(Request $request, Ingredient $ingredient): JsonResponse
    {
        $request->user()
            ->ingredients()
            ->detach($ingredient->id);

        return response()->json(null, 204);
    }
}

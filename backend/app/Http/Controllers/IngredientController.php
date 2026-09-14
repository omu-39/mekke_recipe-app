<?php

namespace App\Http\Controllers;

use App\Models\Ingredient;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class IngredientController extends Controller
{
    /**
     * 食材マスタの一覧を返す。
     * qパラメータで食材名の部分一致検索ができる（UC-03-04）。
     */
    public function index(Request $request): JsonResponse
    {
        $query = Ingredient::query();

        if ($request->filled('q')) {
            $query->where('name', 'like', '%'.$request->string('q').'%');
        }

        return response()->json($query->orderBy('name')->get());
    }
}

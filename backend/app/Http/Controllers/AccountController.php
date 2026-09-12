<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AccountController extends Controller
{
    /**
     * 退会（アカウント削除）処理。
     * 現時点ではレシピ・お気に入り・買い物リスト等のテーブルが未実装のため、
     * ユーザーアカウント自体の削除のみを行う。投稿データの匿名化処理は
     * 該当テーブル実装時に追記する（recipe_app_spec_v2.md 7.11節・10.4節参照）。
     */
    public function destroy(Request $request): JsonResponse
    {
        $user = $request->user();

        Auth::guard('web')->logout();

        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return response()->json(null, 204);
    }
}

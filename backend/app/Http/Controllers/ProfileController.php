<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ProfileController extends Controller
{
    /**
     * ログイン中ユーザーのプロフィール情報を返す。
     * Fortifyには現在のユーザー情報を取得するAPIが無いため自前で用意する。
     */
    public function show(Request $request): JsonResponse
    {
        return response()->json($request->user());
    }

    /**
     * アイコン画像を更新する。
     * 名前・メールアドレスの更新はFortify標準の
     * PUT /user/profile-information を利用するため、ここでは画像のみ扱う。
     */
    public function update(Request $request): JsonResponse
    {
        $request->validate([
            'avatar' => ['required', 'image', 'max:2048'],
        ]);

        $user = $request->user();
        $path = $request->file('avatar')->store('avatars', 'public');

        $user->fill(['avatar_path' => $path])->save();

        return response()->json($user);
    }
}

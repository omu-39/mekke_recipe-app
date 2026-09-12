# 0005. 2要素認証・パスキー機能をMVPスコープ外とする

## ステータス

確定

## コンテキスト

Laravel Fortify（`adr_0004`参照）を導入した際、標準スキャフォールドとして
2要素認証（`Features::twoFactorAuthentication()`）およびパスキー
（`Features::passkeys()`）機能が有効化された状態だった。

しかし、`recipe_app_spec_v2.md` 12.3節では「二段階認証等、認証方式の高度化」を
将来対応（拡張フェーズで検討する事項）と明記しており、`use_cases.md`のUC一覧にも
2要素認証・パスキーに関連するユースケースは存在しない。

## 決定

MVPでは2要素認証・パスキー機能を無効化する。

- `config/fortify.php`の`features`配列から`twoFactorAuthentication()`・
  `passkeys()`を削除
- `FortifyServiceProvider`から`RedirectIfTwoFactorAuthenticatable`の
  バインディングを削除
- 2要素認証・パスキー専用のレート制限（`limiters`設定）を削除
- 関連するマイグレーション（2要素認証用カラム追加、`passkeys`テーブル作成）は
  作成しない

なお、`laravel/passkeys`パッケージ自体はFortify本体が依存パッケージとして
要求する（`laravel/fortify`が`laravel/passkeys ^0.2.0`を必須とする）ため、
`composer.json`上は残存する。これは無効化した機能を将来的に有効化する場合の
移行コストを抑える副次的な利点もある。

## 影響

- MVPでは認証方式がメールアドレス＋パスワードのみとなり、
  `recipe_app_spec_v2.md` 12.4節の非機能要件（セッション方式の認証）と一致する
- 将来2要素認証・パスキーに対応する場合は、`features`配列に該当行を追加し、
  マイグレーション・レート制限・リダイレクト処理を改めて実装する必要がある

## 参照

- `recipe_app_spec_v2.md` 12.3節、12.4節
- `use_cases.md` UC-01
- `docs/adr/adr_0004_fortify.md`

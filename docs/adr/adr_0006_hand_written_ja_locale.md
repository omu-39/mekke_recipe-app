# 0006. 日本語バリデーションメッセージを自作する

## ステータス

確定

## コンテキスト

Laravel標準の`APP_LOCALE`は`en`（英語）であり、バリデーションエラー
メッセージも英語のまま返る。日本語化にあたり、以下の2案を検討した。

- コミュニティパッケージ`laravel-lang/lang`（多くのLaravelプロジェクトで
  利用される定番の翻訳パッケージ）を導入する
- 必要なバリデーションルールに対応する翻訳ファイルのみを手動で作成する

`laravel-lang/lang`は2026年5月にサプライチェーン攻撃を受けた実績がある
（`laravel-lang/lang`含む4パッケージ、既存の全Gitタグ約502個が書き換えられ、
Composerのオートロードで自動実行される悪意あるコードが仕込まれた事案。
出典: https://yamory.io/blog/laravel-lang-supply-chain-attack ）。
Packagistは2026年5月23日に悪意あるバージョンを削除し対応済みだが、
既に取り込んでいた環境では被害が出ていた可能性がある。

## 決定

`laravel-lang/lang`等の外部コミュニティパッケージは導入せず、
`lang/ja/validation.php`を自作する。現時点で使用しているバリデーション
ルール（`required`, `string`, `max`, `min`, `email`, `unique`, `confirmed`,
`password.letters`, `password.numbers`）に対応するメッセージのみを
最小限定義する。

`.env`の`APP_LOCALE`を`ja`に設定し、`APP_FALLBACK_LOCALE`は`en`のまま
維持する（翻訳漏れがあった場合に、崩れた表示ではなく英語表示にフォール
バックさせるため）。

## 影響

- 外部パッケージのサプライチェーンリスクを避けられる一方、新しい
  バリデーションルールを使うたびに`lang/ja/validation.php`への追記が
  必要になる（メンテナンスコストの発生）
- 翻訳範囲は都度手動で追従する必要があるため、実装時にバリデーション
  メッセージが英語のまま表示されていないか確認する運用が求められる

## 参照

- `recipe_app_spec_v2.md` 7.2節（バリデーションエラー表示要件）
- https://yamory.io/blog/laravel-lang-supply-chain-attack

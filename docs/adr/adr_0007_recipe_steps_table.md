# 0007. 調理手順をrecipe_stepsテーブルに分離する

## ステータス

確定

## コンテキスト

`recipes.steps`は当初、`"1. ...\n2. ..."`形式の改行区切り文字列として
1カラムで保持していた。フロントエンドのレシピ詳細画面は正規表現
（`.replace(/^\d+\.\s*/, "")`）で先頭の番号を除去して表示していた。

UC-06-01（レシピ投稿画面）のデザイン（`pc-recipe-post.png`）では、
調理手順をステップごとに独立した入力欄で入力させ、「+ステップ追加」で
動的に増減できるUIになっている。文字列1カラムのままでは、フロント側で
改行区切り文字列の分割・結合・番号付与を都度行う必要があり、以下の問題があった。

- ステップの並び替え・途中挿入・削除のたびに文字列を組み立て直す必要がある
- 手順本文に改行や数字始まりの文言が含まれる場合、区切り文字列の
  パースが壊れるリスクがある
- DBレベルでステップ単位のバリデーション（空文字チェック等）ができない

## 決定

`recipes.steps`カラムを廃止し、`recipe_steps`テーブルに分離する。

```text
recipe_steps
  id
  recipe_id (FK, cascadeOnDelete)
  step_number (unsigned integer)
  content (text)
  timestamps

  unique (recipe_id, step_number)
```

- `Recipe`モデルに`recipeSteps()`（`hasMany`、`step_number`昇順）を追加する
- レシピ投稿時（`RecipeController::store`）は、`recipes`・`recipe_ingredient`・
  `recipe_steps`への登録をひとつのDBトランザクションにまとめる
  （ADR-0002のトランザクション方針に従う）
- 既存の`RecipeSeeder`データも、改行区切り文字列から配列形式に書き換え、
  `recipe_steps`への個別登録に移行する

マイグレーションは新規に「stepsカラムを削除する」ファイルを追加するのではなく、
`create_recipes_table`マイグレーション自体から`steps`カラム定義を削除した。
本プロジェクトはまだ本番環境へのデプロイ実績がなく、マイグレーション履歴を
巻き戻して`migrate:fresh`する運用が可能なため、履歴を汚さずシンプルに保つ
ことを優先した。

## 影響

- APIレスポンスの`recipe_steps`キーは、Eloquentのデフォルト挙動により
  スネークケースになる（フロントエンドの`Recipe`型もこれに合わせる）
- フロントエンドの`RecipeDetailPage`は、文字列分割・正規表現による番号除去が
  不要になり、`recipe.recipe_steps`を`step_number`昇順でそのまま表示できる
- 将来チームに新しいメンバーが増えても、`migrate:fresh`ではなく追加
  マイグレーションで対応する運用に切り替わった場合は、以後は本ADRのような
  「既存マイグレーションの直接編集」は行わず、通常通り差分マイグレーションを
  追加する方針に戻す

## 参照

- `recipe_app_spec_v2.md` 7.6節（レシピ投稿画面）、10.4節（トランザクション方針）
- `use_cases.md` UC-06-01（レシピ投稿）
- [ADR-0002](adr_0002_transaction_policy.md)（トランザクション方針）

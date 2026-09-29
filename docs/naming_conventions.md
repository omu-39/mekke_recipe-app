# レシピアプリ 命名規則

> 本ドキュメントは `recipe_app_spec_v2.md` の技術構成案（14章）に基づき、
> Frontend：React / TypeScript、Backend：Laravel / PHP、Database：PostgreSQL
> を前提とした命名規則をまとめたものです。

---

## 1. データベース（PostgreSQL / Laravel Migration）

### 1.1 テーブル名

- 小文字スネークケース・**複数形**
- 例：`users`, `recipes`, `ingredients`, `favorites`, `shopping_list_items`

### 1.2 中間テーブル（多対多）

- 関連する2テーブル名をアルファベット順・単数形で連結
- 例：`recipe_ingredient`（recipes × ingredients）

### 1.3 カラム名

- 小文字スネークケース・単数形
- 主キー：`id`
- 外部キー：`{参照テーブル単数形}_id`（例：`user_id`, `recipe_id`, `ingredient_id`）
- 真偽値：`is_` / `has_` を接頭辞に（例：`is_published`, `has_reviewed`）
- 日時：`created_at`, `updated_at`, `deleted_at`（Laravel規約に準拠）
- その他の日時：`{動詞過去形 or 名詞}_at`（例：`purchased_at`, `posted_at`）

### 1.4 Enum・区分値

- カラム名は名詞、値は小文字スネークケース
- 例：`status` カラムの値 → `unpurchased`, `purchased`

### 1.5 インデックス・制約名

- インデックス：`idx_{テーブル名}_{カラム名}`
- ユニーク制約：`uq_{テーブル名}_{カラム名}`
- 外部キー制約：`fk_{テーブル名}_{参照テーブル名}`

---

## 2. バックエンド（Laravel / PHP）

### 2.1 モデル

- パスカルケース・**単数形**
- 例：`User`, `Recipe`, `Ingredient`, `Favorite`, `ShoppingListItem`

### 2.2 コントローラー

- パスカルケース・単数形＋ `Controller`
- 例：`RecipeController`, `ShoppingListController`, `ProfileController`
- リソース系メソッドは Laravel 標準に合わせる：`index`, `show`, `store`, `update`, `destroy`

### 2.3 マイグレーションファイル

- Laravel 標準形式：`{timestamp}_{動詞}_{テーブル名}_table.php`
- 例：`2026_09_01_000001_create_recipes_table.php`
- 例：`2026_09_10_000001_add_status_to_shopping_list_items_table.php`

### 2.4 リクエスト（FormRequest）

- パスカルケース：`{動詞}{対象}Request`
- 例：`StoreRecipeRequest`, `UpdateProfileRequest`, `PostReviewRequest`

### 2.5 リソース（API Resource）

- パスカルケース：`{対象}Resource`
- 例：`RecipeResource`, `IngredientResource`

### 2.6 サービス・ロジッククラス（任意導入時）

- パスカルケース：`{動詞的役割}{対象}Service`
- 例：`RecipeSearchService`, `ShortageJudgeService`

### 2.7 Fortify Action クラス 🆕

- Laravel Fortifyのカスタマイズ処理は `app/Actions/Fortify/` 配下に配置する
- クラス名はFortify標準の命名に従う（独自に変更しない）
  - `CreateNewUser`：ユーザー登録処理（UC-01-01）
  - `UpdateUserPassword`：パスワード変更処理
  - `ResetUserPassword`：パスワード再設定処理（UC-01-05）
  - `PasswordValidationRules`：パスワードポリシーの共通ルール（12.4節の非機能要件に準拠）
- Fortifyの対象外（プロフィール編集・退会等、UC-02・UC-01-06）は、2.2節の通り通常の
  `Controller` クラス（例：`ProfileController`）として実装し、Actionクラスに寄せない

---

## 3. API エンドポイント

### 3.1 基本方針

- 名詞の複数形・小文字ケバブケース（kebab-case）
- 動詞は使わず、HTTPメソッドで操作を表現する

| 操作 | メソッド | 例 |
|---|---|---|
| 一覧取得 | GET | `/api/recipes` |
| 詳細取得 | GET | `/api/recipes/{id}` |
| 新規作成 | POST | `/api/recipes` |
| 更新 | PUT/PATCH | `/api/recipes/{id}` |
| 削除 | DELETE | `/api/recipes/{id}` |

### 3.2 ネストしたリソース

- 例：`/api/recipes/{id}/reviews`（レシピに対するレビュー投稿）
- 例：`/api/shopping-list-items/{id}/purchase`（購入済みへの変更のように単純なCRUDに収まらない操作のみ、末尾に動詞を許可）

### 3.3 検索・フィルタはクエリパラメータで表現

- 例：`/api/recipes?owned_ingredient_ids=1,2,3`

---

## 4. フロントエンド（React / TypeScript）

### 4.1 コンポーネントファイル

- パスカルケース＋ `.tsx`
- 例：`RecipeCard.tsx`, `IngredientSearchBar.tsx`, `ShoppingListItem.tsx`
- 1ファイル1コンポーネントを原則とする

### 4.2 コンポーネント以外のファイル

- フック：`use` + キャメルケース ＋ `.ts`（例：`useRecipeSearch.ts`）
- ユーティリティ：キャメルケース ＋ `.ts`（例：`formatCookingTime.ts`）
- 型定義：パスカルケース ＋ `.types.ts`（例：`Recipe.types.ts`）
- API通信関数：キャメルケース ＋ `.api.ts`（例：`recipes.api.ts`） 🆕
- ルーティング定義：キャメルケース ＋ `.routes.tsx`（例：`appRoutes.tsx`） 🆕

### 4.3 ディレクトリ構成の目安 🆕

```text
src/
  components/       # 再利用可能なUI部品（RecipeCard 等）
  features/         # 機能単位（recipe-search, shopping-list 等）
  hooks/            # カスタムフック
  api/              # API通信層（axiosインスタンス・各リソースのAPI関数）
  routes/           # React Routerのルーティング定義
  types/            # 型定義
  pages/            # 画面単位のコンポーネント（画面遷移図のノードと対応させる）
  styles/           # Tailwindのエントリーポイント（globals.css等）のみ。個別コンポーネントのCSSファイルは基本作らない
tailwind.config.ts  # デザイントークン（色・余白・フォント等）を定義
```

#### API通信層（`api/`）の構成例

```text
api/
  client.ts          # axiosインスタンス本体（baseURL・共通ヘッダ・Cookie送信設定を1箇所に集約）
  recipes.api.ts      # レシピ関連のAPI関数（fetchRecipes, fetchRecipeById 等）
  ingredients.api.ts  # 食材関連のAPI関数
  shoppingList.api.ts # 買い物リスト関連のAPI関数
```

- 各画面・コンポーネントは `api/client.ts` のaxiosインスタンスを直接importせず、`{リソース名}.api.ts` の関数経由でAPIを呼び出す
- ベースURLは環境変数 `VITE_API_BASE_URL` から読み込む（14章の技術構成参照）

#### ルーティング（`routes/`）の構成例

```text
routes/
  appRoutes.tsx       # ルート定義のエントリーポイント
```

- パスは画面遷移図（`screen_transition_diagram.mermaid`）のノード名と対応させる
- 例：`/recipes/:id`（レシピ詳細＝Gノード）、`/shopping-list`（買い物リスト＝Fノード）、`/my-recipes`（投稿レシピ一覧＝Mノード）

### 4.4 API通信（Axios） 🆕

- axiosインスタンスは `api/client.ts` に1つだけ作成し、各所で `axios` を直接importしない
- baseURLは環境変数（`import.meta.env.VITE_API_BASE_URL`）から取得する
- Sanctum（Cookieベース認証）を使う場合は `withCredentials: true` を共通インスタンスに設定する
- APIレスポンスの型は4.6節の `{対象}Response` 命名規則に従い、`api/`配下の関数の戻り値として明示する
- エラーハンドリングは各画面で個別に書かず、共通のインターセプター（例：401時は自動的にログイン画面へ遷移）を `client.ts` にまとめる

### 4.5 変数・関数

- 変数・関数：キャメルケース（例：`missingIngredientCount`, `fetchRecipes`）
- 真偽値：`is` / `has` / `can` を接頭辞に（例：`isOwned`, `hasReview`, `canEdit`）
- 定数：大文字スネークケース（例：`MAX_IMAGE_SIZE_MB`）
- イベントハンドラ：`handle` + 動詞（例：`handleSearchClick`, `handleIngredientRemove`）

### 4.6 型・インターフェース

- パスカルケース
- Props専用の型は `{コンポーネント名}Props`（例：`RecipeCardProps`）
- API レスポンス型は `{対象}Response`（例：`RecipeSearchResponse`）

### 4.7 スタイリング（Tailwind CSS） 🆕

- 基本方針として、独自CSSクラスは極力作らず、Tailwindのユーティリティクラスをそのまま使用する
- 色・余白・フォントサイズ・角丸などのデザイントークンは `tailwind.config.ts` の `theme.extend` にまとめて定義し、コンポーネント側でマジックナンバー（例：`p-[13px]`のような任意値）を使わない
- 同じユーティリティの組み合わせが複数箇所で繰り返される場合は、Tailwindのクラス文字列をコンポーネント側で切り出す（例：`const cardStyle = "rounded-lg shadow-md p-4"`）か、`@apply` を使った共通クラスとして `styles/` にまとめる
- どうしても独自クラスが必要な場合（アニメーション定義等）は、BEM風の命名に従う：`recipe-card__title`, `recipe-card__title--highlighted`
- 条件によってクラスを出し分ける場合は `clsx` や `classnames` 等のユーティリティ導入を検討する

---

## 5. Git・開発フロー

### 5.1 ブランチ名

- `feature/{内容}`：新機能（例：`feature/recipe-review`）
- `fix/{内容}`：不具合修正（例：`fix/shopping-list-duplicate`）
- `chore/{内容}`：設定変更・雑務（例：`chore/update-deps`）

### 5.2 コミットメッセージ

- Conventional Commits 形式を推奨
- 例：`feat: レシピ詳細画面にレビュー投稿機能を追加`
- 例：`fix: 買い物リストの重複統合処理を修正`
- 接頭辞：`feat`, `fix`, `docs`, `refactor`, `test`, `chore`

---

## 6. UC番号・仕様書との対応

- ユースケース番号（`use_cases.md`）は `UC-{カテゴリ2桁}-{連番2桁}`（例：`UC-04-01`）の形式を維持する
- 実装側（Issue・PRタイトル等）でユースケースに対応させる場合は、末尾に `[UC-04-01]` のように付記することを推奨する
- 例：PRタイトル `feat: 所持食材でのレシピ検索を実装 [UC-04-01]`

---

## 7. 命名時の共通原則

- 略語は極力使わない（例：`ing` ではなく `ingredient`）
- 単数形・複数形の使い分けを一貫させる（テーブル・コレクションは複数形、1件を表す変数・モデルは単数形）
- 否定形の真偽値名（`isNotPublished` 等）は避け、肯定形＋条件分岐で表現する
- 略称が必要な場合はプロジェクト内で用語集を作成し、全員が同じ略称を使う

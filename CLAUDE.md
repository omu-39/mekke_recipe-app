# メッケ（レシピアプリ）

就職活動ポートフォリオとして開発中のレシピ管理アプリ。所持食材から作れるレシピを検索できるのが主機能。
開発者は初心者エンジニアで、実務に近いGit運用（Issue→ブランチ→実装→セルフレビュー→PR→マージ）を学びながら進めている。

## 仕様の参照元

以下はリポジトリ内の `docs/` にあり、実装前に必ず参照する。

- `recipe_app_spec_v2.md` — 機能仕様書
- `use_cases.md` — ユースケース一覧（`UC-{カテゴリ2桁}-{連番2桁}`形式）
- `naming_conventions.md` — 命名規則（DB・バックエンド・フロントエンド・API・Git全般）
- `development_workflow.md` — 開発フロー（Issue起票→ブランチ→実装→セルフレビュー→PR→マージ）
- `screen_transition_diagram.mermaid` — 画面遷移図

命名に迷ったら必ず `naming_conventions.md` を確認する。独自ルールを勝手に作らない。

## 技術構成

- Backend: Laravel（PHP 8.5）+ Laravel Fortify + Sanctum（Cookieベース・SPA構成）
- Frontend: React + TypeScript + React Router + Tailwind CSS v4 + axios
- DB: PostgreSQL
- 環境: Docker Compose（Laravel Sail）。`compose.yaml`は4サービス構成：
  - `laravel.test`（backend、Sail）
  - `pgsql`（PostgreSQL 18）
  - `pgadmin`（DB管理UI、`localhost:5050`）
  - `frontend`（Vite dev server、`localhost:5173`、`node_modules`は専用ボリュームでホストと分離）

### ディレクトリ構成

```text
backend/    # Laravelアプリ本体
frontend/   # Reactアプリ本体
docs/adr/   # Architecture Decision Record
```

## コーディング規約（詳細は naming_conventions.md）

### バックエンド（Laravel/PHP）

- モデル：パスカルケース単数形（`Recipe`, `Ingredient`）
- コントローラー：`{対象}Controller`、リソースメソッドは`index/show/store/update/destroy`
- サービスクラス（任意導入）：`{動詞的役割}{対象}Service`（例：`RecipeSearchService`）。コントローラーが太りそうな複雑なロジックはServiceに切り出す
- テーブル名：小文字スネークケース複数形、中間テーブルはアルファベット順単数形連結（例：`recipe_ingredient`）
- `belongsToMany`は中間テーブル名を必ず明示指定する（Laravel自動推測の`ingredient_recipe`は実テーブル名と一致しないため）
- マイグレーションファイル名のタイムスタンプは、参照先テーブルより後になるよう厳密に管理する（順序を誤ると外部キー制約エラーになる）
- N+1問題を避けるため、リレーションを使う箇所は`with()`によるEager Loadingを徹底する
- ルーティングは固定パスを可変パスより先に定義する（例：`/recipes/search`は`/recipes/{recipe}`より前）
- Laravel Pintでコードスタイルを自動整形する

### フロントエンド（React/TypeScript）

- コンポーネント：パスカルケース`.tsx`、1ファイル1コンポーネント
- フック：`use`+キャメルケース（例：`useIngredients.ts`）。複数画面で使う状態・ロジックはカスタムフックに集約する
- 型定義：パスカルケース`.types.ts`（例：`Recipe.types.ts`）
- API通信関数：キャメルケース`.api.ts`。axiosは`api/client.ts`のインスタンスを直接importせず、必ず`{リソース名}.api.ts`経由で呼び出す
- Props型は`{コンポーネント名}Props`、APIレスポンス型は`{対象}Response`または`{対象}Result`
- 真偽値は`is`/`has`/`can`接頭辞、イベントハンドラは`handle`+動詞
- Tailwindはユーティリティクラスをそのまま使い、独自CSSクラスは極力作らない。デザイントークンは`@theme`ディレクティブで定義し、マジックナンバー（任意値）を避ける

### API設計

- エンドポイントは名詞複数形・ケバブケース、動詞は使わずHTTPメソッドで操作を表現する
- 検索・フィルタはクエリパラメータで表現する（例：`?owned_ingredient_ids=1,2,3`）

## Git運用（詳細は development_workflow.md）

- 1 Issue = 1 PR、`use_cases.md`のUC番号を必ず紐づける（PRタイトル末尾に`[UC-04-01]`のように付記）
- ブランチ命名：`feature/{内容}` / `fix/{内容}` / `chore/{内容}`
- コミットメッセージ：Conventional Commits形式（`feat:`, `fix:`, `docs:`, `refactor:`, `test:`, `chore:`）
- PR作成前にセルフレビューチェックリスト（development_workflow.md §5）を確認する
- 設計判断が伴う変更は`docs/adr/`にADRを追加する（ファイル名：`{連番4桁}-{内容}.md`）
- 各マイルストーン（M1〜M4、development_workflow.md §3）終了時にKPT形式の振り返りを行う

## この環境特有の注意点（過去のハマりどころ）

- **Dockerコンテナ内で`npm install`しない**：フロントエンドの依存関係はホスト側の`frontend/`ディレクトリで作業する。コンテナ内の`node_modules`は専用ボリュームでホストと分離されているため、ホストで入れた変更が反映されない・逆に想定外のパッケージが紛れ込むといった事故が起きる
- **ファイル所有権問題**：`php artisan make:*`等をコンテナ内から実行すると生成物がroot所有になることがある。可能な限りartisanのファイル生成系コマンドはホスト側のPHP環境で実行し、コンテナは主にDB接続やサーバー起動に使う
- **`.editorconfig`の`[*]`セクションはデフォルト`indent_size = 4`**。TS/TSX/JS/JSON/CSSは`indent_size = 2`のセクションを個別に持つ必要がある（過去にこれが漏れて保存時の自動整形でインデントが崩れた）
- **新しいライブラリを試験導入する際は、必ず`frontend/`か`backend/`のどちらかのディレクトリ内で`package.json`/`composer.json`を確認してからインストールする**（過去にルート直下の雛形`package.json`に誤ってUIライブラリをインストールし、復旧に時間がかかった事故がある）

## 現在の設計上の既知課題

- `recipes.steps`カラムは現状「1. ...\n2. ...」形式の改行区切り文字列。UC-06（レシピ投稿・編集）実装時、`pc-recipe-post.png`のステップ別入力UIに対応するため`recipe_steps`テーブルへの再設計が必要
- レシピ検索は現在ページングを実装せず全件返却（フロントエンド側で3件区切り表示＋「一覧を表示する」ボタンで対応）。レシピ件数が大きく増えた場合はカーソルベースページングの再検討余地あり

## コミュニケーション方針

- 開発者は初心者のため、変更内容は具体的に説明する
- コミットは`git commit`実行前に必ずメッセージ案を提示し、承認を得る
- 複数ファイルにまたがる変更は、まとめて提示せず1ファイルずつ確認しながら進める
- 良いコミットの区切りが見えたら、聞かれなくても提案する
- 技術的な主張には検証用の検索キーワードや情報源を添える
- コメントを書く場合はJSDoc/PHPDoc形式の doc block にする（一行コメントで済ませない）

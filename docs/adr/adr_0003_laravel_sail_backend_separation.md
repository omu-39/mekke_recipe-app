# 0003. Laravel Sailとbackend/frontend分離構成を採用

## ステータス

確定

## コンテキスト

`development_workflow.md`ではモノレポ構成（1リポジトリにfrontend/backendをまとめる）を
採用することを決めていたが（8章参照）、実際の開発環境構築の中で以下を具体的に決める必要があった。

- Laravel側のDocker開発環境を、素のDockerfileで自作するか、Laravel公式の開発環境である
  Laravel Sailを使うか
- Laravelプロジェクトをリポジトリのどの階層に置くか
- `.env`をDocker Compose側とLaravel側でどう扱うか

開発の過程で、当初想定していなかった以下の問題が発生した。

- Docker build時に `groupadd: invalid group ID 'sail'` エラーが発生（`.env`に`WWWGROUP`・
  `WWWUSER`が未設定だったため）
- Laravelを`backend/`に移動したことで、Docker Composeが参照するパス（Sailのbuild context、
  volumeマウント先、テストDB作成用SQLのパス）がすべてズレる問題が発生
- Docker Composeが読むプロジェクトルートの`.env`と、Laravelが読む`backend/.env`が別物である
  ことに起因する設定の混乱（`APPLICATION IN PRODUCTION`と誤表示される等）

## 決定

- Laravelの開発環境は**Laravel Sail**を採用する（`compose.yaml`の`laravel.test`サービス）
- Laravelプロジェクト一式は**リポジトリ直下ではなく`backend/`ディレクトリ配下**に配置する
- React（Vite）は`frontend/`ディレクトリ配下に配置し、Sailとは別コンテナ（`frontend`サービス）
  として`compose.yaml`にまとめる
- `.env`は用途別に2つ管理する
  - リポジトリルートの`.env`：Docker Compose自体が読む（`WWWUSER`・`WWWGROUP`・DB接続情報等）
  - `backend/.env`：Laravelアプリケーション自体が読む（Git管理しない）
- WSL2上のUID/GIDに合わせ、ルートの`.env`に`WWWUSER=1000`・`WWWGROUP=1000`を明示的に設定する

## 影響

- Sail採用により、Laravel公式がメンテナンスするDocker環境をそのまま利用でき、
  自作Dockerfileの保守コストを避けられる
- `backend/`への移動に伴い、`compose.yaml`内のパス（build context・volume・
  テストDB用SQLのパス）をすべて`backend/`配下に読み替える必要がある。今後Laravel関連の
  パスを変更する際は、この対応関係を都度確認する必要がある
- `.env`が2箇所に分かれるため、「どちらの`.env`を編集すべきか」を毎回意識する必要がある。
  Docker Compose自体の設定（ポート・ユーザーID等）はルートの`.env`、Laravelアプリケーションの
  設定（DB接続・APP_KEY等）は`backend/.env`、という切り分けをチームで共有しておく必要がある
- `.gitignore`には`/backend/vendor/`・`/backend/.env`・`/frontend/node_modules/`を
  明示的に追加する必要がある

## 参照

- `development_workflow.md` 8章（将来チーム開発へ移行する際の拡張ポイント）
- Recipe App 開発引き継ぎ資料.md 4〜7章

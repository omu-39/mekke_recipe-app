import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { forgotPassword } from "../api/auth.api";
import { isAxiosError } from "axios";
import AuthCard from "../components/AuthCard";

function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);

  /**
   * spec_v2.md 7.3節の要件に従い、メールアドレスが未登録の場合も
   * 登録済みの場合と同じ「送信完了」表示にする（登録有無の推測を防ぐ）。
   * そのためエラー時もバリデーション由来（未入力・形式不正）以外は
   * 成功時と同じ画面に倒す。
   */
  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setErrors({});
    setIsSubmitting(true);

    try {
      await forgotPassword({ email });
      setIsSent(true);
    } catch (error) {
      if (isAxiosError(error) && error.response?.status === 422) {
        setErrors(error.response.data.errors);
      } else {
        setIsSent(true);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthCard subtitle="パスワードをリセット">
      {isSent ? (
        <p className="text-center text-app-ink">
          入力されたメールアドレス宛にパスワードリセット用のメールを送信しました。
          メール内のリンクから新しいパスワードを設定してください。
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div>
            <label htmlFor="email" className="block text-[16px] text-app-ink mb-1 font-bold">
              メールアドレス
            </label>
            <input
              id="email"
              type="email"
              placeholder="example@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-app-white border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-1 focus:ring-app-focus"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email[0]}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-app-ink text-white py-3 rounded-lg font-medium disabled:opacity-50 cursor-pointer"
          >
            {isSubmitting ? "送信中..." : "リセットメールを送信"}
          </button>
        </form>
      )}

      <p className="text-center text-sm text-app-gray underline mt-4">
        <Link to="/login">ログイン画面に戻る</Link>
      </p>
    </AuthCard>
  );
}

export default ForgotPasswordPage;

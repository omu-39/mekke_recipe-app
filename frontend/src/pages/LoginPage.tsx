import { useState, type FormEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../api/auth.api";
import { isAxiosError } from "axios";
import logo from "../assets/logo.svg";

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  /**
   * ログインフォームの送信処理。
   * Fortifyは未入力等の422バリデーションエラーに加え、
   * 認証失敗時も422（emailフィールドへのエラー）で返す規約のため、
   * どちらもerrors.emailとして同じ表示ロジックで扱える。
   */
  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setErrors({});
    setIsSubmitting(true);

    try {
      await loginUser({ email, password });
      navigate("/home");
    } catch (error) {
      if (isAxiosError(error) && error.response?.status === 422) {
        setErrors(error.response.data.errors);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-app-background">
      <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4" noValidate>
        <div className="flex flex-col items-center mb-10">
          <img src={logo} alt="メッケのロゴ" className="w-20 h-20 mb-2" />
          <h1 className="text-3xl font-bold text-app-ink">メッケ</h1>
        </div>

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
            className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-1 focus:ring-app-focus"
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email[0]}</p>
          )}
        </div>

        <div>
          <label htmlFor="password" className="block text-[16px] text-app-ink mb-1 font-bold">
            パスワード
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-1 focus:ring-app-focus"
          />
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">{errors.password[0]}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-app-ink text-white py-3 rounded-lg font-medium disabled:opacity-50 cursor-pointer mt-3"
        >
          {isSubmitting ? "ログイン中..." : "ログイン"}
        </button>

        <p className="text-center text-sm text-app-gray underline">
          <Link to="/register">新規登録はこちら</Link>
        </p>
        <p className="text-center text-sm text-app-gray underline">
          <Link to="/forgot-password">パスワードをお忘れの方はこちら</Link>
        </p>
      </form>
    </div>
  );
}

export default LoginPage;

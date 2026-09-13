import { useState, type FormEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerUser } from "../api/auth.api";
import { isAxiosError } from "axios";
import AuthCard from "../components/AuthCard";

function RegisterPage() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  /**
   * ユーザー登録フォームの送信処理。
   * Laravelのバリデーションエラーは422ステータスで返る規約のため、
   * それ以外のエラー（500等）はここでは意図的に無視し、画面には表示しない
   * （想定外エラーの扱いは今後の課題）。
   */
  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setErrors({});
    setIsSubmitting(true);

    try {
      await registerUser({
        name,
        email,
        password,
        password_confirmation: passwordConfirmation,
      });
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
    <AuthCard subtitle="新しくアカウントを作成">
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <div>
          <label htmlFor="name" className="block text-[16px] text-app-ink mb-1 font-bold">
            名前
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-1 focus:ring-app-focus"
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">{errors.name[0]}</p>
          )}
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
          <label htmlFor="password" className="block text-[16px] text-app-ink font-bold">
            パスワード
          </label>
          <p className="text-xs text-app-gray mb-1">
            8文字以上、英字と数字を含めてください
          </p>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-1 focus:ring-app-focus"
          />
          {errors.password && (
            <p className="text-red-500 text-[16px] mt-1">{errors.password[0]}</p>
          )}
        </div>

        <div>
          <label htmlFor="password_confirmation" className="block text-[16px] text-app-ink mb-1 font-bold">
            パスワード確認
          </label>
          <input
            id="password_confirmation"
            type="password"
            value={passwordConfirmation}
            onChange={(e) => setPasswordConfirmation(e.target.value)}
            className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-1 focus:ring-app-focus"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-app-ink text-white py-3 rounded-lg font-medium disabled:opacity-50 cursor-pointer mt-3"
        >
          {isSubmitting ? "登録中..." : "登録する"}
        </button>

        <p className="text-center text-sm text-app-gray underline">
          <Link to="/login">アカウントをお持ちの方はこちら</Link>
        </p>
      </form>
    </AuthCard>
  );
}

export default RegisterPage;

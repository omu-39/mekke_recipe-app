import { useState, type FormEvent } from "react";
import { useNavigate, useParams, useSearchParams, Link } from "react-router-dom";
import { resetPassword } from "../api/auth.api";
import { isAxiosError } from "axios";
import AuthCard from "../components/AuthCard";

function ResetPasswordPage() {
  const navigate = useNavigate();
  const { token } = useParams<{ token: string }>();
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email") ?? "";

  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setErrors({});
    setIsSubmitting(true);

    try {
      await resetPassword({
        token: token ?? "",
        email,
        password,
        password_confirmation: passwordConfirmation,
      });
      navigate("/login");
    } catch (error) {
      if (isAxiosError(error) && error.response?.status === 422) {
        setErrors(error.response.data.errors);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthCard subtitle="新しいパスワードを設定">
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <div>
          <label htmlFor="password" className="block text-[16px] text-app-ink font-bold">
            新しいパスワード
          </label>
          <p className="text-xs text-app-gray mb-1">
            8文字以上、英字と数字を含めてください
          </p>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-app-white border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-1 focus:ring-app-focus"
          />
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">{errors.password[0]}</p>
          )}
        </div>

        <div>
          <label htmlFor="password_confirmation" className="block text-[16px] text-app-ink mb-1 font-bold">
            新しいパスワード（確認）
          </label>
          <input
            id="password_confirmation"
            type="password"
            value={passwordConfirmation}
            onChange={(e) => setPasswordConfirmation(e.target.value)}
            className="w-full bg-app-white border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-1 focus:ring-app-focus"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-app-ink text-white py-3 rounded-lg font-medium disabled:opacity-50 cursor-pointer"
        >
          {isSubmitting ? "設定中..." : "パスワードを再設定する"}
        </button>

        <p className="text-center text-sm text-app-gray underline">
          <Link to="/login">ログイン画面に戻る</Link>
        </p>
      </form>
    </AuthCard>
  );
}

export default ResetPasswordPage;

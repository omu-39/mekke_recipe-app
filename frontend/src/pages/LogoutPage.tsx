import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../api/auth.api";
import logo from "../assets/logo.svg";

function LogoutPage() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogout = async () => {
    setIsSubmitting(true);
    await logoutUser();
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-app-background">
      <div className="w-full max-w-sm space-y-6 text-center">
        <div className="flex flex-col items-center">
          <img src={logo} alt="メッケのロゴ" className="w-20 h-20 mb-2" />
          <h1 className="text-3xl font-bold text-app-ink">メッケ</h1>
        </div>

        <button
          type="button"
          onClick={handleLogout}
          disabled={isSubmitting}
          className="w-full bg-app-ink text-white py-3 rounded-lg font-medium disabled:opacity-50 cursor-pointer"
        >
          {isSubmitting ? "ログアウト中..." : "ログアウト"}
        </button>
      </div>
    </div>
  );
}

export default LogoutPage;

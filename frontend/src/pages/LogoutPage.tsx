import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../api/auth.api";
import AuthCard from "../components/AuthCard";

function LogoutPage() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogout = async () => {
    setIsSubmitting(true);
    await logoutUser();
    navigate("/login");
  };

  return (
    <AuthCard subtitle="ログアウトしますか？">
      <button
        type="button"
        onClick={handleLogout}
        disabled={isSubmitting}
        className="w-full bg-app-ink text-white py-3 rounded-lg font-medium disabled:opacity-50 cursor-pointer"
      >
        {isSubmitting ? "ログアウト中..." : "ログアウト"}
      </button>
    </AuthCard>
  );
}

export default LogoutPage;

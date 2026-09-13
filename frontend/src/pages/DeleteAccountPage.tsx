import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { deleteAccount } from "../api/auth.api";
import AuthCard from "../components/AuthCard";

function DeleteAccountPage() {
  const navigate = useNavigate();
  const [isConfirming, setIsConfirming] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleDelete = async () => {
    setErrorMessage("");
    setIsSubmitting(true);
    try {
      await deleteAccount();
      navigate("/login");
    } catch {
      setErrorMessage("退会処理に失敗しました。時間をおいて再度お試しください。");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthCard subtitle="退会の手続き">
      {isConfirming ? (
        <div className="space-y-4 text-center">
          <p className="text-app-ink">
            本当に退会しますか？この操作は取り消せません。
          </p>
          {errorMessage && (
            <p className="text-red-500 text-sm">{errorMessage}</p>
          )}
          <button
            type="button"
            onClick={handleDelete}
            disabled={isSubmitting}
            className="w-full bg-red-600 text-white py-3 rounded-lg font-medium disabled:opacity-50 cursor-pointer"
          >
            {isSubmitting ? "処理中..." : "退会する"}
          </button>
          <button
            type="button"
            onClick={() => setIsConfirming(false)}
            className="w-full bg-app-white border border-gray-300 text-app-ink py-3 rounded-lg font-medium cursor-pointer"
          >
            キャンセル
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setIsConfirming(true)}
          className="w-full bg-app-ink text-white py-3 rounded-lg font-medium cursor-pointer"
        >
          退会手続きへ進む
        </button>
      )}
    </AuthCard>
  );
}

export default DeleteAccountPage;

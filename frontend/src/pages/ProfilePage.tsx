import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { Link } from "react-router-dom";
import {
  fetchProfile,
  updateProfileInformation,
  updateAvatar,
} from "../api/profile.api";
import type { User } from "../types/User.types";
import { isAxiosError } from "axios";

function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    fetchProfile().then((data) => {
      setUser(data);
      setName(data.name);
      setEmail(data.email);
    });
  }, []);

  const handleSave = async (event: FormEvent) => {
    event.preventDefault();
    setErrors({});
    setIsSaving(true);

    try {
      await updateProfileInformation({ name, email });
      setUser((prev) => (prev ? { ...prev, name, email } : prev));
    } catch (error) {
      if (isAxiosError(error) && error.response?.status === 422) {
        setErrors(error.response.data.errors);
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleAvatarChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const updatedUser = await updateAvatar(file);
      setUser(updatedUser);
    } finally {
      setIsUploading(false);
    }
  };

  if (!user) {
    return <p>読み込み中...</p>;
  }

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-app-ink">プロフィール設定</h1>
          <p className="text-sm text-app-gray mt-1">
            アカウント情報の確認と変更ができます
          </p>
        </div>
        <div className="flex items-center gap-2">
          {user.avatar_path ? (
            <img
              src={`http://localhost/storage/${user.avatar_path}`}
              alt="アイコン画像"
              className="w-8 h-8 rounded-full object-cover"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-gray-200" />
          )}
          <span className="text-sm text-app-ink">{user.name}</span>
        </div>
      </div>

      <div className="bg-app-white rounded-2xl shadow-md p-8 mb-6">
        <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-200">
          <label className="cursor-pointer">
            {user.avatar_path ? (
              <img
                src={`http://localhost/storage/${user.avatar_path}`}
                alt="アイコン画像"
                className="w-16 h-16 rounded-full object-cover"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-gray-200" />
            )}
            <input
              type="file"
              accept="image/png,image/jpeg"
              onChange={handleAvatarChange}
              className="hidden"
            />
          </label>
          <div>
            <label className="inline-block bg-app-white border border-gray-300 text-app-ink text-sm px-4 py-2 rounded-lg cursor-pointer">
              {isUploading ? "アップロード中..." : "画像をアップロード"}
              <input
                type="file"
                accept="image/png,image/jpeg"
                onChange={handleAvatarChange}
                className="hidden"
              />
            </label>
            <p className="text-xs text-app-gray mt-1">JPG, PNG形式 最大2MB</p>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label
              htmlFor="name"
              className="block text-[16px] text-app-ink mb-1 font-bold"
            >
              名前（ニックネーム）
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-app-white border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-1 focus:ring-app-focus"
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name[0]}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-[16px] text-app-ink mb-1 font-bold"
            >
              メールアドレス
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-app-white border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-1 focus:ring-app-focus"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email[0]}</p>
            )}
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={isSaving}
              className="bg-app-ink text-white px-6 py-3 rounded-lg font-medium disabled:opacity-50 cursor-pointer"
            >
              {isSaving ? "保存中..." : "変更を保存"}
            </button>
            <Link
              to="/forgot-password"
              className="bg-app-white border border-gray-300 text-app-ink px-6 py-3 rounded-lg font-medium flex items-center"
            >
              パスワードを変更する
            </Link>
          </div>
        </form>
      </div>

      <div>
        <h2 className="text-lg font-bold text-app-ink mb-3">
          その他のメニュー
        </h2>
        <div className="bg-app-white rounded-2xl shadow-md divide-y divide-gray-200">
          <Link
            to="/recipes/mine"
            className="flex items-center justify-between px-6 py-4 text-app-ink"
          >
            投稿レシピ一覧
            <span>›</span>
          </Link>
          <Link
            to="/logout"
            className="flex items-center justify-between px-6 py-4 text-app-ink"
          >
            ログアウト
            <span>›</span>
          </Link>
          <Link
            to="/delete-account"
            className="flex items-center justify-between px-6 py-4 text-red-600"
          >
            退会（アカウント削除）
            <span>›</span>
          </Link>
        </div>
      </div>
    </>
  );
}

export default ProfilePage;

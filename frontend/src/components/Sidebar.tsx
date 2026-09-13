import { NavLink } from "react-router-dom";
import logo from "../assets/logo.svg";

const navItems = [
  { to: "/home", label: "ホーム" },
  { to: "/ingredients", label: "食材管理" },
  { to: "/favorites", label: "お気に入り" },
  { to: "/shopping-list", label: "買い物リスト" },
  { to: "/recipes/create", label: "レシピ投稿" },
  { to: "/profile", label: "プロフィール" },
  { to: "/logout", label: "ログアウト" },
];

function Sidebar() {
  return (
    <aside className="w-60 min-h-screen bg-app-white border-r border-gray-200 p-6">
      <div className="flex items-center gap-2 mb-8">
        <img src={logo} alt="メッケのロゴ" className="w-8 h-8" />
        <span className="text-lg font-bold text-app-ink">メッケ</span>
      </div>

      <nav className="space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `block px-3 py-2 rounded-lg text-sm ${
                isActive
                  ? "bg-app-background text-app-ink font-bold"
                  : "text-app-gray"
              }`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}

export default Sidebar;

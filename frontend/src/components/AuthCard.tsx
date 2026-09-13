import type { ReactNode } from "react";
import logo from "../assets/logo.svg";

interface AuthCardProps {
  subtitle: string;
  children: ReactNode;
}

function AuthCard({ subtitle, children }: AuthCardProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-app-background px-4">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-md p-8">
        <div className="flex flex-col items-center mb-6">
          <div className="bg-app-background rounded-xl p-3 mb-3">
            <img src={logo} alt="メッケのロゴ" className="w-10 h-10" />
          </div>
          <h1 className="text-2xl font-bold text-app-ink">メッケ</h1>
          <p className="text-sm text-app-gray mt-1">{subtitle}</p>
        </div>
        {children}
      </div>
    </div>
  );
}

export default AuthCard;

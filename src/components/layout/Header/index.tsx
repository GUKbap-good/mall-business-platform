"use client";

import Link from "next/link";
import {
  Bell, LogIn, Store, Home, FileText, Users,
  Wrench, ShoppingCart, TrendingUp,
} from "lucide-react";
import { usePathname } from "next/navigation";

const navItems = [
  { label: "홈", href: "/", Icon: Home },
  { label: "지원사업", href: "/grants", Icon: FileText },
  { label: "커뮤니티", href: "/community", Icon: Users },
  { label: "서비스", href: "/dx", Icon: Wrench },
  { label: "시세", href: "/price", Icon: TrendingUp },
  { label: "광장", href: "/marketplace", Icon: ShoppingCart },
];

export default function Header() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center gap-4">
        {/* 로고 */}
        <Link href="/" className="flex items-center gap-2 shrink-0 mr-2">
          <div className="w-9 h-9 bg-[#EA4F1E] rounded-xl flex items-center justify-center">
            <Store className="w-5 h-5 text-white" />
          </div>
          <span className="text-lg font-bold text-gray-900">소상<span className="text-[#EA4F1E]">광장</span></span>
        </Link>

        {/* 네비게이션 */}
        <nav className="hidden md:flex items-center justify-center gap-1 flex-1 overflow-x-auto scrollbar-none">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={`flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-md transition-colors relative shrink-0 whitespace-nowrap ${
                isActive(item.href)
                  ? "text-[#EA4F1E]"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <item.Icon className="w-4 h-4" />
              {item.label}
              {isActive(item.href) && (
                <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-[#EA4F1E] rounded-full" />
              )}
            </Link>
          ))}
        </nav>

        {/* 우측 액션 */}
        <div className="flex items-center gap-3 shrink-0 ml-auto">
          <button className="relative p-2 text-gray-500 hover:text-gray-700 transition-colors">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
          </button>
          <Link
            href="/login"
            className="hidden sm:flex items-center gap-1 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
          >
            <LogIn className="w-4 h-4" />
            로그인
          </Link>
          <Link
            href="/register"
            className="px-4 py-2 text-sm font-semibold text-white bg-[#EA4F1E] hover:bg-[#D44418] rounded-lg transition-colors"
          >
            무료 가입
          </Link>
        </div>
      </div>
    </header>
  );
}

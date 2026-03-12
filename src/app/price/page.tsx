"use client";

import { useState } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { TrendingUp, Search, Star, RefreshCw, Flame, Snowflake } from "lucide-react";

type Category = "전체" | "수산물" | "축산물" | "채소" | "과일" | "곡물/유제품";

interface PriceItem {
  id: number;
  name: string;
  emoji: string;
  category: Exclude<Category, "전체">;
  unit: string;
  updatedAt: string;
  price: number;
  change: number;
  changeRate: number;
  isVolatile: boolean;
}

const priceData: PriceItem[] = [
  { id: 1,  name: "광어(양식)",    emoji: "🐟", category: "수산물",    unit: "/kg",  updatedAt: "오늘 06:00", price: 18500,  change: 1200,   changeRate: 6.9,  isVolatile: true },
  { id: 2,  name: "참돔(자연산)",  emoji: "🎣", category: "수산물",    unit: "/kg",  updatedAt: "오늘 06:00", price: 32000,  change: -2000,  changeRate: -5.9, isVolatile: true },
  { id: 3,  name: "고등어",        emoji: "🐡", category: "수산물",    unit: "/마리", updatedAt: "오늘 06:00", price: 4800,   change: 300,    changeRate: 6.7,  isVolatile: false },
  { id: 4,  name: "새우(흰다리)",  emoji: "🦐", category: "수산물",    unit: "/kg",  updatedAt: "오늘 06:00", price: 12800,  change: 800,    changeRate: 6.7,  isVolatile: true },
  { id: 5,  name: "한우(1++등심)", emoji: "🥩", category: "축산물",    unit: "/kg",  updatedAt: "오늘 07:00", price: 98000,  change: -3000,  changeRate: -3.0, isVolatile: false },
  { id: 6,  name: "삼겹살(국산)", emoji: "🍖", category: "축산물",    unit: "/kg",  updatedAt: "오늘 07:00", price: 22500,  change: 500,    changeRate: 2.3,  isVolatile: false },
  { id: 7,  name: "닭(육계)",      emoji: "🍗", category: "축산물",    unit: "/마리", updatedAt: "오늘 07:00", price: 6800,   change: 0,      changeRate: 0,    isVolatile: false },
  { id: 8,  name: "계란(30구)",    emoji: "🥚", category: "곡물/유제품", unit: "/판", updatedAt: "오늘 08:00", price: 7200,   change: 400,    changeRate: 5.9,  isVolatile: true },
  { id: 9,  name: "대파",          emoji: "🌿", category: "채소",      unit: "/kg",  updatedAt: "오늘 05:00", price: 3200,   change: -800,   changeRate: -20,  isVolatile: true },
  { id: 10, name: "양파",          emoji: "🧅", category: "채소",      unit: "/kg",  updatedAt: "오늘 05:00", price: 1800,   change: -200,   changeRate: -10,  isVolatile: false },
  { id: 11, name: "배추",          emoji: "🥬", category: "채소",      unit: "/포기", updatedAt: "오늘 05:00", price: 4500,   change: 1500,   changeRate: 50,   isVolatile: true },
  { id: 12, name: "쌀(20kg)",      emoji: "🌾", category: "곡물/유제품", unit: "/포", updatedAt: "오늘 08:00", price: 52000,  change: 0,      changeRate: 0,    isVolatile: false },
];

const alerts = [
  { type: "up",   icon: Flame,     text: "배추 한파 영향으로 가격 급등 (전주 대비 +50%)", keyword: "배추" },
  { type: "down", icon: Snowflake, text: "대파 출하량 증가로 가격 하락세 (전주 대비 -20%)", keyword: "대파" },
  { type: "up",   icon: Flame,     text: "새우 수입량 감소로 가격 상승 추세", keyword: "새우" },
];

const categories: Category[] = ["전체", "수산물", "축산물", "채소", "과일", "곡물/유제품"];

export default function PricePage() {
  const [selectedCategory, setSelectedCategory] = useState<Category>("전체");
  const [searchQuery, setSearchQuery] = useState("");
  const [bookmarks, setBookmarks] = useState<number[]>([]);

  const toggleBookmark = (id: number) => {
    setBookmarks((prev) =>
      prev.includes(id) ? prev.filter((b) => b !== id) : [...prev, id]
    );
  };

  const filtered = priceData.filter((item) => {
    const matchCat = selectedCategory === "전체" || item.category === selectedCategory;
    const matchSearch = item.name.includes(searchQuery);
    return matchCat && matchSearch;
  });

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 py-10">
          {/* 페이지 헤더 */}
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-teal-50 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-teal-500" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">식자재 시세</h1>
                <p className="text-sm text-gray-500 mt-0.5">실시간 식자재 가격 · 시세 변동 추이</p>
              </div>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-gray-400 mt-1">
              <RefreshCw className="w-3.5 h-3.5" />
              최종 업데이트: 오늘 08:00
            </div>
          </div>

          {/* 알림 배너 */}
          <div className="space-y-2 mb-6">
            {alerts.map((alert, i) => {
              const Icon = alert.icon;
              const isUp = alert.type === "up";
              return (
                <div
                  key={i}
                  className={`flex items-center gap-2.5 px-4 py-3 rounded-xl text-sm ${
                    isUp
                      ? "bg-red-50 border border-red-100 text-red-700"
                      : "bg-teal-50 border border-teal-100 text-teal-700"
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>
                    <strong>{alert.keyword}</strong> {alert.text.replace(alert.keyword, "").trimStart()}
                  </span>
                </div>
              );
            })}
          </div>

          {/* 검색 */}
          <div className="relative mb-5">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="식자재 검색 (예: 광어, 삼겹살, 대파...)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm text-gray-700 placeholder-gray-400 outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-50 transition"
            />
          </div>

          {/* 카테고리 탭 */}
          <div className="flex gap-2 mb-5 flex-wrap">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === cat
                    ? "bg-teal-500 text-white"
                    : "bg-white border border-gray-200 text-gray-600 hover:border-teal-300 hover:text-teal-600"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* 가격 목록 */}
          <div className="space-y-2">
            {filtered.map((item) => {
              const isUp = item.change > 0;
              const isDown = item.change < 0;
              const isFlat = item.change === 0;
              const isBookmarked = bookmarks.includes(item.id);

              return (
                <div
                  key={item.id}
                  className="bg-white border border-gray-100 rounded-xl px-5 py-4 flex items-center gap-4"
                >
                  {/* 이모지 아이콘 */}
                  <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-xl shrink-0">
                    {item.emoji}
                  </div>

                  {/* 이름 + 배지 + 단위/시간 */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="font-semibold text-gray-900 text-sm">{item.name}</span>
                      {item.isVolatile && (
                        <span className="px-1.5 py-0.5 bg-orange-100 text-orange-600 text-xs rounded font-medium">
                          변동
                        </span>
                      )}
                      <span className="px-1.5 py-0.5 bg-gray-100 text-gray-500 text-xs rounded">
                        {item.category}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 mt-0.5 text-xs text-gray-400">
                      <span>{item.unit}</span>
                      <span>·</span>
                      <span>오늘 {item.updatedAt.replace("오늘 ", "")}</span>
                    </div>
                  </div>

                  {/* 가격 + 변동 */}
                  <div className="text-right shrink-0">
                    <p className="font-bold text-gray-900 text-base">
                      {item.price.toLocaleString()}원
                    </p>
                    {isFlat ? (
                      <p className="text-xs text-gray-400 mt-0.5">— 보합</p>
                    ) : (
                      <p className={`text-xs mt-0.5 font-medium ${isUp ? "text-red-500" : "text-blue-500"}`}>
                        {isUp ? "↑" : "↓"}{Math.abs(item.change).toLocaleString()}원
                        ({isUp ? "+" : ""}{item.changeRate}%)
                      </p>
                    )}
                  </div>

                  {/* 북마크 */}
                  <button
                    onClick={() => toggleBookmark(item.id)}
                    className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center shrink-0 hover:border-teal-300 transition-colors"
                  >
                    <Star
                      className={`w-4 h-4 transition-colors ${
                        isBookmarked ? "fill-teal-400 text-teal-400" : "text-gray-300"
                      }`}
                    />
                  </button>
                </div>
              );
            })}

            {filtered.length === 0 && (
              <div className="bg-white border border-gray-100 rounded-xl py-16 flex flex-col items-center text-center">
                <Search className="w-10 h-10 text-gray-200 mb-3" />
                <p className="text-gray-400 font-medium">검색 결과가 없습니다</p>
                <p className="text-sm text-gray-300 mt-1">다른 검색어나 카테고리를 선택해보세요</p>
              </div>
            )}
          </div>

          {/* 하단 안내 */}
          <p className="text-xs text-gray-400 text-center mt-8 leading-relaxed">
            ⓘ 가격 정보는 가락시장 경매가, 축산물품질평가원, 수산물 산지 경매 데이터를 기준으로 합니다.<br />
            실제 매입가는 유통 경로와 물량에 따라 차이가 있을 수 있습니다. 매일 오전 업데이트됩니다.
          </p>
        </div>
      </div>
      <Footer />
    </>
  );
}

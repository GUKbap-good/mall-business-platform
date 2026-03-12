"use client";

import { useState } from "react";
import {
  ShoppingCart,
  Camera,
  MapPin,
  Clock,
  Heart,
  MessageCircle,
  Plus,
  Gift,
  ChevronDown,
  Users,
  ShoppingBasket,
} from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

type MarketTab = "직거래 장터" | "공동구매" | "나눔 섹션";

interface GroupBuy {
  id: number;
  title: string;
  current: number;
  total: number;
  expiry: string;
  price: string;
  originalPrice: string;
  pct: number;
}

const GROUP_BUYS: GroupBuy[] = [
  { id: 1, title: "전주 로컬 유기농 쌀 공동구매 (10kg)", current: 18, total: 30, expiry: "~2026.03.05", price: "32,000원", originalPrice: "45,000원", pct: 60 },
  { id: 2, title: "친환경 종이 포장봉기 공동구매", current: 12, total: 20, expiry: "~2026.03.10", price: "15,000원/500개", originalPrice: "22,000원/500개", pct: 60 },
  { id: 3, title: "전주 지역 막걸리 공동구매 (업소용)", current: 22, total: 25, expiry: "~2026.03.03", price: "48,000원/20병", originalPrice: "65,000원/20병", pct: 88 },
  { id: 4, title: "전주 한우 등심 공동구매", current: 8, total: 15, expiry: "~2026.03.12", price: "85,000원/kg", originalPrice: "120,000원/kg", pct: 53 },
];
type ItemCategory =
  | "전체"
  | "주방기기"
  | "인테리어"
  | "포스/결제"
  | "냉장/냉동"
  | "테이블/의자"
  | "간판/사인"
  | "기타";
type ItemCondition = "상" | "중" | "하";

interface MarketItem {
  id: number;
  title: string;
  price: number;
  condition: ItemCondition;
  category: Exclude<ItemCategory, "전체">;
  description: string;
  location: string;
  timeAgo: string;
  likes: number;
  comments: number;
  hasImage: boolean;
  liked: boolean;
}

interface ShareItem {
  id: number;
  title: string;
  description: string;
  storeType: string;
  location: string;
  timeAgo: string;
  expiry: string;
  claimed: boolean;
}

const CATEGORIES: ItemCategory[] = [
  "전체",
  "주방기기",
  "인테리어",
  "포스/결제",
  "냉장/냉동",
  "테이블/의자",
  "간판/사인",
  "기타",
];

const CONDITION_COLOR: Record<ItemCondition, string> = {
  상: "#22C55E",
  중: "#F59E0B",
  하: "#EF4444",
};

const INITIAL_ITEMS: MarketItem[] = [
  {
    id: 1,
    title: "업소용 냉장고 (유니크 45박스)",
    price: 800000,
    condition: "상",
    category: "냉장/냉동",
    description: "1년 사용, 상태 양호. 매장 리모델링으로 판매합니다. 직접 픽업.",
    location: "서울 강남구",
    timeAgo: "2시간 전",
    likes: 12,
    comments: 5,
    hasImage: true,
    liked: false,
  },
  {
    id: 2,
    title: "2인용 테이블 5개 세트",
    price: 150000,
    condition: "중",
    category: "테이블/의자",
    description: "카페 폐업으로 판매. 테이블 5개 + 의자 10개 세트. 상태 무난합니다.",
    location: "서울 마포구",
    timeAgo: "5시간 전",
    likes: 8,
    comments: 3,
    hasImage: true,
    liked: false,
  },
  {
    id: 3,
    title: "포스기 (키오스크형) + 프린터",
    price: 350000,
    condition: "상",
    category: "포스/결제",
    description: "2024년 구매, 거의 새것. 프로그램 초기화 완료. 터치스크린 + 영수증 프린터 포함.",
    location: "경기 수원시",
    timeAgo: "1일 전",
    likes: 23,
    comments: 8,
    hasImage: false,
    liked: true,
  },
  {
    id: 4,
    title: "LED 간판 (세로형 1200x400)",
    price: 120000,
    condition: "중",
    category: "간판/사인",
    description: "업종 변경으로 판매. LED 정상 작동, 디자인 변경 가능.",
    location: "서울 종로구",
    timeAgo: "1일 전",
    likes: 4,
    comments: 2,
    hasImage: false,
    liked: false,
  },
  {
    id: 5,
    title: "업소용 가스레인지 (4구)",
    price: 200000,
    condition: "상",
    category: "주방기기",
    description: "2년 사용, 화력 좋습니다. 전문 업체 수리 이력 없음.",
    location: "부산 해운대구",
    timeAgo: "2일 전",
    likes: 11,
    comments: 4,
    hasImage: false,
    liked: false,
  },
];

const INITIAL_SHARES: ShareItem[] = [
  {
    id: 1,
    title: "유통기한 임박 밀가루 (25kg) 5포",
    description: "유통기한 2주 남은 밀가루입니다. 제빵/제과 하시는 분 가져가세요.",
    storeType: "빵집사장",
    location: "서울 강서구",
    timeAgo: "3시간 전",
    expiry: "2026.03.10",
    claimed: false,
  },
  {
    id: 2,
    title: "신메뉴 시식용 소스 샘플 (10박스)",
    description: "신제품 런칭 전 샘플입니다. 외식업 사장님들 테스트해보세요.",
    storeType: "소스공장",
    location: "서울 마포구",
    timeAgo: "6시간 전",
    expiry: "2026.04.01",
    claimed: false,
  },
  {
    id: 3,
    title: "일회용 포장 용기 (대) 200개",
    description: "사이즈 잘못 주문해서 나눔합니다. 상태 새것.",
    storeType: "포장마차",
    location: "경기 성남시",
    timeAgo: "1일 전",
    expiry: "",
    claimed: false,
  },
];

/* ─── 등록 폼 ─── */
function RegisterForm({ onClose }: { onClose: () => void }) {
  const [type, setType] = useState("판매");
  const [category, setCategory] = useState("주방기기");
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
      <h2 className="text-lg font-bold text-gray-900 mb-6">물품 등록</h2>

        <div className="grid grid-cols-2 gap-4 mb-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">유형</label>
            <div className="relative">
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full appearance-none border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-[#EA4F1E]/30 focus:border-[#EA4F1E] pr-8"
              >
                <option>판매</option>
                <option>나눔</option>
              </select>
              <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">카테고리</label>
            <div className="relative">
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full appearance-none border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-[#EA4F1E]/30 focus:border-[#EA4F1E] pr-8"
              >
                {CATEGORIES.filter((c) => c !== "전체").map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>

        <div className="mb-5">
          <label className="block text-sm font-medium text-gray-700 mb-1.5">제목</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="물품명을 입력하세요"
            className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#EA4F1E]/30 focus:border-[#EA4F1E]"
          />
        </div>

        <div className="grid grid-cols-2 gap-4 mb-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">가격</label>
            <input
              type="text"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="가격 (원)"
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#EA4F1E]/30 focus:border-[#EA4F1E]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">위치</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="거래 희망 지역"
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#EA4F1E]/30 focus:border-[#EA4F1E]"
            />
          </div>
        </div>

        <div className="mb-5">
          <label className="block text-sm font-medium text-gray-700 mb-1.5">상세 설명</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="물품 상태, 사용 기간 등을 작성해주세요"
            rows={4}
            className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#EA4F1E]/30 focus:border-[#EA4F1E] resize-none"
          />
        </div>

        <div className="mb-8">
          <label className="block text-sm font-medium text-gray-700 mb-1.5">사진</label>
          <div className="border-2 border-dashed border-gray-200 rounded-lg py-10 flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-[#EA4F1E]/40 hover:bg-[#FFF7EF]/30 transition-colors">
            <Camera className="w-7 h-7 text-gray-400" />
            <p className="text-sm text-gray-400">클릭하여 사진을 업로드하세요 (최대 5장)</p>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-6 py-2.5 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            취소
          </button>
          <button
            onClick={onClose}
            className="px-6 py-2.5 text-sm font-medium text-white bg-[#EA4F1E] rounded-lg hover:bg-[#D44418] transition-colors"
          >
            등록
          </button>
        </div>
      </div>
  );
}

/* ─── 상품 카드 ─── */
function ItemCard({
  item,
  onToggleLike,
}: {
  item: MarketItem;
  onToggleLike: (id: number) => void;
}) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-md transition-shadow cursor-pointer">
      <div className="relative aspect-[4/3] bg-gray-100">
        <div className="w-full h-full flex items-center justify-center">
          <Camera className={`w-10 h-10 ${item.hasImage ? "text-gray-400" : "text-gray-300"}`} />
        </div>
        <span
          className="absolute top-3 left-3 text-xs font-semibold px-2 py-0.5 rounded"
          style={{
            backgroundColor: `${CONDITION_COLOR[item.condition]}22`,
            color: CONDITION_COLOR[item.condition],
          }}
        >
          중고·{item.condition}
        </span>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleLike(item.id);
          }}
          className="absolute top-3 right-3 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm hover:scale-110 transition-transform"
        >
          <Heart
            className="w-4 h-4"
            fill={item.liked ? "#EA4F1E" : "none"}
            stroke={item.liked ? "#EA4F1E" : "#9CA3AF"}
          />
        </button>
      </div>

      <div className="p-4">
        <h3 className="text-sm font-semibold text-gray-900 mb-1 truncate">{item.title}</h3>
        <p className="text-base font-bold text-[#EA4F1E] mb-2">
          {item.price.toLocaleString()}원
        </p>
        <p className="text-xs text-gray-500 mb-3 line-clamp-2 leading-relaxed">
          {item.description}
        </p>
        <div className="flex items-center justify-between text-xs text-gray-400 mb-3">
          <span className="flex items-center gap-1">
            <MapPin className="w-3 h-3" />
            {item.location}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {item.timeAgo}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 text-xs text-gray-400">
            <span className="flex items-center gap-1">
              <Heart className="w-3.5 h-3.5" />
              {item.likes}
            </span>
            <span className="flex items-center gap-1">
              <MessageCircle className="w-3.5 h-3.5" />
              {item.comments}
            </span>
          </div>
          <button className="px-4 py-1.5 text-xs font-semibold text-white bg-[#EA4F1E] rounded-lg hover:bg-[#D44418] transition-colors flex items-center gap-1.5">
            <MessageCircle className="w-3.5 h-3.5" />
            채팅하기
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── 메인 페이지 ─── */
export default function MarketplacePage() {
  const [activeTab, setActiveTab] = useState<MarketTab>("직거래 장터");
  const [showRegister, setShowRegister] = useState(false);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<ItemCategory>("전체");
  const [items, setItems] = useState<MarketItem[]>(INITIAL_ITEMS);
  const [shares, setShares] = useState<ShareItem[]>(INITIAL_SHARES);

  const toggleLike = (id: number) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, liked: !item.liked, likes: item.liked ? item.likes - 1 : item.likes + 1 }
          : item
      )
    );
  };

  const toggleClaim = (id: number) => {
    setShares((prev) =>
      prev.map((s) => (s.id === id ? { ...s, claimed: !s.claimed } : s))
    );
  };

  const filteredItems = items.filter((item) => {
    const matchCategory = activeCategory === "전체" || item.category === activeCategory;
    const matchSearch =
      search === "" ||
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.description.toLowerCase().includes(search.toLowerCase());
    return matchCategory && matchSearch;
  });

  const pageHeader = (
    <div className="flex items-start justify-between mb-8">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-[#FFF7EF] rounded-xl flex items-center justify-center">
          <ShoppingCart className="w-5 h-5 text-[#EA4F1E]" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">중고 거래소</h1>
          <p className="text-sm text-gray-500 mt-0.5">B2B 식자재 · 집기 직거래 및 나눔</p>
        </div>
      </div>
      <button
        onClick={() => setShowRegister((prev) => !prev)}
        className="flex items-center gap-2 px-5 py-2.5 bg-[#EA4F1E] text-white text-sm font-semibold rounded-xl hover:bg-[#D44418] transition-colors"
      >
        <Plus className={`w-4 h-4 transition-transform ${showRegister ? "rotate-45" : ""}`} />
        {showRegister ? "닫기" : "등록하기"}
      </button>
    </div>
  );

  const tabBar = (
    <div className="flex gap-1 mb-8">
      {(["직거래 장터", "공동구매", "나눔 섹션"] as MarketTab[]).map((tab) => (
        <button
          key={tab}
          onClick={() => { setActiveTab(tab); setShowRegister(false); }}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
            activeTab === tab ? "bg-[#EA4F1E] text-white" : "text-gray-500 hover:bg-gray-100"
          }`}
        >
          {tab === "직거래 장터" ? <ShoppingCart className="w-4 h-4" /> : tab === "공동구매" ? <ShoppingBasket className="w-4 h-4" /> : <Gift className="w-4 h-4" />}
          {tab}
        </button>
      ))}
    </div>
  );

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-10">
          {pageHeader}

          {/* 인라인 등록 폼 */}
          {showRegister && (
            <div className="mb-8">
              <RegisterForm onClose={() => setShowRegister(false)} />
            </div>
          )}

          {tabBar}

          {/* ── 직거래 장터 ── */}
          {activeTab === "직거래 장터" && (
            <>
              <div className="relative mb-5">
                <svg
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.35-4.35" />
                </svg>
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="물품 검색..."
                  className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#EA4F1E]/30 focus:border-[#EA4F1E]"
                />
              </div>

              <div className="flex flex-wrap gap-2 mb-7">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                      activeCategory === cat
                        ? "bg-[#EA4F1E] text-white"
                        : "bg-white border border-gray-200 text-gray-600 hover:border-[#EA4F1E] hover:text-[#EA4F1E]"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {filteredItems.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {filteredItems.map((item) => (
                    <ItemCard key={item.id} item={item} onToggleLike={toggleLike} />
                  ))}
                </div>
              ) : (
                <div className="py-24 text-center text-gray-400 text-sm">
                  검색 결과가 없습니다.
                </div>
              )}
            </>
          )}

          {/* ── 나눔 섹션 ── */}
          {/* ── 공동구매 ── */}
          {activeTab === "공동구매" && (
            <>
              <div className="mb-6">
                <h2 className="text-lg font-bold text-gray-900">사장님 공동 구매</h2>
                <p className="text-sm text-gray-500 mt-0.5">지역 사장님들과 함께 식자재·비품을 저렴하게 구매하세요</p>
              </div>
              <div className="space-y-3">
                {GROUP_BUYS.map((g) => (
                  <div key={g.id} className="bg-white rounded-xl border border-gray-100 px-6 py-5">
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div className="flex-1 min-w-0">
                        <p className="text-base font-bold text-gray-900 mb-1">{g.title}</p>
                        <div className="flex items-center gap-3 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <Users className="w-3.5 h-3.5" />
                            {g.current}/{g.total}명
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" />
                            {g.expiry}
                          </span>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-lg font-bold text-[#EA4F1E]">{g.price}</p>
                        <p className="text-xs text-gray-400 line-through">{g.originalPrice}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#EA4F1E] rounded-full transition-all"
                          style={{ width: `${g.pct}%` }}
                        />
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-gray-500 w-16">{g.pct}% 달성</span>
                        <button className="px-4 py-1.5 bg-[#EA4F1E] hover:bg-[#D44418] text-white text-xs font-semibold rounded-lg transition-colors">
                          참여하기
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {activeTab === "나눔 섹션" && (
            <>
              <div className="flex items-center gap-4 bg-green-50 border border-green-100 rounded-2xl px-6 py-5 mb-7">
                <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center shrink-0">
                  <Gift className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-bold text-green-800">나눔으로 따뜻한 사장님 커뮤니티</p>
                  <p className="text-xs text-green-600 mt-0.5">
                    유통기한 임박 식자재나 불필요한 물품들을 이웃 사장님께 나눠주세요
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                {shares.map((share) => (
                  <div
                    key={share.id}
                    className="bg-white rounded-2xl border border-gray-100 px-6 py-5 flex items-center gap-4 hover:shadow-sm transition-shadow"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-green-100 text-green-700">
                          한 나눔
                        </span>
                        <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
                          {share.storeType}
                        </span>
                      </div>
                      <h3 className="text-sm font-semibold text-gray-900 mb-1 truncate">
                        {share.title}
                      </h3>
                      <p className="text-xs text-gray-500 mb-2 line-clamp-1">{share.description}</p>
                      <div className="flex items-center gap-4 text-xs text-gray-400">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {share.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {share.timeAgo}
                        </span>
                        {share.expiry && (
                          <span className="flex items-center gap-1 text-[#EA4F1E]">
                            <Clock className="w-3 h-3" />~{share.expiry}
                          </span>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => toggleClaim(share.id)}
                      className={`shrink-0 px-5 py-2 text-sm font-semibold rounded-xl transition-colors ${
                        share.claimed
                          ? "bg-gray-200 text-gray-500"
                          : "bg-green-500 text-white hover:bg-green-600"
                      }`}
                    >
                      {share.claimed ? "신청 완료" : "받겠습니다"}
                    </button>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}

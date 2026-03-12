"use client";

import { useState } from "react";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import {
  MapPin, Search, Star, Clock, Phone, Heart,
  Ticket, Megaphone, Edit3,
} from "lucide-react";

type LocalTab = "동네 가게" | "쿠폰/할인" | "홍보관";
type StoreCategory = "전체" | "외식업" | "카페/베이커리" | "서비스업";

interface Store {
  id: number;
  name: string;
  category: string;
  storeType: StoreCategory;
  area: string;
  rating: number;
  reviews: number;
  desc: string;
  address: string;
  hours: string;
  phone: string;
  hasCoupon: boolean;
  isOpen: boolean;
  color: string;
  mapX: number;
  mapY: number;
}

interface Coupon {
  id: number;
  storeName: string;
  title: string;
  condition: string;
  expiry: string;
  code: string;
}

interface PromoPost {
  id: number;
  storeName: string;
  title: string;
  timeAgo: string;
  likes: number;
  storeColor: string;
}

const AREAS = ["전체", "한옥마을", "객리단길", "남부시장", "딱진공원", "전주에"];
const AREA_COUNTS: Record<string, number> = {
  한옥마을: 48, 객리단길: 32, 남부시장: 27, 딱진공원: 15, 전주에: 22,
};

const STORES: Store[] = [
  { id: 1, name: "한옥마을 비빔밥집", category: "한식", storeType: "외식업", area: "한옥마을", rating: 4.8, reviews: 342, desc: "전통 돌솥비빔밥과 콩나물국밥을 전주 정통 방식으로", address: "전주시 완산구 은행로 65 (한옥마을)", hours: "10:30 - 21:00", phone: "063-231-1234", hasCoupon: true, isOpen: true, color: "#EA4F1E", mapX: 52, mapY: 38 },
  { id: 2, name: "경원당 전통찻집", category: "전통찻집", storeType: "카페/베이커리", area: "한옥마을", rating: 4.9, reviews: 187, desc: "한옥에서 즐기는 전통차와 수제 한과, 모싯잎송편", address: "전주시 완산구 태조로 44 (한옥마을)", hours: "09:00 - 20:00", phone: "063-232-5678", hasCoupon: false, isOpen: true, color: "#14B8A6", mapX: 62, mapY: 28 },
  { id: 3, name: "객리단길 수제버거", category: "양식", storeType: "외식업", area: "객리단길", rating: 4.6, reviews: 156, desc: "전주 한우 패티로 만든 수제버거 전문점", address: "전주시 완산구 경기전길 89 (객리단길)", hours: "11:30 - 21:30", phone: "063-287-3456", hasCoupon: true, isOpen: true, color: "#F59E0B", mapX: 68, mapY: 20 },
  { id: 4, name: "풍남문 베이커리", category: "카페/베이커리", storeType: "카페/베이커리", area: "한옥마을", rating: 4.7, reviews: 223, desc: "전통 한과와 현대적 베이커리의 만남, 수제 초코파이", address: "전주시 완산구 풍남문3길 20 (한옥마을)", hours: "08:00 - 20:00", phone: "063-233-7890", hasCoupon: true, isOpen: true, color: "#A855F7", mapX: 44, mapY: 52 },
  { id: 5, name: "남부시장 청년몰 떡갈비", category: "한식", storeType: "외식업", area: "남부시장", rating: 4.5, reviews: 312, desc: "남부시장 청년몰의 대표 메뉴, 직화 떡갈비와 국밥", address: "전주시 완산구 천경로 55 (남부시장)", hours: "10:00 - 20:00", phone: "063-244-5678", hasCoupon: false, isOpen: true, color: "#22C55E", mapX: 38, mapY: 62 },
  { id: 6, name: "전주 공예공방 솜씨", category: "서비스업", storeType: "서비스업", area: "객리단길", rating: 4.8, reviews: 94, desc: "전통 한지 공예와 자수 클래스 체험 공방", address: "전주시 완산구 경기전길 12 (객리단길)", hours: "10:00 - 18:00", phone: "063-288-3456", hasCoupon: true, isOpen: false, color: "#3B82F6", mapX: 76, mapY: 44 },
];

const COUPONS: Coupon[] = [
  { id: 1, storeName: "한옥마을 비빔밥집", title: "15% 할인", condition: "전주비빔밥 2인 세트 주문 시", expiry: "~2026.03.31", code: "BIBIM2026" },
  { id: 2, storeName: "풍남문 베이커리", title: "수제 초코파이 2+1", condition: "수제 초코파이 2박스 구매 시", expiry: "~2026.03.15", code: "CHOCO2026" },
  { id: 3, storeName: "전주 공예공방 솜씨", title: "체험비 20% 할인", condition: "한지 공예 체험 예약 시", expiry: "~2026.04.30", code: "CRAFT2026" },
  { id: 4, storeName: "한옥마을 연합", title: "스탬프 5곳 완성 시 10,000원 상품권", condition: "참여 가게 5곳 방문 스탬프", expiry: "~2026.06.30", code: "HANOK2026" },
  { id: 5, storeName: "객리단길 수제버거", title: "음료 무료 업그레이드", condition: "버거 세트 주문 시", expiry: "~2026.03.20", code: "BURGER26" },
];

const PROMO_POSTS: PromoPost[] = [
  { id: 1, storeName: "한옥마을 비빔밥집", title: "봄나물 비빔밥 출시! 냉이·달래·쑥으로 만든 전주 봄 한정 메뉴", timeAgo: "1시간 전", likes: 67, storeColor: "#EA4F1E" },
  { id: 2, storeName: "경원당 전통찻집", title: "매화차 시즌 오픈 🌸 전주 한옥마을에서 봄 향기를", timeAgo: "3시간 전", likes: 45, storeColor: "#14B8A6" },
  { id: 3, storeName: "객리단길 수제버거", title: "전주 한우 신메뉴: 매콤 고추장 버거 런칭 이벤트!", timeAgo: "5시간 전", likes: 38, storeColor: "#F59E0B" },
  { id: 4, storeName: "풍남문 베이커리", title: "설 연휴 한정 한과 선물세트 예약 받습니다", timeAgo: "1일 전", likes: 89, storeColor: "#A855F7" },
  { id: 5, storeName: "남부시장 청년몰 떡갈비", title: "이번 주말 남부시장 야시장 특별 참여! 떡갈비 세트 할인", timeAgo: "1일 전", likes: 52, storeColor: "#22C55E" },
  { id: 6, storeName: "전주 공예공방 솜씨", title: "봄맞이 한지 꽃동 만들기 클래스 오픈 (선착순 15명)", timeAgo: "2일 전", likes: 34, storeColor: "#3B82F6" },
];

const LOCAL_TABS: { label: LocalTab; Icon: React.ComponentType<{ className?: string }> }[] = [
  { label: "동네 가게", Icon: MapPin },
  { label: "쿠폰/할인", Icon: Ticket },
  { label: "홍보관", Icon: Megaphone },
];

/* ── 간략 지도 SVG ── */
function MapPlaceholder({ stores, selectedArea }: { stores: Store[]; selectedArea: string }) {
  const visible = selectedArea === "전체" ? stores : stores.filter((s) => s.area === selectedArea);
  return (
    <div className="relative w-full h-full rounded-xl overflow-hidden border border-gray-100">
      <svg viewBox="0 0 100 80" className="w-full h-full" style={{ background: "#e8f0e0" }}>
        {/* 도로망 */}
        <line x1="0" y1="40" x2="100" y2="40" stroke="#fff" strokeWidth="1.5" opacity="0.8" />
        <line x1="50" y1="0" x2="50" y2="80" stroke="#fff" strokeWidth="1.5" opacity="0.8" />
        <line x1="0" y1="20" x2="100" y2="20" stroke="#fff" strokeWidth="0.7" opacity="0.5" />
        <line x1="0" y1="60" x2="100" y2="60" stroke="#fff" strokeWidth="0.7" opacity="0.5" />
        <line x1="25" y1="0" x2="25" y2="80" stroke="#fff" strokeWidth="0.7" opacity="0.5" />
        <line x1="75" y1="0" x2="75" y2="80" stroke="#fff" strokeWidth="0.7" opacity="0.5" />
        {/* 블록 */}
        <rect x="2" y="2" width="21" height="16" fill="#d4e6c3" rx="1" opacity="0.6" />
        <rect x="27" y="2" width="21" height="16" fill="#c8ddb8" rx="1" opacity="0.6" />
        <rect x="52" y="2" width="21" height="16" fill="#d4e6c3" rx="1" opacity="0.6" />
        <rect x="2" y="22" width="21" height="16" fill="#cde0ba" rx="1" opacity="0.6" />
        <rect x="27" y="22" width="21" height="16" fill="#d4e6c3" rx="1" opacity="0.6" />
        <rect x="52" y="22" width="21" height="16" fill="#c8ddb8" rx="1" opacity="0.6" />
        <rect x="77" y="22" width="21" height="16" fill="#d4e6c3" rx="1" opacity="0.6" />
        <rect x="2" y="42" width="21" height="16" fill="#c8ddb8" rx="1" opacity="0.6" />
        <rect x="27" y="42" width="21" height="16" fill="#d4e6c3" rx="1" opacity="0.6" />
        <rect x="52" y="42" width="21" height="16" fill="#cde0ba" rx="1" opacity="0.6" />
        <rect x="77" y="42" width="21" height="16" fill="#d4e6c3" rx="1" opacity="0.6" />
        {/* 지역명 */}
        <text x="13" y="32" textAnchor="middle" fontSize="3.5" fill="#6b7280">한옥마을</text>
        <text x="38" y="55" textAnchor="middle" fontSize="3.5" fill="#6b7280">객리단길</text>
        <text x="13" y="68" textAnchor="middle" fontSize="3.5" fill="#6b7280">남부시장</text>
        <text x="88" y="68" textAnchor="middle" fontSize="3.5" fill="#6b7280">풍남문</text>
        {/* 핀 */}
        {visible.map((s) => (
          <g key={s.id}>
            <circle cx={s.mapX} cy={s.mapY} r="2.2" fill={s.color} stroke="white" strokeWidth="0.8" />
            <circle cx={s.mapX} cy={s.mapY} r="0.7" fill="white" />
          </g>
        ))}
      </svg>
      {/* 하단 툴팁 카드 */}
      <div className="absolute bottom-3 left-3 bg-white rounded-xl shadow-md px-4 py-3 flex items-center gap-3 max-w-[200px]">
        <div className="w-8 h-8 bg-[#FFF7EF] rounded-lg flex items-center justify-center shrink-0">
          <MapPin className="w-4 h-4 text-[#EA4F1E]" />
        </div>
        <div>
          <p className="text-xs font-bold text-gray-800">전주시 완산구</p>
          <p className="text-xs text-gray-500">
            등록 가게 {visible.length}곳 · {selectedArea === "전체" ? "전주 일대" : `${selectedArea} 일대`}
          </p>
        </div>
      </div>
    </div>
  );
}

/* ── 가게 카드 ── */
function StoreCard({ store }: { store: Store }) {
  const [liked, setLiked] = useState(false);
  return (
    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
      {/* 이미지 영역 */}
      <div className="relative h-44" style={{ backgroundColor: `${store.color}22` }}>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ backgroundColor: `${store.color}33` }}>
            <MapPin className="w-7 h-7" style={{ color: store.color }} />
          </div>
        </div>
        <div className="absolute top-3 left-3 flex gap-1.5">
          {store.hasCoupon && (
            <span className="px-2 py-0.5 text-xs font-bold bg-green-700 text-white rounded-md">쿠폰</span>
          )}
          <span className={`px-2 py-0.5 text-xs font-bold rounded-md ${store.isOpen ? "bg-gray-900 text-green-400" : "bg-gray-500 text-white"}`}>
            {store.isOpen ? "영업중" : "영업종료"}
          </span>
        </div>
        <button
          onClick={() => setLiked((v) => !v)}
          className="absolute top-3 right-3 w-8 h-8 bg-white/80 rounded-full flex items-center justify-center hover:bg-white transition-colors"
        >
          <Heart className={`w-4 h-4 ${liked ? "fill-red-500 text-red-500" : "text-gray-400"}`} />
        </button>
      </div>
      {/* 정보 */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-1">
          <h3 className="text-base font-bold text-gray-900 leading-tight">{store.name}</h3>
          <div className="flex items-center gap-1 shrink-0 ml-2">
            <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-semibold text-gray-700">{store.rating}</span>
            <span className="text-xs text-gray-400">({store.reviews})</span>
          </div>
        </div>
        <span className="inline-block px-2 py-0.5 text-xs text-gray-500 bg-gray-100 rounded-full mb-2">{store.category}</span>
        <p className="text-xs text-gray-500 mb-3 line-clamp-2">{store.desc}</p>
        <div className="space-y-1.5">
          <div className="flex items-center gap-1.5 text-xs text-gray-500">
            <MapPin className="w-3 h-3 shrink-0 text-gray-400" />
            <span className="truncate">{store.address}</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-gray-500">
            <Clock className="w-3 h-3 shrink-0 text-gray-400" />
            <span>{store.hours}</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-gray-500">
            <Phone className="w-3 h-3 shrink-0 text-gray-400" />
            <span>{store.phone}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LocalPage() {
  const [activeTab, setActiveTab] = useState<LocalTab>("동네 가게");
  const [selectedArea, setSelectedArea] = useState("전체");
  const [storeCategory, setStoreCategory] = useState<StoreCategory>("전체");
  const [search, setSearch] = useState("");
  const [claimedCoupons, setClaimedCoupons] = useState<Set<number>>(new Set());

  const filteredStores = STORES.filter((s) => {
    if (selectedArea !== "전체" && s.area !== selectedArea) return false;
    if (storeCategory !== "전체" && s.storeType !== storeCategory) return false;
    if (search && !s.name.includes(search) && !s.address.includes(search) && !s.category.includes(search)) return false;
    return true;
  });

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-8">
        {/* 타이틀 */}
        <div className="flex items-center gap-2 mb-1">
          <MapPin className="w-6 h-6 text-[#EA4F1E]" />
          <h1 className="text-2xl font-bold text-gray-900">전주 동네 사장님</h1>
        </div>
        <p className="text-sm text-gray-500 mb-6">전주 지역 소상공인 연합 마케팅 플랫폼</p>

        {/* 탭 */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {LOCAL_TABS.map(({ label, Icon }) => (
            <button
              key={label}
              onClick={() => setActiveTab(label)}
              className={`flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-lg border transition-colors ${
                activeTab === label
                  ? "bg-white text-gray-800 border-gray-300 shadow-sm"
                  : "bg-transparent text-gray-500 border-gray-200 hover:bg-white hover:text-gray-700"
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </div>

        {/* ── 동네 가게 ── */}
        {activeTab === "동네 가게" && (
          <>
            {/* 지역 필터 */}
            <div className="flex gap-2 mb-4 flex-wrap">
              {AREAS.map((area) => (
                <button
                  key={area}
                  onClick={() => setSelectedArea(area)}
                  className={`px-4 py-2 text-sm font-medium rounded-full border transition-colors ${
                    selectedArea === area
                      ? "bg-[#EA4F1E] text-white border-[#EA4F1E]"
                      : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
                  }`}
                >
                  {area === "전체" ? "전체" : `${area} ${AREA_COUNTS[area]}`}
                </button>
              ))}
            </div>

            {/* 지도 */}
            <div className="h-44 mb-6">
              <MapPlaceholder stores={STORES} selectedArea={selectedArea} />
            </div>

            {/* 검색 */}
            <div className="relative mb-4">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="가게명, 주소, 업종 검색... (예: 비빔밥, 한옥마을)"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#EA4F1E] transition-colors"
              />
            </div>

            {/* 카테고리 필터 */}
            <div className="flex gap-2 mb-5">
              {(["전체", "외식업", "카페/베이커리", "서비스업"] as StoreCategory[]).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setStoreCategory(cat)}
                  className={`px-4 py-1.5 text-sm font-medium rounded-full transition-colors ${
                    storeCategory === cat
                      ? "bg-[#EA4F1E] text-white"
                      : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* 가게 목록 */}
            {filteredStores.length > 0 ? (
              <div className="grid grid-cols-3 gap-5">
                {filteredStores.map((store) => (
                  <StoreCard key={store.id} store={store} />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-xl border border-gray-100 py-20 text-center">
                <p className="text-gray-400 text-sm">검색 결과가 없습니다.</p>
              </div>
            )}
          </>
        )}

        {/* ── 쿠폰/할인 ── */}
        {activeTab === "쿠폰/할인" && (
          <>
            <div className="mb-6">
              <h2 className="text-lg font-bold text-gray-900">전주 연합 쿠폰 &amp; 할인</h2>
              <p className="text-sm text-gray-500">전주 지역 사장님들이 함께 만드는 할인 혜택</p>
            </div>
            <div className="space-y-3">
              {COUPONS.map((c) => (
                <div key={c.id} className="bg-white rounded-xl border border-gray-100 px-6 py-5 flex items-center gap-4">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-[#EA4F1E] mb-1">{c.storeName}</p>
                    <p className="text-base font-bold text-gray-900 mb-1">{c.title}</p>
                    <p className="text-sm text-gray-500">{c.condition}</p>
                    <p className="text-xs text-gray-400 mt-1">유효기간: {c.expiry}</p>
                  </div>
                  <div className="flex flex-col items-center gap-2 shrink-0">
                    <div className="w-20 h-14 bg-[#FFF7EF] border border-[#EA4F1E]/20 rounded-lg flex flex-col items-center justify-center">
                      <Ticket className="w-4 h-4 text-[#EA4F1E] mb-0.5" />
                      <span className="text-xs font-bold text-[#EA4F1E]">{c.code}</span>
                    </div>
                    <button
                      onClick={() => setClaimedCoupons((prev) => new Set([...prev, c.id]))}
                      className={`w-20 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                        claimedCoupons.has(c.id)
                          ? "bg-gray-100 text-gray-400 cursor-default"
                          : "bg-[#EA4F1E] hover:bg-[#D44418] text-white"
                      }`}
                    >
                      {claimedCoupons.has(c.id) ? "완료" : "받기"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* ── 홍보관 ── */}
        {activeTab === "홍보관" && (
          <>
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-lg font-bold text-gray-900">전주 사장님 홍보관</h2>
                <p className="text-sm text-gray-500">오늘의 메뉴, 이벤트, 전주 소식을 직접 올려보세요</p>
              </div>
              <button className="flex items-center gap-1.5 px-4 py-2 bg-[#EA4F1E] hover:bg-[#D44418] text-white text-sm font-semibold rounded-lg transition-colors">
                <Edit3 className="w-4 h-4" />
                글 올리기
              </button>
            </div>
            <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
              {PROMO_POSTS.map((post, idx) => (
                <div
                  key={post.id}
                  className={`flex items-center gap-4 px-6 py-5 hover:bg-[#FFF7EF] hover:border-l-4 hover:border-l-[#EA4F1E] hover:pl-5 transition-all duration-150 cursor-pointer ${
                    idx < PROMO_POSTS.length - 1 ? "border-b border-gray-100" : ""
                  }`}
                >
                  <div className="flex-1 min-w-0">
                    <span
                      className="inline-block text-xs font-semibold px-2 py-0.5 rounded-full mb-1.5"
                      style={{ backgroundColor: `${post.storeColor}1A`, color: post.storeColor }}
                    >
                      {post.storeName}
                    </span>
                    <p className="text-sm font-medium text-gray-900 truncate">{post.title}</p>
                    <p className="text-xs text-gray-400 mt-1">{post.timeAgo}</p>
                  </div>
                  <div className="flex items-center gap-1.5 text-gray-400 shrink-0">
                    <Heart className="w-4 h-4" />
                    <span className="text-sm">{post.likes}</span>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}

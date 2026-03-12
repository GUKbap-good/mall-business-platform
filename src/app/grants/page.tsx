"use client";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import {
  Search, Filter, ChevronDown, Bell, Bookmark, BookmarkCheck,
  Calendar, Building2, DollarSign, Clock, ChevronRight,
  Tag, MapPin, ArrowUpRight, TrendingUp, AlertCircle, CheckCircle2,
} from "lucide-react";
import { useState, useEffect } from "react";

const categories = ["전체", "창업지원", "운영자금", "시설개선", "마케팅", "고용지원", "교육훈련", "수출지원"];
const regions = ["전체", "서울", "부산", "대구", "인천", "광주", "대전", "울산", "경기", "강원", "충북", "충남", "전북", "전남", "경북", "경남", "제주"];
const sortOptions = ["최신순", "마감임박순", "지원금액순", "조회수순"];
const statusOptions = ["전체", "접수중", "접수예정", "마감"];

const grants = [
  {
    id: 1,
    badge: "NEW",
    badgeColor: "bg-green-100 text-green-700",
    status: "접수중",
    statusColor: "text-green-600",
    title: "2026년 소상공인 경영안정자금 지원",
    agency: "소상공인시장진흥공단",
    agencyLogo: "소진공",
    category: "운영자금",
    region: "전국",
    amount: "최대 7,000만원",
    interestRate: "연 2.5%",
    deadline: "2026.04.30",
    daysLeft: 52,
    views: 12483,
    bookmarked: false,
    tags: ["무담보", "저금리", "소상공인"],
    description: "소상공인의 경영 안정을 위한 정책자금으로, 사업 운전자금과 시설투자 자금을 저금리로 지원합니다.",
    requirements: ["사업자등록 후 6개월 이상", "연매출 10억원 이하"],
  },
  {
    id: 2,
    badge: "인기",
    badgeColor: "bg-orange-100 text-orange-700",
    status: "접수중",
    statusColor: "text-green-600",
    title: "소상공인 디지털 전환 지원사업 (DX)",
    agency: "중소벤처기업부",
    agencyLogo: "중기부",
    category: "마케팅",
    region: "전국",
    amount: "최대 500만원",
    interestRate: "무상지원",
    deadline: "2026.05.15",
    daysLeft: 67,
    views: 9821,
    bookmarked: true,
    tags: ["디지털전환", "무상지원", "온라인마케팅"],
    description: "소상공인의 디지털 전환을 위한 온라인 플랫폼 입점, SNS 마케팅, 스마트 기기 도입 등을 지원합니다.",
    requirements: ["소상공인 확인서 발급 가능 업체", "오프라인 매장 보유"],
  },
  {
    id: 3,
    badge: "마감임박",
    badgeColor: "bg-red-100 text-red-700",
    status: "접수중",
    statusColor: "text-green-600",
    title: "서울시 소상공인 임차료 지원사업",
    agency: "서울특별시",
    agencyLogo: "서울시",
    category: "운영자금",
    region: "서울",
    amount: "월 최대 50만원",
    interestRate: "무상지원",
    deadline: "2026.03.20",
    daysLeft: 11,
    views: 18204,
    bookmarked: false,
    tags: ["임차료", "서울", "무상지원"],
    description: "임대료 부담 완화를 위해 서울 소재 소상공인에게 월 임차료를 최대 6개월간 지원합니다.",
    requirements: ["서울시 소재 사업장", "임차 사업장 운영 중", "연매출 2억원 이하"],
  },
  {
    id: 4,
    badge: "",
    badgeColor: "",
    status: "접수중",
    statusColor: "text-green-600",
    title: "소상공인 고용보험료 지원사업",
    agency: "고용노동부",
    agencyLogo: "고용부",
    category: "고용지원",
    region: "전국",
    amount: "보험료 80% 지원",
    interestRate: "무상지원",
    deadline: "2026.12.31",
    daysLeft: 297,
    views: 5430,
    bookmarked: false,
    tags: ["고용보험", "직원지원", "장기지원"],
    description: "소상공인 사업주 및 종사자의 고용보험 가입을 촉진하기 위해 보험료의 일부를 지원합니다.",
    requirements: ["소상공인 기준 충족", "고용보험 미가입자"],
  },
  {
    id: 5,
    badge: "NEW",
    badgeColor: "bg-green-100 text-green-700",
    status: "접수중",
    statusColor: "text-green-600",
    title: "전통시장 시설현대화 지원사업",
    agency: "소상공인시장진흥공단",
    agencyLogo: "소진공",
    category: "시설개선",
    region: "전국",
    amount: "최대 1억원",
    interestRate: "50% 보조",
    deadline: "2026.06.30",
    daysLeft: 113,
    views: 3871,
    bookmarked: false,
    tags: ["전통시장", "시설투자", "일부보조"],
    description: "전통시장 및 상점가의 시설 현대화를 통한 경쟁력 제고를 위해 인테리어, 설비 교체 비용을 지원합니다.",
    requirements: ["전통시장 또는 상점가 내 입점 사업자", "사업자등록 1년 이상"],
  },
  {
    id: 6,
    badge: "",
    badgeColor: "",
    status: "접수예정",
    statusColor: "text-blue-600",
    title: "소상공인 수출지원 해외판로개척",
    agency: "중소벤처기업부",
    agencyLogo: "중기부",
    category: "수출지원",
    region: "전국",
    amount: "최대 2,000만원",
    interestRate: "70% 보조",
    deadline: "2026.07.01",
    daysLeft: 114,
    views: 2209,
    bookmarked: false,
    tags: ["수출", "해외진출", "글로벌"],
    description: "소상공인의 해외 판로 개척을 위한 해외 전시회 참가비, 현지 마케팅 비용 등을 지원합니다.",
    requirements: ["직전년도 수출 실적 보유 또는 수출 희망 소상공인"],
  },
  {
    id: 7,
    badge: "",
    badgeColor: "",
    status: "접수중",
    statusColor: "text-green-600",
    title: "경기도 소상공인 창업지원 패키지",
    agency: "경기도",
    agencyLogo: "경기도",
    category: "창업지원",
    region: "경기",
    amount: "최대 3,000만원",
    interestRate: "연 1.5%",
    deadline: "2026.04.15",
    daysLeft: 37,
    views: 7654,
    bookmarked: false,
    tags: ["창업", "경기도", "저금리"],
    description: "경기도 내 창업 소상공인에게 초기 창업 자금 및 경영 컨설팅을 패키지로 지원합니다.",
    requirements: ["경기도 소재 사업장", "창업 후 3년 이내"],
  },
  {
    id: 8,
    badge: "마감",
    badgeColor: "bg-gray-100 text-gray-500",
    status: "마감",
    statusColor: "text-gray-500",
    title: "소상공인 온라인 판로지원사업",
    agency: "소상공인시장진흥공단",
    agencyLogo: "소진공",
    category: "마케팅",
    region: "전국",
    amount: "최대 300만원",
    interestRate: "무상지원",
    deadline: "2026.02.28",
    daysLeft: 0,
    views: 21033,
    bookmarked: false,
    tags: ["온라인", "쇼핑몰", "무상지원"],
    description: "소상공인의 온라인 쇼핑몰 입점 및 운영을 위한 수수료, 광고비 등을 지원합니다.",
    requirements: ["소상공인 확인서 발급 가능 업체"],
  },
];

const alerts = [
  { id: 1, title: "내 관심 지원사업 마감 11일 전", desc: "서울시 소상공인 임차료 지원사업", urgent: true },
  { id: 2, title: "새 지원사업 알림", desc: "소상공인 디지털 전환 지원사업 신규 등록", urgent: false },
];

export default function GrantsPage() {
  const [selectedCategory, setSelectedCategory] = useState("전체");
  const [selectedRegion, setSelectedRegion] = useState("전체");
  const [selectedSort, setSelectedSort] = useState("최신순");
  const [selectedStatus, setSelectedStatus] = useState("전체");
  const [searchQuery, setSearchQuery] = useState("");
  const [bookmarks, setBookmarks] = useState<number[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("grant-bookmarks");
    if (saved) setBookmarks(JSON.parse(saved));
    else setBookmarks([2]);
  }, []);

  const saveBookmarks = (next: number[]) => {
    setBookmarks(next);
    localStorage.setItem("grant-bookmarks", JSON.stringify(next));
  };
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const filtered = grants.filter((g) => {
    const matchCat = selectedCategory === "전체" || g.category === selectedCategory;
    const matchRegion = selectedRegion === "전체" || g.region === selectedRegion || g.region === "전국";
    const matchStatus = selectedStatus === "전체" || g.status === selectedStatus;
    const matchSearch = !searchQuery || g.title.includes(searchQuery) || g.agency.includes(searchQuery) || g.tags.some(t => t.includes(searchQuery));
    return matchCat && matchRegion && matchStatus && matchSearch;
  });

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginated = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const toggleBookmark = (id: number) => {
    const next = bookmarks.includes(id) ? bookmarks.filter(b => b !== id) : [...bookmarks, id];
    saveBookmarks(next);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />

      {/* 페이지 헤더 */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-base text-gray-500 mb-2">
                <span>홈</span>
                <ChevronRight className="w-4 h-4" />
                <span className="text-[#EA4F1E] font-medium">지원사업</span>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                <div className="w-9 h-9 bg-blue-500 rounded-lg flex items-center justify-center shrink-0">
                  <Building2 className="w-5 h-5 text-white" />
                </div>
                정부 지원사업
              </h1>
              <p className="text-gray-500 mt-1 text-base">소상공인을 위한 정부·지자체 지원사업을 한눈에 확인하세요.</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 text-base text-gray-500 bg-gray-50 rounded-lg px-3 py-2">
                <TrendingUp className="w-5 h-5 text-[#EA4F1E]" />
                <span>현재 <strong className="text-gray-900">248개</strong> 지원사업 접수 중</span>
              </div>
              <button className="flex items-center gap-1.5 text-base font-medium text-white bg-[#EA4F1E] hover:bg-[#D44418] rounded-lg px-4 py-2.5 transition-colors">
                <Bell className="w-5 h-5" />
                맞춤 알림 설정
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 w-full flex-1">
        <div className="flex gap-6">
          {/* 사이드바 */}
          <aside className="hidden lg:block w-60 shrink-0 space-y-5">
            {/* 알림 카드 */}
            <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
              <h3 className="text-base font-semibold text-gray-900 mb-3 flex items-center gap-1.5">
                <Bell className="w-5 h-5 text-[#EA4F1E]" />
                나의 알림
              </h3>
              <div className="space-y-3">
                {alerts.map(a => (
                  <div key={a.id} className={`rounded-lg p-3 text-sm ${a.urgent ? "bg-red-50 border border-red-100" : "bg-gray-50"}`}>
                    {a.urgent && (
                      <div className="flex items-center gap-1 text-red-600 font-medium mb-1">
                        <AlertCircle className="w-4 h-4" />
                        {a.title}
                      </div>
                    )}
                    {!a.urgent && (
                      <div className="flex items-center gap-1 text-blue-600 font-medium mb-1">
                        <CheckCircle2 className="w-4 h-4" />
                        {a.title}
                      </div>
                    )}
                    <p className="text-gray-600">{a.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* 지역 필터 */}
            <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
              <h3 className="text-base font-semibold text-gray-900 mb-3 flex items-center gap-1.5">
                <MapPin className="w-5 h-5 text-[#EA4F1E]" />
                지역 선택
              </h3>
              <div className="grid grid-cols-2 gap-1.5">
                {regions.map(r => (
                  <button
                    key={r}
                    onClick={() => { setSelectedRegion(r); setCurrentPage(1); }}
                    className={`text-sm px-2 py-2 rounded-md font-medium transition-colors ${
                      selectedRegion === r
                        ? "bg-[#EA4F1E] text-white"
                        : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            {/* 접수 상태 */}
            <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
              <h3 className="text-base font-semibold text-gray-900 mb-3 flex items-center gap-1.5">
                <Clock className="w-5 h-5 text-[#EA4F1E]" />
                접수 상태
              </h3>
              <div className="space-y-1.5">
                {statusOptions.map(s => (
                  <button
                    key={s}
                    onClick={() => { setSelectedStatus(s); setCurrentPage(1); }}
                    className={`w-full text-left text-base px-3 py-2.5 rounded-md font-medium transition-colors ${
                      selectedStatus === s
                        ? "bg-[#FFF7EF] text-[#EA4F1E]"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* 메인 콘텐츠 */}
          <div className="flex-1 min-w-0">
            {/* 검색 바 */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 mb-5">
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="지원사업명, 기관명, 키워드로 검색..."
                  value={searchQuery}
                  onChange={e => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                  className="w-full pl-11 pr-4 py-3 text-base bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#EA4F1E]/20 focus:border-[#EA4F1E] transition-colors"
                />
              </div>
            </div>

            {/* 카테고리 탭 */}
            <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none mb-4 pb-1">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => { setSelectedCategory(cat); setCurrentPage(1); }}
                  className={`shrink-0 text-base px-4 py-2 rounded-full font-medium transition-colors ${
                    selectedCategory === cat
                      ? "bg-[#EA4F1E] text-white"
                      : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* 결과 헤더 */}
            <div className="flex items-center justify-between mb-4">
              <p className="text-base text-gray-500">
                총 <strong className="text-gray-900">{filtered.length}개</strong>의 지원사업
              </p>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <select
                    value={selectedSort}
                    onChange={e => setSelectedSort(e.target.value)}
                    className="appearance-none text-base pl-3 pr-8 py-2 bg-white border border-gray-200 rounded-lg text-gray-700 focus:outline-none focus:border-[#EA4F1E] cursor-pointer"
                  >
                    {sortOptions.map(s => <option key={s}>{s}</option>)}
                  </select>
                  <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* 지원사업 카드 목록 */}
            <div className="space-y-4">
              {paginated.map(grant => {
                const isBookmarked = bookmarks.includes(grant.id);
                const isClosed = grant.status === "마감";
                return (
                  <div
                    key={grant.id}
                    className={`bg-white rounded-xl border shadow-sm hover:shadow-md transition-shadow overflow-hidden ${isClosed ? "opacity-60" : "border-gray-100"}`}
                  >
                    <div className="p-5">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          {/* 상단 메타 */}
                          <div className="flex items-center gap-2 mb-2 flex-wrap">
                            {grant.badge && (
                              <span className={`text-sm font-bold px-2.5 py-0.5 rounded-full ${grant.badgeColor}`}>
                                {grant.badge}
                              </span>
                            )}
                            <span className={`text-sm font-medium ${grant.statusColor}`}>
                              ● {grant.status}
                            </span>
                            <span className="text-sm text-gray-400">|</span>
                            <div className="flex items-center gap-1 text-sm text-gray-500">
                              <Building2 className="w-4 h-4" />
                              {grant.agency}
                            </div>
                            <span className="text-sm bg-gray-100 text-gray-600 px-2.5 py-0.5 rounded-full">
                              {grant.category}
                            </span>
                          </div>

                          {/* 제목 */}
                          <h3 className="text-lg font-semibold text-gray-900 mb-2 leading-snug">
                            {grant.title}
                          </h3>

                          {/* 설명 */}
                          <p className="text-base text-gray-500 mb-3 line-clamp-2 leading-relaxed">
                            {grant.description}
                          </p>

                          {/* 태그 */}
                          <div className="flex items-center gap-1.5 flex-wrap">
                            {grant.tags.map(tag => (
                              <span key={tag} className="text-sm text-[#EA4F1E] bg-[#FFF7EF] px-2.5 py-0.5 rounded-full">
                                #{tag}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* 북마크 버튼 */}
                        <button
                          onClick={() => toggleBookmark(grant.id)}
                          className="shrink-0 p-2 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          {isBookmarked
                            ? <BookmarkCheck className="w-5 h-5 text-[#EA4F1E]" />
                            : <Bookmark className="w-5 h-5 text-gray-300 hover:text-gray-500" />
                          }
                        </button>
                      </div>

                      {/* 하단 정보 */}
                      <div className="mt-4 pt-4 border-t border-gray-50 flex flex-wrap items-center justify-between gap-3">
                        <div className="flex items-center gap-4 text-base">
                          <div className="flex items-center gap-1.5 text-gray-700">
                            <DollarSign className="w-5 h-5 text-[#EA4F1E]" />
                            <span className="font-semibold">{grant.amount}</span>
                            <span className="text-gray-400 text-sm">({grant.interestRate})</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-gray-600">
                            <Calendar className="w-5 h-5 text-gray-400" />
                            <span>{grant.deadline} 마감</span>
                            {!isClosed && grant.daysLeft <= 30 && (
                              <span className="text-red-500 font-medium text-sm">
                                D-{grant.daysLeft}
                              </span>
                            )}
                          </div>
                        </div>
                        <button className="flex items-center gap-1.5 text-base font-medium text-[#EA4F1E] hover:text-[#D44418] transition-colors">
                          자세히 보기
                          <ArrowUpRight className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* 결과 없음 */}
            {filtered.length === 0 && (
              <div className="bg-white rounded-xl border border-gray-100 p-16 text-center">
                <Filter className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                <p className="text-gray-500 font-medium text-lg">검색 결과가 없습니다</p>
                <p className="text-base text-gray-400 mt-1">다른 검색어나 필터를 시도해보세요.</p>
                <button
                  onClick={() => { setSelectedCategory("전체"); setSelectedRegion("전체"); setSelectedStatus("전체"); setSearchQuery(""); setCurrentPage(1); }}
                  className="mt-4 text-base text-[#EA4F1E] font-medium hover:underline"
                >
                  필터 초기화
                </button>
              </div>
            )}

            {/* 페이지네이션 */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-1.5 mt-8">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2.5 text-base rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  이전
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-10 h-10 text-base rounded-lg font-medium transition-colors ${
                      currentPage === page
                        ? "bg-[#EA4F1E] text-white"
                        : "border border-gray-200 text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    {page}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2.5 text-base rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  다음
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

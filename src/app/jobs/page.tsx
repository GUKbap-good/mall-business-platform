"use client";

import { useState } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import {
  Search, MapPin, DollarSign, Calendar, Clock,
  Heart, Briefcase, Plus, Building2, X,
} from "lucide-react";

type FormCategory = "서빙" | "주방보조" | "배달" | "판매" | "사무" | "청소" | "기타";

interface RegisterForm {
  jobType: "구인 (사장님)" | "구직 (구직자)";
  category: FormCategory;
  title: string;
  location: string;
  salary: string;
  description: string;
}

type JobType = "전체" | "구인" | "구직";
type JobCategory = "전체" | "서빙" | "주방보조" | "배달" | "판매" | "사무" | "청소" | "기타";

interface Job {
  id: number;
  type: "구인" | "구직";
  category: JobCategory;
  isUrgent?: boolean;
  title: string;
  company: string;
  isCompany: boolean;
  description: string;
  location: string;
  salary: string;
  schedule: string;
  postedAt: string;
}

const JOBS: Job[] = [
  {
    id: 1,
    type: "구인",
    category: "서빙",
    isUrgent: true,
    title: "주말 서빙 알바 구합니다",
    company: "맛있는 파스타집",
    isCompany: true,
    description: "주말 피크타임 서빙 도와주실 분. 경험 무관, 친절하신 분 환영!",
    location: "서울 마포구 홍대입구역 3분",
    salary: "시급 12,000원",
    schedule: "주말 11:00-17:00",
    postedAt: "1시간 전",
  },
  {
    id: 2,
    type: "구인",
    category: "주방보조",
    isUrgent: false,
    title: "저녁 주방보조 모집",
    company: "청춘갈비",
    isCompany: true,
    description: "저녁 시간 주방보조. 설거지, 재료 손질 등. 식사 제공.",
    location: "서울 강남구 역삼역 5분",
    salary: "시급 13,000원",
    schedule: "평일 17:00-22:00",
    postedAt: "3시간 전",
  },
  {
    id: 3,
    type: "구인",
    category: "서빙",
    isUrgent: true,
    title: "오전 카페 바리스타",
    company: "모닝커피",
    isCompany: true,
    description: "오전 근무 바리스타. 커피 제조 경험 우대!",
    location: "경기 성남시 판교역 7분",
    salary: "시급 11,500원",
    schedule: "평일 07:00-13:00",
    postedAt: "5시간 전",
  },
  {
    id: 4,
    type: "구직",
    category: "판매",
    isUrgent: false,
    title: "편의점/카페 주말 알바 구합니다",
    company: "구직자: 김OO",
    isCompany: false,
    description: "대학생. 편의점 6개월, 카페 3개월 경험. 성실합니다.",
    location: "서울 종로구 거주",
    salary: "협의 가능",
    schedule: "주말 종일 가능",
    postedAt: "6시간 전",
  },
  {
    id: 5,
    type: "구인",
    category: "배달",
    isUrgent: false,
    title: "배달 라이더 모집 (자차)",
    company: "동네반찬",
    isCompany: true,
    description: "자차(오토바이) 보유 라이더. 보험 가입 필수.",
    location: "서울 강남구 일대",
    salary: "건당 4,000~6,000원",
    schedule: "점심/저녁 피크타임",
    postedAt: "1일 전",
  },
  {
    id: 6,
    type: "구인",
    category: "청소",
    isUrgent: false,
    title: "매장 청소 파트타임",
    company: "프레시마트",
    isCompany: true,
    description: "아침 매장 청소 담당. 주 5일 근무.",
    location: "경기 수원시 영통구",
    salary: "시급 11,000원",
    schedule: "매일 06:00-09:00",
    postedAt: "1일 전",
  },
];

const TYPE_TABS: JobType[] = ["전체", "구인", "구직"];
const CATEGORIES: JobCategory[] = ["전체", "서빙", "주방보조", "배달", "판매", "사무", "청소", "기타"];

const FORM_CATEGORIES: FormCategory[] = ["서빙", "주방보조", "배달", "판매", "사무", "청소", "기타"];

export default function JobsPage() {
  const [activeType, setActiveType] = useState<JobType>("전체");
  const [activeCategory, setActiveCategory] = useState<JobCategory>("전체");
  const [searchQuery, setSearchQuery] = useState("");
  const [bookmarks, setBookmarks] = useState<Set<number>>(new Set());
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<RegisterForm>({
    jobType: "구인 (사장님)",
    category: "서빙",
    title: "",
    location: "",
    salary: "",
    description: "",
  });

  const toggleBookmark = (id: number) => {
    setBookmarks((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const filtered = JOBS.filter((job) => {
    const matchType = activeType === "전체" || job.type === activeType;
    const matchCategory = activeCategory === "전체" || job.category === activeCategory;
    const matchSearch =
      !searchQuery ||
      job.title.includes(searchQuery) ||
      job.company.includes(searchQuery) ||
      job.description.includes(searchQuery);
    return matchType && matchCategory && matchSearch;
  });

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-8">
        {/* 페이지 타이틀 */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Briefcase className="w-6 h-6 text-[#EA4F1E]" />
              <h1 className="text-2xl font-bold text-gray-900">구인 · 구직</h1>
            </div>
            <p className="text-sm text-gray-500">지역 기반 파트타임 · 알바 매칭</p>
          </div>
          <button
            onClick={() => setShowForm((v) => !v)}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-[#EA4F1E] hover:bg-[#D44418] text-white text-sm font-semibold rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            등록하기
          </button>
        </div>

        {/* 등록 폼 */}
        {showForm && (
          <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-base font-bold text-gray-900">구인/구직 등록</h2>
              <button
                onClick={() => setShowForm(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">유형</label>
                <select
                  value={form.jobType}
                  onChange={(e) => setForm({ ...form, jobType: e.target.value as RegisterForm["jobType"] })}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#EA4F1E] transition-colors bg-white"
                >
                  <option>구인 (사장님)</option>
                  <option>구직 (구직자)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">업종</label>
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value as FormCategory })}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#EA4F1E] transition-colors bg-white"
                >
                  {FORM_CATEGORIES.map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">제목</label>
              <input
                type="text"
                placeholder="제목을 입력하세요"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#EA4F1E] transition-colors"
              />
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">위치</label>
                <input
                  type="text"
                  placeholder="예: 서울 마포구 홍대입구역"
                  value={form.location}
                  onChange={(e) => setForm({ ...form, location: e.target.value })}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#EA4F1E] transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">급여</label>
                <input
                  type="text"
                  placeholder="예: 시급 12,000원"
                  value={form.salary}
                  onChange={(e) => setForm({ ...form, salary: e.target.value })}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#EA4F1E] transition-colors"
                />
              </div>
            </div>

            <div className="mb-5">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">상세 설명</label>
              <textarea
                placeholder="상세 내용을 작성해주세요"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                rows={4}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#EA4F1E] transition-colors resize-none"
              />
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowForm(false)}
                className="px-5 py-2.5 text-sm font-medium text-gray-600 bg-white border border-gray-200 hover:border-gray-300 rounded-lg transition-colors"
              >
                취소
              </button>
              <button className="px-5 py-2.5 text-sm font-semibold text-white bg-[#EA4F1E] hover:bg-[#D44418] rounded-lg transition-colors">
                등록하기
              </button>
            </div>
          </div>
        )}

        {/* 탭 */}
        <div className="flex gap-2 mb-4">
          {TYPE_TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveType(tab)}
              className={`px-4 py-2 text-sm font-medium rounded-full border transition-colors ${
                activeType === tab
                  ? "bg-[#EA4F1E] text-white border-[#EA4F1E]"
                  : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* 검색 */}
        <div className="relative mb-4">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="구인/구직 검색..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#EA4F1E] transition-colors"
          />
        </div>

        {/* 카테고리 필터 */}
        <div className="flex gap-2 flex-wrap mb-6">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-1.5 text-sm font-medium rounded-full border transition-colors ${
                activeCategory === cat
                  ? "bg-[#EA4F1E] text-white border-[#EA4F1E]"
                  : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* 결과 수 */}
        <p className="text-sm text-gray-500 mb-4">총 {filtered.length}건</p>

        {/* 구인구직 카드 목록 */}
        <div className="flex flex-col gap-3">
          {filtered.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-100 py-16 text-center">
              <Briefcase className="w-10 h-10 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-400 text-sm">검색 결과가 없습니다.</p>
            </div>
          ) : (
            filtered.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                bookmarked={bookmarks.has(job.id)}
                onBookmark={() => toggleBookmark(job.id)}
              />
            ))
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

function JobCard({
  job,
  bookmarked,
  onBookmark,
}: {
  job: Job;
  bookmarked: boolean;
  onBookmark: () => void;
}) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-5 hover:border-gray-200 hover:shadow-sm transition-all">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          {/* 배지 */}
          <div className="flex items-center gap-1.5 mb-2 flex-wrap">
            <TypeBadge type={job.type} />
            <CategoryBadge category={job.category} />
            {job.isUrgent && <UrgentBadge />}
          </div>

          {/* 제목 */}
          <h2 className="text-base font-bold text-gray-900 mb-1 truncate">{job.title}</h2>

          {/* 회사/구직자 */}
          <div className="flex items-center gap-1 mb-2">
            <Building2 className="w-3.5 h-3.5 text-gray-400 shrink-0" />
            <span className="text-xs text-gray-500">{job.company}</span>
          </div>

          {/* 설명 */}
          <p className="text-sm text-gray-600 mb-3 line-clamp-1">{job.description}</p>

          {/* 메타 정보 */}
          <div className="flex items-center gap-4 flex-wrap text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 shrink-0" />
              {job.location}
            </span>
            <span className="flex items-center gap-1 font-semibold text-[#EA4F1E]">
              <DollarSign className="w-3.5 h-3.5 shrink-0" />
              {job.salary}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 shrink-0" />
              {job.schedule}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 shrink-0" />
              {job.postedAt}
            </span>
          </div>
        </div>

        {/* 우측 액션 */}
        <div className="flex flex-col items-end gap-2 shrink-0">
          <button
            onClick={onBookmark}
            className="p-1.5 text-gray-300 hover:text-red-400 transition-colors"
          >
            <Heart
              className={`w-5 h-5 ${bookmarked ? "fill-red-400 text-red-400" : ""}`}
            />
          </button>
          <button className="px-3 py-1.5 text-xs font-semibold text-[#EA4F1E] bg-[#FFF7EF] hover:bg-orange-100 rounded-lg transition-colors whitespace-nowrap">
            지원하기
          </button>
        </div>
      </div>
    </div>
  );
}

function TypeBadge({ type }: { type: "구인" | "구직" }) {
  if (type === "구인") {
    return (
      <span className="px-2 py-0.5 text-xs font-medium bg-blue-50 text-blue-500 rounded-full border border-blue-100">
        구인
      </span>
    );
  }
  return (
    <span className="px-2 py-0.5 text-xs font-medium bg-teal-50 text-teal-500 rounded-full border border-teal-100">
      구직
    </span>
  );
}

function CategoryBadge({ category }: { category: JobCategory }) {
  return (
    <span className="px-2 py-0.5 text-xs font-medium bg-gray-100 text-gray-500 rounded-full">
      {category}
    </span>
  );
}

function UrgentBadge() {
  return (
    <span className="px-2 py-0.5 text-xs font-medium bg-orange-50 text-orange-500 rounded-full border border-orange-100">
      🔥 급구
    </span>
  );
}

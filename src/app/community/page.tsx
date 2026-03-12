"use client";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import {
  Search, MessageCircle, Edit3, Flame, Clock,
  Eye, ThumbsUp, BarChart2, ChevronRight, ChevronLeft, X, ImagePlus,
  TrendingUp, AlertCircle, Coins, MapPin, ShieldAlert, Lightbulb,
} from "lucide-react";
import { useState } from "react";

const mainTabs = ["게시판", "창업·메뉴 분석"];
const sortTabs = [
  { label: "전체", icon: null },
  { label: "인기", icon: Flame },
  { label: "최신", icon: Clock },
];
const categories = ["전체", "외식업", "서비스업", "소매업", "도매업", "제조업", "프랜차이즈", "자유게시판", "노하우"];

const posts = [
  {
    id: 1,
    avatar: "🍗",
    avatarBg: "bg-orange-100",
    pinned: true,
    hot: true,
    category: "외식업",
    title: "배달앱 수수료 줄이는 현실적인 방법 공유합니다",
    preview: "3년째 치킨집 운영 중인데, 배달앱 수수료를 줄이면서도 매출을 유지하는 방법을 찾았습니다. 핵심은 자체 주문 채널을 만드는 것인데요...",
    author: "치킨사장",
    time: "2시간 전",
    views: 1283,
    likes: 123,
    comments: 47,
  },
  {
    id: 2,
    avatar: "☕",
    avatarBg: "bg-amber-100",
    pinned: false,
    hot: true,
    category: "서비스업",
    title: "1인 카페 운영 6개월 차 후기 (현실 매출 공개)",
    preview: "동네에 카페를 열고 6개월이 지났습니다. 현실적인 매출을 정리해봤습니다. 월매출 평균 800만원, 순수익은...",
    author: "카페장인",
    time: "5시간 전",
    views: 892,
    likes: 89,
    comments: 32,
  },
  {
    id: 3,
    avatar: "📊",
    avatarBg: "bg-blue-100",
    pinned: false,
    hot: true,
    category: "노하우",
    title: "재고관리 엑셀 대신 이거 써보세요 (무료 도구 추천)",
    preview: "엑셀로 재고관리 하다가 한계를 느껴서 찾아본 무료 도구들을 비교해봤습니다. 결론부터 말씀드리면...",
    author: "효율왕",
    time: "8시간 전",
    views: 2156,
    likes: 156,
    comments: 28,
  },
  {
    id: 4,
    avatar: "🏪",
    avatarBg: "bg-purple-100",
    pinned: false,
    hot: false,
    category: "소매업",
    title: "편의점 야간 무인 시스템 도입 3개월 후기",
    preview: "인건비 절약을 위해 야간 무인 시스템을 도입했는데 생각보다 만족스럽습니다. 도난도 걱정했는데...",
    author: "24시사장",
    time: "12시간 전",
    views: 567,
    likes: 45,
    comments: 19,
  },
  {
    id: 5,
    avatar: "⚖️",
    avatarBg: "bg-red-100",
    pinned: false,
    hot: true,
    category: "프랜차이즈",
    title: "프차 본사와 분쟁 시 대처법 (경험담)",
    preview: "프랜차이즈 운영 3년 차에 본사와 갈등이 생겼을 때 어떻게 해결했는지 단계별로 공유드립니다...",
    author: "경험자",
    time: "1일 전",
    views: 3421,
    likes: 234,
    comments: 87,
  },
  {
    id: 6,
    avatar: "😊",
    avatarBg: "bg-green-100",
    pinned: false,
    hot: false,
    category: "자유게시판",
    title: "오늘 손님이 남긴 감동 리뷰에 울컥했습니다",
    preview: "장사한 지 1년, 힘들었는데 오늘 받은 리뷰 보고 눈물이 났네요. '사장님 덕분에 행복한 저녁이었습니다'...",
    author: "감동사장",
    time: "1일 전",
    views: 1823,
    likes: 312,
    comments: 56,
  },
  {
    id: 7,
    avatar: "🍳",
    avatarBg: "bg-yellow-100",
    pinned: false,
    hot: false,
    category: "외식업",
    title: "주방 동선 개선으로 피크타임 효율 30% 올린 방법",
    preview: "작은 주방에서 효율적으로 일하기 위해 동선을 재배치했는데 효과가 엄청났습니다. Before/After 사진과 함께...",
    author: "주방장",
    time: "2일 전",
    views: 876,
    likes: 98,
    comments: 23,
  },
  {
    id: 8,
    avatar: "📱",
    avatarBg: "bg-pink-100",
    pinned: false,
    hot: true,
    category: "노하우",
    title: "인스타그램으로 월 매출 200만원 늘린 마케팅 전략",
    preview: "SNS 마케팅 전혀 모르던 제가 인스타로 매출을 올린 방법을 단계별로 공유합니다. 1단계: 프로필 세팅...",
    author: "마케팅초보",
    time: "2일 전",
    views: 4532,
    likes: 456,
    comments: 112,
  },
];

const analysisLocations = ["전체", "한옥마을", "객리단길", "남부시장", "풍남문", "덕진동", "효자동", "송천동", "서신동", "인후동", "금암동"];
const analysisSubTabs = ["검색 트렌드", "폐업률 분석", "유망 아이템 추천"];

const chartMonths = ["9월", "10월", "11월", "12월", "1월", "2월"];

const analysisItems = [
  { id: 1, name: "비건 디저트", tag: "공백시장", tagColor: "text-[#EA4F1E] bg-[#FFF7EF]", location: "객리단길", trend: 187, revenue: "32,400", chartData: [8500, 10200, 14800, 18200, 22100, 32400] },
  { id: 2, name: "수제 맥주", tag: "경쟁 있음", tagColor: "text-gray-500 bg-gray-100", location: "한옥마을", trend: 124, revenue: "28,700", chartData: [12000, 14500, 16800, 19200, 22000, 28700] },
  { id: 3, name: "로봇 카페", tag: "공백시장", tagColor: "text-[#EA4F1E] bg-[#FFF7EF]", location: "덕진동", trend: 156, revenue: "19,200", chartData: [6000, 7800, 10500, 13200, 16000, 19200] },
  { id: 4, name: "제로 웨이스트샵", tag: "공백시장", tagColor: "text-[#EA4F1E] bg-[#FFF7EF]", location: "효자동", trend: 98, revenue: "15,600", chartData: [4200, 5800, 7800, 10000, 12500, 15600] },
  { id: 5, name: "반려동물 카페", tag: "경쟁 있음", tagColor: "text-gray-500 bg-gray-100", location: "송천동", trend: 89, revenue: "24,300", chartData: [9000, 11000, 14000, 17500, 20000, 24300] },
  { id: 6, name: "무인 아이스크림", tag: "공백시장", tagColor: "text-[#EA4F1E] bg-[#FFF7EF]", location: "서신동", trend: 134, revenue: "21,800", chartData: [7500, 9800, 12500, 15200, 18000, 21800] },
  { id: 7, name: "프리미엄 김밥", tag: "경쟁 있음", tagColor: "text-gray-500 bg-gray-100", location: "남부시장", trend: 112, revenue: "18,500", chartData: [5000, 7000, 9500, 12000, 14800, 18500] },
  { id: 8, name: "건강 도시락", tag: "공백시장", tagColor: "text-[#EA4F1E] bg-[#FFF7EF]", location: "인후동", trend: 76, revenue: "16,900", chartData: [4500, 6000, 8000, 10500, 13000, 16900] },
];

type AnalysisItem = typeof analysisItems[0];

const closureData = [
  { name: "커피/음료",      one: 18.3, three: 42.1, stores: 847,  risk: "높음" as const },
  { name: "치킨/피자",      one: 22.5, three: 51.3, stores: 623,  risk: "매우높음" as const },
  { name: "한식",           one: 15.2, three: 38.7, stores: 1204, risk: "중간" as const },
  { name: "디저트/베이커리", one: 20.1, three: 45.8, stores: 389,  risk: "높음" as const },
  { name: "무인매장",        one:  8.4, three: 24.6, stores: 156,  risk: "낮음" as const },
  { name: "반려동물 관련",   one: 12.3, three: 31.5, stores: 234,  risk: "중간" as const },
  { name: "건강식/샐러드",   one: 16.8, three: 39.2, stores: 178,  risk: "중간" as const },
  { name: "주류/바",         one: 25.6, three: 58.4, stores: 312,  risk: "매우높음" as const },
];

const riskStyle = {
  낮음:   "bg-green-100 text-green-700",
  중간:   "bg-amber-100 text-amber-700",
  높음:   "bg-orange-100 text-orange-700",
  매우높음: "bg-red-100 text-red-700",
};

type PromisingItem = {
  id: number; name: string; iconBg: string; location: string; competition: number;
  score: number; description: string; revenue: string; startCost: string;
  closureRate: string; radar: number[]; opportunities: string[]; risks: string[]; target: string;
};

const promisingItems: PromisingItem[] = [
  {
    id: 1, name: "비건 디저트 전문점", iconBg: "bg-orange-500", location: "객리단길", competition: 0, score: 92,
    description: "객리단길 일대에서 '비건 디저트' 검색량이 6개월간 187% 증가했으나, 현재 전문점이 전무합니다. 다만 디저트업종 전체 3년 폐업률이 55.8%로 높아 차별화 전략이 필수적입니다.",
    revenue: "1,800", startCost: "3,000~5,000", closureRate: "24.3",
    radar: [92, 85, 78, 65, 70, 88],
    opportunities: ["검색량 급증 (6개월 187%↑)", "동네 내 경쟁 매장 0개", "MZ세대 트렌드 부합", "객리단길 유동인구 증가세"],
    risks: ["디저트 업종 폐업률 높음 (55.8%/3년)", "원재료 단가 일반 디저트 대비 30%↑", "타깃 고객층 제한적", "계절별 수요 편차 존재"],
    target: "20~30대 여성, 건강 관심층",
  },
  {
    id: 2, name: "로봇 서빙 카페", iconBg: "bg-violet-500", location: "덕진동", competition: 0, score: 78,
    description: "덕진동(전북대 인근)에서 로봇 카페 관심도가 156% 급증 중이나 초기 투자비용이 높습니다. 전북대 학생 및 가족 단위 고객을 타깃으로 SNS 바이럴 효과가 기대됩니다.",
    revenue: "2,200", startCost: "8,000~12,000", closureRate: "18.2",
    radar: [78, 88, 72, 68, 45, 80],
    opportunities: ["로봇 카페 관심도 156% 급증", "전북대 인근 대학생 유동인구", "SNS 인증 명소 가능성", "경쟁 매장 전무"],
    risks: ["초기 투자비용 높음 (8,000만~1.2억)", "로봇 장비 유지보수 비용", "기술 트렌드 변화 리스크", "주말·방학 수요 편중"],
    target: "대학생, 가족 단위 고객, SNS 인플루언서",
  },
  {
    id: 3, name: "건강 도시락 전문점", iconBg: "bg-green-500", location: "인후동", competition: 1, score: 85,
    description: "인후동 직장인 밀집 지역에서 건강 도시락 검색이 꾸준히 증가하고 있으며, 기존 매장 1개뿐입니다. 초기 비용이 상대적으로 낮고, 배달 전용으로도 운영 가능합니다.",
    revenue: "1,500", startCost: "2,000~3,500", closureRate: "19.6",
    radar: [85, 80, 75, 82, 78, 76],
    opportunities: ["직장인 밀집 지역 수요 안정적", "배달 전용 운영으로 비용 절감 가능", "기존 경쟁 매장 1개만 존재", "건강식 트렌드 지속 성장"],
    risks: ["점심 피크타임 집중 리스크", "재료 신선도 관리 필수", "대형 배달앱 수수료 부담", "경쟁 매장 추가 진입 가능성"],
    target: "직장인, 다이어터, 1인 가구",
  },
  {
    id: 4, name: "무인 프리미엄 스터디카페", iconBg: "bg-blue-500", location: "금암동", competition: 2, score: 80,
    description: "금암동 학원가 인근에서 프리미엄 스터디카페 수요가 증가 중입니다. 무인 운영으로 인건비를 최소화할 수 있으며, 24시간 운영이 가능합니다.",
    revenue: "1,200", startCost: "5,000~8,000", closureRate: "12.8",
    radar: [80, 72, 82, 88, 85, 70],
    opportunities: ["학원가 밀집 안정적 수요", "무인 운영으로 인건비 절감", "24시간 365일 운영 가능", "멤버십 구독 수익 확보 용이"],
    risks: ["초기 인테리어·설비 비용 높음", "경쟁 스터디카페 증가 추세", "시설 노후화 시 재투자 필요", "심야 안전 관리 이슈"],
    target: "고등학생, 취준생, 수험생",
  },
  {
    id: 5, name: "반려동물 간식 카페", iconBg: "bg-pink-500", location: "송천동", competition: 1, score: 74,
    description: "송천동 주거 밀집 지역에서 반려동물 동반 카페 검색량이 꾸준히 상승 중입니다. 반려견 동반 입장 가능 카페로 차별화하면 충성 고객 확보가 용이합니다.",
    revenue: "1,100", startCost: "4,000~6,000", closureRate: "16.4",
    radar: [74, 75, 65, 72, 68, 72],
    opportunities: ["반려동물 인구 지속 증가", "동반 입장 가능 공간 희소", "SNS 인증 수요 높음", "충성 고객 확보 용이"],
    risks: ["위생 기준 충족 비용 높음", "반려동물 사고 리스크", "비반려인 고객 이탈 가능", "관련 법규 변경 리스크"],
    target: "반려동물 보호자, 20~40대",
  },
];

const radarAxes = ["검색트렌드", "경쟁강도", "수익성", "지속가능성", "진입장벽", "성장성"];

function RadarChart({ values }: { values: number[] }) {
  const cx = 200, cy = 200, R = 130;
  const angle = (i: number) => (i * 60 - 90) * Math.PI / 180;
  const pt = (i: number, r: number): [number, number] => [cx + r * Math.cos(angle(i)), cy + r * Math.sin(angle(i))];
  const poly = (scale: number) => Array.from({ length: 6 }, (_, i) => pt(i, R * scale).join(",")).join(" ");
  const dataPoly = values.map((v, i) => pt(i, (v / 100) * R).join(",")).join(" ");
  const anchors: ("middle" | "start" | "end")[] = ["middle", "start", "start", "middle", "end", "end"];

  return (
    <svg viewBox="0 0 400 400" className="w-full max-w-xs mx-auto">
      {[0.25, 0.5, 0.75, 1].map(s => (
        <polygon key={s} points={poly(s)} fill="none" stroke="#e5e7eb" strokeWidth="1" />
      ))}
      {Array.from({ length: 6 }, (_, i) => {
        const [x, y] = pt(i, R);
        return <line key={i} x1={cx} y1={cy} x2={x} y2={y} stroke="#e5e7eb" strokeWidth="1" />;
      })}
      <polygon points={dataPoly} fill="#EA4F1E" fillOpacity="0.18" stroke="#EA4F1E" strokeWidth="2" />
      {values.map((v, i) => {
        const [x, y] = pt(i, (v / 100) * R);
        return <circle key={i} cx={x} cy={y} r="4" fill="#EA4F1E" />;
      })}
      {radarAxes.map((label, i) => {
        const [x, y] = pt(i, R + 26);
        return (
          <text key={i} x={x} y={y} textAnchor={anchors[i]} dominantBaseline="middle" fontSize="11" fill="#6b7280">
            {label}
          </text>
        );
      })}
    </svg>
  );
}

function PromisingTab() {
  const [detail, setDetail] = useState<PromisingItem | null>(null);

  if (detail) {
    return (
      <div>
        <button
          onClick={() => setDetail(null)}
          className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 mb-4 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          목록으로
        </button>

        {/* 상단 정보 */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 mb-4">
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 ${detail.iconBg} rounded-xl flex items-center justify-center shrink-0`}>
                <Lightbulb className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">{detail.name}</h3>
                <p className="text-sm text-gray-500 flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3 h-3" />
                  {detail.location} · 경쟁 {detail.competition}개
                </p>
              </div>
            </div>
            <span className="flex items-center gap-1 text-sm font-bold text-amber-500 bg-amber-50 border border-amber-100 px-3 py-1.5 rounded-full shrink-0">
              ☆ {detail.score}점
            </span>
          </div>
          <p className="text-sm text-gray-600 mb-3">{detail.description}</p>
          <div className="flex items-center gap-5 text-sm flex-wrap">
            <span>🔥 예상매출: <strong className="text-gray-800">월 {detail.revenue}만원</strong></span>
            <span>📊 초기비용: <strong className="text-gray-800">{detail.startCost}만원</strong></span>
            <span>📉 폐업률: <strong className="text-[#EA4F1E]">{detail.closureRate}%/1년</strong></span>
          </div>
        </div>

        {/* 레이더 차트 */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 mb-4">
          <h4 className="text-base font-bold text-gray-900 mb-2">종합 평가</h4>
          <RadarChart values={detail.radar} />
        </div>

        {/* 기회 / 리스크 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="bg-green-50 border border-green-100 rounded-xl p-4">
            <h5 className="text-sm font-bold text-green-700 mb-3 flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4" />
              기회 요인
            </h5>
            <ul className="space-y-1.5">
              {detail.opportunities.map((o, i) => (
                <li key={i} className="text-sm text-green-800 flex items-start gap-1.5">
                  <span className="text-green-500 mt-0.5">•</span>{o}
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-red-50 border border-red-100 rounded-xl p-4">
            <h5 className="text-sm font-bold text-red-700 mb-3 flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4" />
              리스크 요인
            </h5>
            <ul className="space-y-1.5">
              {detail.risks.map((r, i) => (
                <li key={i} className="text-sm text-red-800 flex items-start gap-1.5">
                  <span className="text-red-400 mt-0.5">•</span>{r}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* 타깃 */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm px-4 py-3">
          <p className="text-sm text-gray-700">
            <span className="mr-1 text-base">🎯</span>
            <strong>주요 타깃 고객:</strong> {detail.target}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {promisingItems.map(item => (
        <div key={item.id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-shadow">
          <div className="flex items-start gap-3">
            <div className={`w-12 h-12 ${item.iconBg} rounded-xl flex items-center justify-center shrink-0`}>
              <Lightbulb className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2 mb-1">
                <div>
                  <h3 className="text-base font-bold text-gray-900">{item.name}</h3>
                  <p className="text-sm text-gray-500 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3" />
                    {item.location} · 경쟁 {item.competition}개
                  </p>
                </div>
                <span className="flex items-center gap-1 text-sm font-bold text-amber-500 bg-amber-50 border border-amber-100 px-2.5 py-1 rounded-full shrink-0">
                  ☆ {item.score}점
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-3 line-clamp-2">{item.description}</p>
              <div className="flex items-center gap-5 text-sm text-gray-500 mb-3 flex-wrap">
                <span>🔥 예상매출: <strong className="text-gray-700">월 {item.revenue}만원</strong></span>
                <span>📊 초기비용: <strong className="text-gray-700">{item.startCost}만원</strong></span>
                <span>📉 폐업률: <strong className="text-[#EA4F1E]">{item.closureRate}%/1년</strong></span>
              </div>
              <button
                onClick={() => setDetail(item)}
                className="flex items-center gap-1 text-sm font-semibold text-[#EA4F1E] hover:text-[#D44418] transition-colors"
              >
                상세 분석 보기
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function ClosureAnalysis() {
  const W = 700, padL = 148, padR = 56, padT = 44, padB = 16;
  const ROW = 48;
  const H = padT + closureData.length * ROW + padB;
  const chartW = W - padL - padR;
  const maxVal = 65;

  const barW = (v: number) => (v / maxVal) * chartW;

  return (
    <div>
      {/* 고지 */}
      <div className="flex items-start gap-2 bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 mb-5 text-sm text-gray-700">
        <AlertCircle className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
        <p>아래 데이터는 <strong>전북 전주시 기준</strong> 최근 공공 상권 통계입니다. 실제 창업 여부 결정 시 반드시 추가 현장 조사를 진행하세요.</p>
      </div>

      {/* 차트 카드 */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 mb-5">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h4 className="text-base font-bold text-gray-900">업종별 폐업률 비교</h4>
            <p className="text-sm text-gray-400 mt-0.5">전주시 기준 · 1년/3년 폐업률 (%)</p>
          </div>
          {/* 범례 */}
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm bg-[#EA4F1E] inline-block" />
              1년 폐업률
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm bg-red-600 inline-block" />
              3년 폐업률
            </span>
          </div>
        </div>

        <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
          {/* 배경 그리드 */}
          {[0, 20, 40, 60].map(pct => {
            const x = padL + (pct / maxVal) * chartW;
            return (
              <g key={pct}>
                <line x1={x} x2={x} y1={padT - 20} y2={padT + closureData.length * ROW}
                  stroke="#f3f4f6" strokeWidth="1" />
                <text x={x} y={padT - 6} textAnchor="middle" fontSize="11" fill="#9ca3af">{pct}%</text>
              </g>
            );
          })}

          {closureData.map((d, i) => {
            const rowY = padT + i * ROW;
            const w1 = barW(d.one);
            const w3 = barW(d.three);
            return (
              <g key={d.name}>
                {/* 카테고리 레이블 */}
                <text x={padL - 10} y={rowY + 18} textAnchor="end" fontSize="12" fill="#374151" fontWeight="500">
                  {d.name}
                </text>

                {/* 1년 막대 */}
                <rect x={padL} y={rowY + 3} width={w1} height={14} rx="3" fill="#EA4F1E" opacity="0.9" />
                <text x={padL + w1 + 5} y={rowY + 14} fontSize="11" fill="#EA4F1E" fontWeight="600">
                  {d.one}%
                </text>

                {/* 3년 막대 */}
                <rect x={padL} y={rowY + 22} width={w3} height={14} rx="3" fill="#DC2626" opacity="0.85" />
                <text x={padL + w3 + 5} y={rowY + 33} fontSize="11" fill="#DC2626" fontWeight="600">
                  {d.three}%
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* 상세 카드 그리드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {closureData.map(d => (
          <div key={d.name} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                  <ShieldAlert className="w-4 h-4 text-gray-500" />
                </div>
                <span className="text-base font-bold text-gray-900">{d.name}</span>
              </div>
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${riskStyle[d.risk]}`}>
                리스크 {d.risk}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="bg-orange-50 rounded-lg py-2.5">
                <p className="text-xs text-gray-500 mb-0.5">1년 폐업률</p>
                <p className="text-base font-bold text-[#EA4F1E]">{d.one}%</p>
              </div>
              <div className="bg-red-50 rounded-lg py-2.5">
                <p className="text-xs text-gray-500 mb-0.5">3년 폐업률</p>
                <p className="text-base font-bold text-red-600">{d.three}%</p>
              </div>
              <div className="bg-gray-50 rounded-lg py-2.5">
                <p className="text-xs text-gray-500 mb-0.5">전주 매장수</p>
                <p className="text-base font-bold text-gray-700">{d.stores.toLocaleString()}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function TrendChart({ item }: { item: AnalysisItem }) {
  const [hovered, setHovered] = useState<number | null>(null);
  const W = 800, H = 240;
  const padL = 64, padR = 32, padT = 24, padB = 40;
  const chartW = W - padL - padR;
  const chartH = H - padT - padB;

  const data = item.chartData;
  const maxVal = Math.ceil(Math.max(...data) * 1.15 / 1000) * 1000;
  const minVal = 0;

  const xPos = (i: number) => padL + (i / (data.length - 1)) * chartW;
  const yPos = (v: number) => padT + (1 - (v - minVal) / (maxVal - minVal)) * chartH;

  const pathD = data.map((v, i) => `${i === 0 ? "M" : "L"} ${xPos(i).toFixed(1)} ${yPos(v).toFixed(1)}`).join(" ");

  const yTicks = [0, 0.25, 0.5, 0.75, 1].map(r => Math.round(maxVal * r / 500) * 500);

  const tooltipX = hovered !== null ? xPos(hovered) : 0;
  const tooltipFlip = tooltipX > W - padR - 160;

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 mt-4">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h4 className="text-base font-bold text-gray-900">"{item.name}" 검색량 추이</h4>
          <p className="text-sm text-gray-400 mt-0.5">최근 6개월 네이버 검색 트렌드 (전주 지역)</p>
        </div>
        <span className="flex items-center gap-1 text-sm font-semibold text-[#EA4F1E] bg-[#FFF7EF] px-3 py-1 rounded-full">
          <TrendingUp className="w-3.5 h-3.5" />
          상승세
        </span>
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" onMouseLeave={() => setHovered(null)}>
        {/* 가로 그리드 + Y축 레이블 */}
        {yTicks.map(tick => (
          <g key={tick}>
            <line x1={padL} x2={W - padR} y1={yPos(tick)} y2={yPos(tick)} stroke="#f3f4f6" strokeWidth="1" />
            <text x={padL - 8} y={yPos(tick) + 4} textAnchor="end" fontSize="11" fill="#9ca3af">
              {tick === 0 ? "0" : (tick / 1000).toFixed(0) + "k"}
            </text>
          </g>
        ))}
        {/* X축 레이블 */}
        {chartMonths.map((m, i) => (
          <text key={m} x={xPos(i)} y={H - 6} textAnchor="middle" fontSize="12" fill="#9ca3af">{m}</text>
        ))}
        {/* 라인 */}
        <path d={pathD} fill="none" stroke="#EA4F1E" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        {/* 점 */}
        {data.map((v, i) => (
          <circle key={i} cx={xPos(i)} cy={yPos(v)} r={hovered === i ? 6 : 4}
            fill={hovered === i ? "#EA4F1E" : "white"} stroke="#EA4F1E" strokeWidth="2.5" />
        ))}
        {/* 호버 영역 */}
        {data.map((_, i) => (
          <rect key={i}
            x={xPos(i) - chartW / (data.length * 2)}
            y={padT} width={chartW / (data.length - 1)} height={chartH}
            fill="transparent" style={{ cursor: "pointer" }}
            onMouseEnter={() => setHovered(i)}
          />
        ))}
        {/* 툴팁 */}
        {hovered !== null && (
          <g>
            <line x1={xPos(hovered)} x2={xPos(hovered)} y1={padT} y2={padT + chartH}
              stroke="#EA4F1E" strokeWidth="1" strokeDasharray="4,3" opacity="0.5" />
            <rect
              x={tooltipFlip ? xPos(hovered) - 148 : xPos(hovered) + 10}
              y={yPos(data[hovered]) - 34}
              width={136} height={48} rx="8"
              fill="white" stroke="#e5e7eb" strokeWidth="1"
              style={{ filter: "drop-shadow(0 1px 4px rgba(0,0,0,0.08))" }}
            />
            <text
              x={tooltipFlip ? xPos(hovered) - 148 + 14 : xPos(hovered) + 24}
              y={yPos(data[hovered]) - 14}
              fontSize="12" fill="#374151" fontWeight="600"
            >
              {chartMonths[hovered]}
            </text>
            <text
              x={tooltipFlip ? xPos(hovered) - 148 + 14 : xPos(hovered) + 24}
              y={yPos(data[hovered]) + 6}
              fontSize="12" fill="#EA4F1E" fontWeight="700"
            >
              검색량 : {data[hovered].toLocaleString()}회
            </text>
          </g>
        )}
      </svg>
    </div>
  );
}

function formatNum(n: number) {
  return n >= 1000 ? (n / 1000).toFixed(1) + "k" : n.toString();
}

export default function CommunityPage() {
  const [mainTab, setMainTab] = useState("게시판");
  const [sortTab, setSortTab] = useState("전체");
  const [category, setCategory] = useState("전체");
  const [search, setSearch] = useState("");
  const [showWriteForm, setShowWriteForm] = useState(false);
  const [writeCategory, setWriteCategory] = useState("자유게시판");
  const [writeTitle, setWriteTitle] = useState("");
  const [writeContent, setWriteContent] = useState("");
  const [analysisSubTab, setAnalysisSubTab] = useState("검색 트렌드");
  const [analysisLocation, setAnalysisLocation] = useState("전체");
  const [selectedItem, setSelectedItem] = useState<AnalysisItem>(analysisItems[0]);

  const filtered = posts.filter(p => {
    const matchCat = category === "전체" || p.category === category;
    const matchSearch = !search || p.title.includes(search) || p.preview.includes(search);
    const matchSort = sortTab === "전체" || (sortTab === "인기" && p.hot);
    return matchCat && matchSearch && matchSort;
  });

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />

      {/* 페이지 헤더 */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-base text-gray-500 mb-2">
                <span>홈</span>
                <ChevronRight className="w-4 h-4" />
                <span className="text-[#EA4F1E] font-medium">커뮤니티</span>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                <div className="w-9 h-9 bg-green-500 rounded-lg flex items-center justify-center shrink-0">
                  <MessageCircle className="w-5 h-5 text-white" />
                </div>
                사장님 커뮤니티
              </h1>
              <p className="text-gray-500 mt-1 text-base">업종별 노하우 공유 · 경영 고민 상담 · 데이터 기반 분석</p>
            </div>
            {mainTab === "게시판" && (
              <button
                onClick={() => setShowWriteForm(v => !v)}
                className="flex items-center gap-2 text-base font-semibold text-white bg-[#EA4F1E] hover:bg-[#D44418] rounded-lg px-5 py-2.5 transition-colors shrink-0 mt-1"
              >
                <Edit3 className="w-4 h-4" />
                글쓰기
              </button>
            )}
          </div>

          {/* 메인 탭 */}
          <div className="flex gap-1 mt-6">
            {mainTabs.map(tab => (
              <button
                key={tab}
                onClick={() => setMainTab(tab)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-base font-semibold transition-colors ${
                  mainTab === tab
                    ? "bg-[#EA4F1E] text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {tab === "게시판" && <MessageCircle className="w-4 h-4" />}
                {tab === "창업·메뉴 분석" && <BarChart2 className="w-4 h-4" />}
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 w-full flex-1">
        {mainTab === "게시판" ? (
          <div>
            {/* 글 작성 폼 */}
            {showWriteForm && (
              <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 mb-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base font-bold text-gray-900">새 글 작성</h3>
                  <button
                    onClick={() => { setShowWriteForm(false); setWriteTitle(""); setWriteContent(""); }}
                    className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* 카테고리 + 제목 */}
                <div className="flex gap-3 mb-3">
                  <select
                    value={writeCategory}
                    onChange={e => setWriteCategory(e.target.value)}
                    className="text-base border border-gray-200 rounded-lg px-3 py-2.5 text-gray-700 focus:outline-none focus:border-[#EA4F1E] bg-white shrink-0"
                  >
                    {categories.filter(c => c !== "전체").map(c => (
                      <option key={c}>{c}</option>
                    ))}
                  </select>
                  <input
                    type="text"
                    placeholder="제목을 입력하세요"
                    value={writeTitle}
                    onChange={e => setWriteTitle(e.target.value)}
                    className="flex-1 text-base border border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#EA4F1E]/20 focus:border-[#EA4F1E] transition-colors"
                  />
                </div>

                {/* 본문 */}
                <textarea
                  placeholder="다른 사장님들과 나누고 싶은 이야기를 자유롭게 적어주세요..."
                  value={writeContent}
                  onChange={e => setWriteContent(e.target.value)}
                  rows={6}
                  className="w-full text-base border border-gray-200 rounded-lg px-4 py-3 resize-none focus:outline-none focus:ring-2 focus:ring-[#EA4F1E]/20 focus:border-[#EA4F1E] transition-colors text-gray-700 placeholder-gray-400"
                />

                {/* 하단 액션 */}
                <div className="flex items-center justify-between mt-3">
                  <button className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 transition-colors">
                    <ImagePlus className="w-4 h-4" />
                    사진 첨부
                  </button>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => { setShowWriteForm(false); setWriteTitle(""); setWriteContent(""); }}
                      className="px-4 py-2 text-base font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      취소
                    </button>
                    <button className="px-5 py-2 text-base font-semibold text-white bg-[#EA4F1E] hover:bg-[#D44418] rounded-lg transition-colors">
                      등록하기
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* 검색 */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 mb-5">
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="게시글 검색..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 text-base bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#EA4F1E]/20 focus:border-[#EA4F1E] transition-colors"
                />
              </div>
            </div>

            {/* 정렬 탭 */}
            <div className="flex items-center gap-2 mb-4">
              {sortTabs.map(({ label, icon: Icon }) => (
                <button
                  key={label}
                  onClick={() => setSortTab(label)}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-base font-medium transition-colors ${
                    sortTab === label
                      ? "bg-[#EA4F1E] text-white"
                      : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  {Icon && <Icon className="w-4 h-4" />}
                  {label}
                </button>
              ))}
            </div>

            {/* 카테고리 탭 */}
            <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none mb-5 pb-1">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`shrink-0 text-base px-4 py-2 rounded-full font-medium transition-colors ${
                    category === cat
                      ? "bg-gray-900 text-white"
                      : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* 게시글 목록 */}
            <div className="space-y-3">
              {filtered.map(post => (
                <div
                  key={post.id}
                  className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow cursor-pointer p-5"
                >
                  <div className="flex items-start gap-4">
                    {/* 아바타 */}
                    <div className={`w-11 h-11 ${post.avatarBg} rounded-full flex items-center justify-center text-xl shrink-0`}>
                      {post.avatar}
                    </div>

                    <div className="flex-1 min-w-0">
                      {/* 배지 */}
                      <div className="flex items-center gap-1.5 mb-2 flex-wrap">
                        {post.pinned && (
                          <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-gray-200 text-gray-600">
                            고정
                          </span>
                        )}
                        {post.hot && (
                          <span className="flex items-center gap-0.5 text-xs font-bold px-2 py-0.5 rounded-full bg-orange-100 text-orange-600">
                            <Flame className="w-3 h-3" />
                            HOT
                          </span>
                        )}
                        <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
                          {post.category}
                        </span>
                      </div>

                      {/* 제목 */}
                      <h3 className="text-base font-semibold text-gray-900 mb-1 leading-snug">
                        {post.title}
                      </h3>

                      {/* 미리보기 */}
                      <p className="text-sm text-gray-500 line-clamp-1 mb-3">
                        {post.preview}
                      </p>

                      {/* 메타 */}
                      <div className="flex items-center gap-3 text-sm text-gray-400">
                        <span className="font-medium text-gray-600">{post.author}</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          {post.time}
                        </span>
                        <span className="flex items-center gap-1">
                          <Eye className="w-3.5 h-3.5" />
                          {formatNum(post.views)}
                        </span>
                        <span className="flex items-center gap-1 font-bold text-gray-700">
                          <ThumbsUp className="w-3.5 h-3.5 text-[#EA4F1E]" />
                          {post.likes}
                        </span>
                        <span className="flex items-center gap-1">
                          <MessageCircle className="w-3.5 h-3.5" />
                          {post.comments}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {filtered.length === 0 && (
                <div className="bg-white rounded-xl border border-gray-100 p-16 text-center">
                  <MessageCircle className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                  <p className="text-lg font-medium text-gray-500">게시글이 없습니다</p>
                  <p className="text-base text-gray-400 mt-1">다른 카테고리를 선택하거나 검색어를 바꿔보세요.</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div>
            {/* 분석 헤더 */}
            <div className="flex items-start gap-3 mb-4">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center shrink-0 mt-0.5">
                <BarChart2 className="w-5 h-5 text-[#EA4F1E]" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">데이터 기반 창업 · 메뉴 추천</h2>
                <p className="text-sm text-gray-500 mt-0.5">네이버 검색 트렌드 × 공공 상권 분석 × 폐업률 데이터</p>
              </div>
            </div>

            {/* 면책 고지 */}
            <div className="flex items-start gap-2 bg-orange-50 border border-orange-100 rounded-xl px-4 py-3 mb-5 text-sm text-gray-700">
              <AlertCircle className="w-4 h-4 text-[#EA4F1E] shrink-0 mt-0.5" />
              <p>본 데이터는 네이버 검색 트렌드와 공공 상권정보를 기반으로 한 <strong className="text-[#EA4F1E]">참고용 분석</strong>입니다. 실제 창업 및 메뉴 변경 시에는 반드시 현장 조사와 전문가 상담을 병행하세요.</p>
            </div>

            {/* 서브 탭 */}
            <div className="flex items-center gap-2 mb-5">
              {analysisSubTabs.map(tab => {
                const Icon = tab === "검색 트렌드" ? TrendingUp : tab === "폐업률 분석" ? ShieldAlert : Lightbulb;
                return (
                  <button
                    key={tab}
                    onClick={() => setAnalysisSubTab(tab)}
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-base font-medium transition-colors ${
                      analysisSubTab === tab
                        ? "bg-[#EA4F1E] text-white"
                        : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {tab}
                  </button>
                );
              })}
            </div>

            {analysisSubTab === "검색 트렌드" && (
              <>
                {/* 지역 필터 */}
                <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none mb-5 pb-1">
                  {analysisLocations.map(loc => (
                    <button
                      key={loc}
                      onClick={() => setAnalysisLocation(loc)}
                      className={`shrink-0 flex items-center gap-1 text-sm px-3 py-1.5 rounded-full font-medium transition-colors ${
                        analysisLocation === loc
                          ? "bg-orange-100 text-[#EA4F1E] border border-orange-200"
                          : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      {loc !== "전체" && <MapPin className="w-3 h-3" />}
                      {loc}
                    </button>
                  ))}
                </div>

                {/* 아이템 그리드 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {analysisItems
                    .filter(item => analysisLocation === "전체" || item.location === analysisLocation)
                    .map(item => {
                      const isSelected = selectedItem.id === item.id;
                      return (
                        <div
                          key={item.id}
                          onClick={() => setSelectedItem(item)}
                          className={`rounded-xl border shadow-sm p-4 cursor-pointer transition-all ${
                            isSelected
                              ? "bg-[#FFF7EF] border-[#EA4F1E]/40 shadow-md"
                              : "bg-white border-gray-100 hover:shadow-md hover:border-gray-200"
                          }`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <span className={`w-7 h-7 rounded-full text-sm font-bold flex items-center justify-center shrink-0 ${
                                isSelected ? "bg-[#EA4F1E] text-white" : "bg-gray-100 text-gray-600"
                              }`}>
                                {item.id}
                              </span>
                              <span className="text-base font-bold text-gray-900">{item.name}</span>
                            </div>
                            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${item.tagColor}`}>
                              {item.tag === "공백시장" ? "✦ " : ""}{item.tag}
                            </span>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-gray-500 pl-9">
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3.5 h-3.5 text-gray-400" />
                              {item.location}
                            </span>
                            <span className="flex items-center gap-1 text-[#EA4F1E] font-semibold">
                              <TrendingUp className="w-3.5 h-3.5" />
                              {item.trend}%
                            </span>
                            <span className="flex items-center gap-1 text-gray-600">
                              <Coins className="w-3.5 h-3.5 text-gray-400" />
                              {item.revenue}/월
                            </span>
                          </div>
                        </div>
                      );
                    })}
                </div>

                {/* 트렌드 차트 */}
                <TrendChart item={selectedItem} />
              </>
            )}

            {analysisSubTab === "폐업률 분석" && <ClosureAnalysis />}

            {analysisSubTab === "유망 아이템 추천" && <PromisingTab />}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}

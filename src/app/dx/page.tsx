"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Wrench, Package, BookOpen, Users, Calculator, Plus, Trash2, TrendingUp, TrendingDown, Wallet } from "lucide-react";

type DxTab = "재고 관리" | "매출/지출 장부" | "직원 근무관리" | "마진 계산기";
type ItemCategory = "식재료" | "소모품" | "음료";
type WorkStatus = "근무중" | "예정" | "퇴근" | "휴무";

interface Employee {
  id: number;
  name: string;
  role: string;
  hourlyWage: number;
  phone: string;
  status: WorkStatus;
  weeklyHours: number;
  todayStart?: string;
  todayEnd?: string;
  avatarColor: string;
}

interface InventoryItem {
  id: number;
  name: string;
  barcode: string;
  category: ItemCategory;
  stock: number;
  unit: string;
  minStock: number;
  lastUpdated: string;
}

function formatDate(d: Date) {
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}`;
}

const INITIAL_INVENTORY: InventoryItem[] = [
  { id: 1, name: "쌀 (10kg)", barcode: "8801234567890", category: "식재료", stock: 5, unit: "포", minStock: 2, lastUpdated: "2026.02.24" },
  { id: 2, name: "식용유 (1.8L)", barcode: "8801234567891", category: "식재료", stock: 12, unit: "병", minStock: 5, lastUpdated: "2026.02.24" },
  { id: 3, name: "일회용 컵 (1000개)", barcode: "8801234567892", category: "소모품", stock: 3, unit: "박스", minStock: 2, lastUpdated: "2026.02.24" },
  { id: 4, name: "냅킨 (500매)", barcode: "8801234567893", category: "소모품", stock: 8, unit: "팩", minStock: 3, lastUpdated: "2026.02.24" },
  { id: 5, name: "돼지고기 삼겹살 (1kg)", barcode: "8801234567894", category: "식재료", stock: 15, unit: "팩", minStock: 5, lastUpdated: "2026.02.24" },
  { id: 6, name: "코카콜라 (1.5L)", barcode: "8801234567895", category: "음료", stock: 20, unit: "병", minStock: 10, lastUpdated: "2026.02.23" },
];

/* ───── 장부 타입 ───── */
type EntryType = "매출" | "지출";
type PaymentMethod = "카드" | "현금" | "앱결제" | "계좌이체";
interface LedgerEntry {
  id: number;
  date: string;
  type: EntryType;
  category: string;
  description: string;
  amount: number;
  payment: PaymentMethod;
}

const SALES_CATEGORIES = ["현장매출", "배달매출", "기타매출"];
const EXPENSE_CATEGORIES = ["식재료", "인건비", "공급금", "소모품", "기타"];
const PAYMENT_METHODS: PaymentMethod[] = ["카드", "현금", "앱결제", "계좌이체"];
const EXPENSE_COLORS: Record<string, string> = {
  식재료: "#EF4444", 인건비: "#F59E0B", 공급금: "#3B82F6", 소모품: "#8B5CF6", 기타: "#6B7280",
};
const WEEK_DATES = [
  { label: "2/18(화)", date: "2026.02.18" },
  { label: "2/19(수)", date: "2026.02.19" },
  { label: "2/20(목)", date: "2026.02.20" },
  { label: "2/21(금)", date: "2026.02.21" },
  { label: "2/22(토)", date: "2026.02.22" },
  { label: "2/23(일)", date: "2026.02.23" },
  { label: "2/24(월)", date: "2026.02.24" },
];
const INITIAL_LEDGER: LedgerEntry[] = [
  { id: 1, date: "2026.02.24", type: "매출", category: "현장매출", description: "점심 매출", amount: 520000, payment: "카드" },
  { id: 2, date: "2026.02.24", type: "매출", category: "배달매출", description: "배민/쿠팡이츠", amount: 380000, payment: "앱결제" },
  { id: 3, date: "2026.02.24", type: "지출", category: "식재료", description: "농산물 시장 장보기", amount: 185000, payment: "현금" },
  { id: 4, date: "2026.02.24", type: "지출", category: "인건비", description: "아르바이트 일당 (2명)", amount: 180000, payment: "계좌이체" },
  { id: 5, date: "2026.02.23", type: "매출", category: "현장매출", description: "점심+저녁 매출", amount: 890000, payment: "카드" },
  { id: 6, date: "2026.02.23", type: "매출", category: "배달매출", description: "배달 매출", amount: 310000, payment: "앱결제" },
  { id: 7, date: "2026.02.23", type: "지출", category: "식재료", description: "정육점 고기 구매", amount: 230000, payment: "카드" },
  { id: 8, date: "2026.02.22", type: "매출", category: "현장매출", description: "저녁 매출", amount: 450000, payment: "카드" },
  { id: 9, date: "2026.02.22", type: "지출", category: "공급금", description: "주류 공급업체", amount: 148000, payment: "계좌이체" },
  { id: 10, date: "2026.02.21", type: "매출", category: "현장매출", description: "점심+저녁 매출", amount: 350000, payment: "카드" },
  { id: 11, date: "2026.02.21", type: "지출", category: "소모품", description: "일회용품 구매", amount: 50000, payment: "현금" },
  { id: 12, date: "2026.02.20", type: "매출", category: "현장매출", description: "점심 매출", amount: 280000, payment: "카드" },
  { id: 13, date: "2026.02.20", type: "지출", category: "인건비", description: "파트타임 일급", amount: 120000, payment: "계좌이체" },
  { id: 14, date: "2026.02.19", type: "매출", category: "배달매출", description: "배달 매출", amount: 220000, payment: "앱결제" },
  { id: 15, date: "2026.02.18", type: "매출", category: "현장매출", description: "저녁 매출", amount: 250000, payment: "카드" },
];

function fmtAmt(n: number) { return n.toLocaleString("ko-KR") + "원"; }

const UNITS = ["개", "포", "병", "박스", "팩", "kg", "L"];
const CATEGORIES: ItemCategory[] = ["식재료", "소모품", "음료"];
const CATEGORY_COLORS: Record<ItemCategory, string> = {
  식재료: "#EA4F1E",
  소모품: "#F59E0B",
  음료: "#3B82F6",
};

const DX_TABS: { label: DxTab; Icon: React.ComponentType<{ className?: string }> }[] = [
  { label: "재고 관리", Icon: Package },
  { label: "매출/지출 장부", Icon: BookOpen },
  { label: "직원 근무관리", Icon: Users },
  { label: "마진 계산기", Icon: Calculator },
];

/* ───── 직원 근무관리 데이터 ───── */
const WORK_WEEK = [
  { label: "2/24(월)", date: "2026.02.24", isToday: true },
  { label: "2/25(화)", date: "2026.02.25" },
  { label: "2/26(수)", date: "2026.02.26" },
  { label: "2/27(목)", date: "2026.02.27" },
  { label: "2/28(금)", date: "2026.02.28" },
  { label: "3/1(토)", date: "2026.03.01" },
  { label: "3/2(일)", date: "2026.03.02" },
];

const INITIAL_EMPLOYEES: Employee[] = [
  { id: 1, name: "김서연", role: "홀 서빙",  hourlyWage: 10030, phone: "010-****-1234", status: "근무중", weeklyHours: 6,  todayStart: "10:00", todayEnd: "16:00", avatarColor: "#EA4F1E" },
  { id: 2, name: "이준호", role: "주방 보조", hourlyWage: 10030, phone: "010-****-5678", status: "근무중", weeklyHours: 6,  todayStart: "11:00", todayEnd: "16:00", avatarColor: "#14B8A6" },
  { id: 3, name: "박민지", role: "홀 서빙",  hourlyWage: 10530, phone: "010-****-9012", status: "예정",   weeklyHours: 5,  todayStart: "17:00", todayEnd: "22:00", avatarColor: "#94A3B8" },
  { id: 4, name: "정현우", role: "배달",     hourlyWage: 11000, phone: "010-****-3456", status: "휴무",   weeklyHours: 4,  avatarColor: "#22C55E" },
  { id: 5, name: "최유진", role: "주방 보조", hourlyWage: 10030, phone: "010-****-7890", status: "근무중", weeklyHours: 10, todayStart: "10:00", todayEnd: "20:00", avatarColor: "#A855F7" },
];

const WORK_SCHEDULE: Record<string, { empId: number; start: string; end: string }[]> = {
  "2026.02.24": [
    { empId: 1, start: "10:00", end: "16:00" },
    { empId: 2, start: "11:00", end: "16:00" },
    { empId: 3, start: "17:00", end: "22:00" },
    { empId: 5, start: "10:00", end: "20:00" },
  ],
  "2026.02.25": [
    { empId: 1, start: "10:00", end: "16:00" },
    { empId: 3, start: "17:00", end: "22:00" },
    { empId: 4, start: "11:00", end: "15:00" },
  ],
  "2026.02.26": [
    { empId: 2, start: "10:00", end: "16:00" },
    { empId: 5, start: "09:00", end: "19:00" },
  ],
  "2026.02.27": [
    { empId: 1, start: "10:00", end: "16:00" },
    { empId: 2, start: "10:00", end: "16:00" },
    { empId: 4, start: "11:00", end: "15:00" },
  ],
  "2026.02.28": [
    { empId: 1, start: "10:00", end: "16:00" },
    { empId: 3, start: "17:00", end: "22:00" },
    { empId: 5, start: "09:00", end: "19:00" },
  ],
  "2026.03.01": [
    { empId: 2, start: "10:00", end: "18:00" },
    { empId: 4, start: "11:00", end: "17:00" },
    { empId: 5, start: "10:00", end: "20:00" },
  ],
  "2026.03.02": [
    { empId: 1, start: "11:00", end: "17:00" },
    { empId: 3, start: "12:00", end: "18:00" },
  ],
};

/* ───── 툴팁 타입 ───── */
interface TooltipState {
  visible: boolean;
  x: number;
  y: number;
  lines: { label: string; value: string; color?: string }[];
}

/* ───── 바 차트 ───── */
function BarChart({ inventory }: { inventory: InventoryItem[] }) {
  const W = 560, H = 210, pl = 38, pb = 38, pt = 16;
  const chartW = W - pl - 12;
  const chartH = H - pb - pt;
  const maxVal = Math.max(20, ...inventory.map((i) => i.stock));
  const ySteps = [0, 5, 10, 15, 20].filter((v) => v <= maxVal + 1);
  const groupW = chartW / inventory.length;
  const bw = Math.min(22, groupW * 0.34);

  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const hoveredItem = hoveredIdx !== null ? inventory[hoveredIdx] : null;

  return (
    <div className="relative">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full"
        onMouseLeave={() => setHoveredIdx(null)}
      >
        {/* 그리드 라인 & Y 레이블 */}
        {ySteps.map((v) => {
          const y = pt + chartH - (v / maxVal) * chartH;
          return (
            <g key={v}>
              <line x1={pl} x2={W - 12} y1={y} y2={y} stroke="#e5e7eb" strokeWidth="1" strokeDasharray={v > 0 ? "3 3" : undefined} />
              <text x={pl - 5} y={y + 3.5} textAnchor="end" fontSize="9" fill="#9ca3af">{v}</text>
            </g>
          );
        })}

        {/* 1. 컬럼 하이라이트 (바 아래) */}
        {inventory.map((item, i) => {
          const gx = pl + i * groupW;
          return hoveredIdx === i ? (
            <rect key={`hl-${item.id}`} x={gx + 2} y={pt} width={groupW - 4} height={chartH} fill="#e5e7eb" opacity="0.55" rx="3" />
          ) : null;
        })}

        {/* 2. 모든 바 + X레이블 */}
        {inventory.map((item, i) => {
          const gx = pl + i * groupW;
          const cx = gx + groupW / 2;
          const stockH = (item.stock / maxVal) * chartH;
          const minH = (item.minStock / maxVal) * chartH;
          const label = item.name.length > 7 ? item.name.slice(0, 7) + "…" : item.name;
          return (
            <g key={`bar-${item.id}`}>
              <rect x={cx - bw - 1} y={pt + chartH - stockH} width={bw} height={stockH} fill="#EA4F1E" rx="2" />
              <rect x={cx + 1} y={pt + chartH - minH} width={bw} height={minH} fill="#FDBA74" rx="2" />
              <text x={cx} y={H - 4} textAnchor="middle" fontSize="8.5" fill="#6b7280">{label}</text>
            </g>
          );
        })}

        {/* 3. hover 감지 투명 rect (바 위에 올려서 이벤트 수신) */}
        {inventory.map((item, i) => {
          const gx = pl + i * groupW;
          return (
            <rect
              key={`hit-${item.id}`}
              x={gx + 2} y={pt} width={groupW - 4} height={chartH}
              fill="transparent" style={{ cursor: "pointer" }}
              onMouseEnter={() => setHoveredIdx(i)}
            />
          );
        })}

        {/* 4. 툴팁 — 맨 마지막에 렌더링해서 항상 최상단 */}
        {hoveredIdx !== null && hoveredItem !== null && (() => {
          const i = hoveredIdx;
          const cx = pl + i * groupW + groupW / 2;
          const tw = 120, th = 68;
          const rawTx = cx + groupW * 0.5 + 4;
          const tx = rawTx + tw > W - 4 ? cx - groupW * 0.5 - tw - 4 : rawTx;
          const ty = pt + 4;
          return (
            <g pointerEvents="none">
              <rect x={tx} y={ty} width={tw} height={th} rx="7" fill="white" stroke="#e5e7eb" strokeWidth="1.5" filter="drop-shadow(0 3px 10px rgba(0,0,0,0.14))" />
              <text x={tx + 10} y={ty + 18} fontSize="11" fontWeight="600" fill="#1f2937">
                {hoveredItem.name.length > 9 ? hoveredItem.name.slice(0, 9) + "…" : hoveredItem.name}
              </text>
              <text x={tx + 10} y={ty + 38} fontSize="11" fontWeight="700" fill="#EA4F1E">
                {`재고 : ${hoveredItem.stock}`}
              </text>
              <text x={tx + 10} y={ty + 56} fontSize="11" fill="#9ca3af">
                {`최소 : ${hoveredItem.minStock}`}
              </text>
            </g>
          );
        })()}
      </svg>
    </div>
  );
}

/* ───── 파이 차트 ───── */
function polarToCartesian(cx: number, cy: number, r: number, deg: number) {
  const rad = (deg * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function PieChart({ inventory }: { inventory: InventoryItem[] }) {
  const [tooltip, setTooltip] = useState<TooltipState>({ visible: false, x: 0, y: 0, lines: [] });

  const totals = CATEGORIES.map((cat) => ({
    cat,
    total: inventory.filter((i) => i.category === cat).reduce((s, i) => s + i.stock, 0),
    color: CATEGORY_COLORS[cat],
  }));
  const grand = totals.reduce((s, t) => s + t.total, 0);
  const cx = 90, cy = 90, r = 78;
  let angle = -90;

  const slices = totals.map((t) => {
    const sweep = grand > 0 ? (t.total / grand) * 360 : 0;
    const start = polarToCartesian(cx, cy, r, angle);
    angle += sweep;
    const end = polarToCartesian(cx, cy, r, angle);
    const large = sweep > 180 ? 1 : 0;
    const d =
      sweep > 0.5
        ? `M ${cx} ${cy} L ${start.x.toFixed(2)} ${start.y.toFixed(2)} A ${r} ${r} 0 ${large} 1 ${end.x.toFixed(2)} ${end.y.toFixed(2)} Z`
        : "";
    return { ...t, d };
  });

  const showPieTooltip = (e: React.MouseEvent<SVGPathElement>, cat: string, total: number, color: string) => {
    const rect = e.currentTarget.closest("svg")!.getBoundingClientRect();
    setTooltip({
      visible: true,
      x: ((e.clientX - rect.left) / rect.width) * 180,
      y: ((e.clientY - rect.top) / rect.height) * 180,
      lines: [{ label: cat, value: String(total), color }],
    });
  };

  return (
    <div className="flex flex-col items-center">
      <div className="relative">
        <svg
          viewBox="0 0 180 180"
          className="w-44 h-44"
          onMouseLeave={() => setTooltip((t) => ({ ...t, visible: false }))}
        >
          {slices.map((s) =>
            s.d ? (
              <path
                key={s.cat}
                d={s.d}
                fill={s.color}
                style={{ cursor: "pointer" }}
                onMouseEnter={(e) => showPieTooltip(e, s.cat, s.total, s.color)}
                onMouseMove={(e) => showPieTooltip(e, s.cat, s.total, s.color)}
              />
            ) : null
          )}

          {/* SVG 툴팁 */}
          {tooltip.visible && tooltip.lines[0] && (() => {
            const tw = 108, th = 44;
            const tx = Math.min(tooltip.x + 8, 180 - tw - 4);
            const ty = Math.max(tooltip.y - th - 6, 4);
            const line = tooltip.lines[0];
            return (
              <g>
                <rect x={tx} y={ty} width={tw} height={th} rx="6" fill="white" stroke="#e5e7eb" strokeWidth="1" filter="drop-shadow(0 2px 6px rgba(0,0,0,0.10))" />
                <text x={tx + 10} y={ty + 18} fontSize="15" fontWeight="700" fill={line.color}>{line.label}</text>
                <text x={tx + 10} y={ty + 34} fontSize="14" fill="#6b7280">{`합계 : ${line.value}`}</text>
              </g>
            );
          })()}
        </svg>
      </div>
      <div className="flex items-center gap-4 mt-2 flex-wrap justify-center">
        {totals.map((t) => (
          <div key={t.cat} className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: t.color }} />
            <span className="text-sm text-gray-600">{t.cat}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ───── 꺾은선 차트 ───── */
function smoothPath(pts: { x: number; y: number }[]): string {
  if (pts.length < 2) return "";
  let d = `M ${pts[0].x.toFixed(1)} ${pts[0].y.toFixed(1)}`;
  for (let i = 1; i < pts.length; i++) {
    const cpx = ((pts[i - 1].x + pts[i].x) / 2).toFixed(1);
    d += ` C ${cpx} ${pts[i - 1].y.toFixed(1)}, ${cpx} ${pts[i].y.toFixed(1)}, ${pts[i].x.toFixed(1)} ${pts[i].y.toFixed(1)}`;
  }
  return d;
}

function LineChart({ entries }: { entries: LedgerEntry[] }) {
  const W = 520, H = 200, pl = 42, pb = 36, pt = 16;
  const chartW = W - pl - 12, chartH = H - pb - pt;
  const maxY = 1200000;
  const ySteps = [0, 300000, 600000, 900000, 1200000];
  const [hovIdx, setHovIdx] = useState<number | null>(null);

  const dailySales = WEEK_DATES.map(({ date }) =>
    entries.filter((e) => e.date === date && e.type === "매출").reduce((s, e) => s + e.amount, 0)
  );
  const dailyExp = WEEK_DATES.map(({ date }) =>
    entries.filter((e) => e.date === date && e.type === "지출").reduce((s, e) => s + e.amount, 0)
  );

  const colW = chartW / (WEEK_DATES.length - 1);
  const ptX = (_: unknown, i: number) => pl + i * colW;
  const ptY = (v: number) => pt + chartH - (v / maxY) * chartH;

  const salesPts = dailySales.map((v, i) => ({ x: ptX(null, i), y: ptY(v) }));
  const expPts = dailyExp.map((v, i) => ({ x: ptX(null, i), y: ptY(v) }));
  const salesPath = smoothPath(salesPts);
  const expPath = smoothPath(expPts);
  const salesArea = salesPath + ` L ${salesPts[salesPts.length - 1].x} ${pt + chartH} L ${pl} ${pt + chartH} Z`;
  const expArea = expPath + ` L ${expPts[expPts.length - 1].x} ${pt + chartH} L ${pl} ${pt + chartH} Z`;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" onMouseLeave={() => setHovIdx(null)}>
      {/* Y 그리드 */}
      {ySteps.map((v) => {
        const y = ptY(v);
        return (
          <g key={v}>
            <line x1={pl} x2={W - 12} y1={y} y2={y} stroke="#e5e7eb" strokeWidth="1" strokeDasharray={v > 0 ? "3 3" : undefined} />
            <text x={pl - 5} y={y + 3.5} textAnchor="end" fontSize="8.5" fill="#9ca3af">{v === 0 ? "0만" : `${v / 10000}만`}</text>
          </g>
        );
      })}
      {/* 영역 채우기 */}
      <path d={salesArea} fill="#3B82F6" opacity="0.10" />
      <path d={expArea} fill="#EF4444" opacity="0.10" />
      {/* 선 */}
      <path d={salesPath} fill="none" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" />
      <path d={expPath} fill="none" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" />
      {/* X 레이블 */}
      {WEEK_DATES.map(({ label }, i) => (
        <text key={i} x={ptX(null, i)} y={H - 4} textAnchor="middle" fontSize="8.5" fill="#9ca3af">{label}</text>
      ))}
      {/* 컬럼 hover 영역 */}
      {WEEK_DATES.map((_, i) => {
        const x = ptX(null, i);
        const colLeft = i === 0 ? pl : x - colW / 2;
        const colRight = i === WEEK_DATES.length - 1 ? W - 12 : x + colW / 2;
        return (
          <rect key={i} x={colLeft} y={pt} width={colRight - colLeft} height={chartH}
            fill="transparent" style={{ cursor: "crosshair" }}
            onMouseEnter={() => setHovIdx(i)} />
        );
      })}
      {/* 호버 UI */}
      {hovIdx !== null && (() => {
        const x = ptX(null, hovIdx);
        const s = dailySales[hovIdx], e = dailyExp[hovIdx];
        const tw = 128, th = 58;
        const tx = Math.min(x + 8, W - tw - 4);
        const ty = pt + 4;
        return (
          <g pointerEvents="none">
            <line x1={x} x2={x} y1={pt} y2={pt + chartH} stroke="#d1d5db" strokeWidth="1" strokeDasharray="4 3" />
            <circle cx={x} cy={ptY(s)} r="4" fill="#3B82F6" />
            <circle cx={x} cy={ptY(e)} r="4" fill="#EF4444" />
            <rect x={tx} y={ty} width={tw} height={th} rx="7" fill="white" stroke="#e5e7eb" strokeWidth="1.5" filter="drop-shadow(0 3px 10px rgba(0,0,0,0.13))" />
            <text x={tx + 10} y={ty + 16} fontSize="10" fontWeight="600" fill="#374151">{WEEK_DATES[hovIdx].label}</text>
            <text x={tx + 10} y={ty + 33} fontSize="10" fontWeight="600" fill="#3B82F6">{`매출 : ${fmtAmt(s)}`}</text>
            <text x={tx + 10} y={ty + 50} fontSize="10" fill="#EF4444">{`지출 : ${fmtAmt(e)}`}</text>
          </g>
        );
      })()}
    </svg>
  );
}

/* ───── 도넛 차트 ───── */
function DonutChart({ entries }: { entries: LedgerEntry[] }) {
  const [hovCat, setHovCat] = useState<string | null>(null);
  const expenses = entries.filter((e) => e.type === "지출");
  const cats = Object.keys(EXPENSE_COLORS);
  const totals = cats.map((cat) => ({
    cat, color: EXPENSE_COLORS[cat],
    total: expenses.filter((e) => e.category === cat).reduce((s, e) => s + e.amount, 0),
  })).filter((t) => t.total > 0);

  const grand = totals.reduce((s, t) => s + t.total, 0);
  const cx = 90, cy = 90, or = 75, ir = 45;
  let angle = -90;

  const slices = totals.map((t) => {
    const sweep = grand > 0 ? (t.total / grand) * 360 : 0;
    const sa = angle, ea = angle + sweep;
    angle += sweep;
    const large = sweep > 180 ? 1 : 0;
    const os = polarToCartesian(cx, cy, or, sa), oe = polarToCartesian(cx, cy, or, ea);
    const is_ = polarToCartesian(cx, cy, ir, sa), ie = polarToCartesian(cx, cy, ir, ea);
    const d = sweep > 0.5
      ? `M ${os.x.toFixed(2)} ${os.y.toFixed(2)} A ${or} ${or} 0 ${large} 1 ${oe.x.toFixed(2)} ${oe.y.toFixed(2)} L ${ie.x.toFixed(2)} ${ie.y.toFixed(2)} A ${ir} ${ir} 0 ${large} 0 ${is_.x.toFixed(2)} ${is_.y.toFixed(2)} Z`
      : "";
    return { ...t, d, sweep };
  });

  return (
    <div className="flex flex-col items-center">
      <svg viewBox="0 0 180 180" className="w-44 h-44" onMouseLeave={() => setHovCat(null)}>
        {slices.map((s) => s.d ? (
          <path key={s.cat} d={s.d}
            fill={hovCat === s.cat ? s.color : s.color}
            opacity={hovCat && hovCat !== s.cat ? 0.5 : 1}
            style={{ cursor: "pointer", transition: "opacity 0.15s" }}
            onMouseEnter={() => setHovCat(s.cat)}
          />
        ) : null)}
        {/* 도넛 중심 */}
        <circle cx={cx} cy={cy} r={ir} fill="white" />
        {/* 호버 툴팁 */}
        {hovCat && (() => {
          const s = slices.find((sl) => sl.cat === hovCat);
          if (!s) return null;
          const tw = 120, th = 44;
          const tx = cx - tw / 2, ty = cy + ir + 8;
          const finalTy = ty + th > 180 ? cy - ir - th - 8 : ty;
          return (
            <g pointerEvents="none">
              <rect x={tx} y={finalTy} width={tw} height={th} rx="6" fill="white" stroke="#e5e7eb" strokeWidth="1.5" filter="drop-shadow(0 3px 10px rgba(0,0,0,0.13))" />
              <text x={tx + 10} y={finalTy + 17} fontSize="12" fontWeight="700" fill={s.color}>{s.cat}</text>
              <text x={tx + 10} y={finalTy + 34} fontSize="11" fill="#6b7280">{fmtAmt(s.total)}</text>
            </g>
          );
        })()}
      </svg>
      <div className="flex flex-wrap justify-center gap-3 mt-2">
        {slices.map((t) => (
          <div key={t.cat} className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: t.color }} />
            <span className="text-sm text-gray-600">{t.cat}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ───── 장부 탭 ───── */
function LedgerTab({ entries, setEntries }: {
  entries: LedgerEntry[];
  setEntries: React.Dispatch<React.SetStateAction<LedgerEntry[]>>;
}) {
  const [filter, setFilter] = useState<"전체" | EntryType>("전체");
  const [showForm, setShowForm] = useState(false);
  const [nextId, setNextId] = useState(INITIAL_LEDGER.length + 1);
  const [form, setForm] = useState({
    type: "매출" as EntryType,
    category: "현장매출",
    description: "",
    amount: "",
    payment: "카드" as PaymentMethod,
  });

  const totalSales = entries.filter((e) => e.type === "매출").reduce((s, e) => s + e.amount, 0);
  const totalExp = entries.filter((e) => e.type === "지출").reduce((s, e) => s + e.amount, 0);
  const profit = totalSales - totalExp;

  const filtered = entries.filter((e) => filter === "전체" || e.type === filter);

  const cats = form.type === "매출" ? SALES_CATEGORIES : EXPENSE_CATEGORIES;

  const addEntry = () => {
    const amt = parseInt(form.amount.replace(/,/g, ""));
    if (!form.description.trim() || isNaN(amt) || amt <= 0) return;
    setEntries((prev) => [{
      id: nextId,
      date: formatDate(new Date()),
      type: form.type,
      category: form.category,
      description: form.description,
      amount: amt,
      payment: form.payment,
    }, ...prev]);
    setNextId((n) => n + 1);
    setForm({ type: "매출", category: "현장매출", description: "", amount: "", payment: "카드" });
    setShowForm(false);
  };

  const deleteEntry = (id: number) => setEntries((prev) => prev.filter((e) => e.id !== id));

  return (
    <>
      {/* 요약 카드 */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-50 rounded-xl border border-blue-100 p-5">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-blue-400" />
            <span className="text-sm text-blue-500 font-medium">총 매출</span>
          </div>
          <p className="text-2xl font-bold text-blue-600">{fmtAmt(totalSales)}</p>
        </div>
        <div className="bg-red-50 rounded-xl border border-red-100 p-5">
          <div className="flex items-center gap-2 mb-2">
            <TrendingDown className="w-4 h-4 text-red-400" />
            <span className="text-sm text-red-500 font-medium">총 지출</span>
          </div>
          <p className="text-2xl font-bold text-red-500">{fmtAmt(totalExp)}</p>
        </div>
        <div className="bg-green-50 rounded-xl border border-green-100 p-5">
          <div className="flex items-center gap-2 mb-2">
            <Wallet className="w-4 h-4 text-green-500" />
            <span className="text-sm text-green-600 font-medium">순이익</span>
          </div>
          <p className={`text-2xl font-bold ${profit >= 0 ? "text-green-600" : "text-red-500"}`}>
            {profit >= 0 ? "+" : ""}{fmtAmt(profit)}
          </p>
        </div>
      </div>

      {/* 차트 */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="col-span-2 bg-white rounded-xl border border-gray-100 p-5">
          <p className="text-sm font-semibold text-gray-700 mb-3">주간 매출/지출 추이</p>
          <LineChart entries={entries} />
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-5 flex flex-col">
          <p className="text-sm font-semibold text-gray-700 mb-3">지출 항목별 비중</p>
          <div className="flex-1 flex items-center justify-center">
            <DonutChart entries={entries} />
          </div>
        </div>
      </div>

      {/* 내역 목록 */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div className="flex gap-2">
            {(["전체", "매출", "지출"] as const).map((f) => (
              <button key={f} onClick={() => setFilter(f)}
                className={`px-4 py-1.5 text-sm font-medium rounded-full transition-colors ${
                  filter === f ? "bg-[#EA4F1E] text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}>{f}</button>
            ))}
          </div>
          <button onClick={() => setShowForm((v) => !v)}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#EA4F1E] hover:bg-[#D44418] text-white text-sm font-semibold rounded-lg transition-colors">
            <Plus className="w-4 h-4" />내역 추가
          </button>
        </div>

        {/* 추가 폼 */}
        {showForm && (
          <div className="px-5 py-4 border-b border-gray-100 bg-gray-50/60">
            <div className="flex gap-2 items-center">
              <select value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value as EntryType, category: e.target.value === "매출" ? "현장매출" : "식재료" })}
                className="px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#EA4F1E] bg-white">
                <option>매출</option><option>지출</option>
              </select>
              <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#EA4F1E] bg-white">
                {cats.map((c) => <option key={c}>{c}</option>)}
              </select>
              <input type="text" placeholder="설명" value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="flex-[2] px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#EA4F1E] bg-white" />
              <input type="number" placeholder="금액" value={form.amount}
                onChange={(e) => setForm({ ...form, amount: e.target.value })}
                className="w-28 px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#EA4F1E] bg-white" />
              <select value={form.payment} onChange={(e) => setForm({ ...form, payment: e.target.value as PaymentMethod })}
                className="px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#EA4F1E] bg-white">
                {PAYMENT_METHODS.map((p) => <option key={p}>{p}</option>)}
              </select>
              <button onClick={addEntry}
                className="flex-1 px-6 py-2.5 bg-[#EA4F1E] hover:bg-[#D44418] text-white text-sm font-semibold rounded-lg transition-colors">
                추가
              </button>
            </div>
          </div>
        )}

        {/* 테이블 헤더 */}
        <div className="grid grid-cols-[1fr_80px_1fr_2fr_1fr_1fr_40px] gap-3 px-5 py-3 text-xs font-medium text-gray-500 border-b border-gray-100 bg-gray-50/30">
          <span>날짜</span><span>구분</span><span>카테고리</span><span>내용</span>
          <span className="text-right">금액</span><span>결제</span><span />
        </div>

        {/* 행 */}
        {filtered.map((entry) => (
          <div key={entry.id}
            className="grid grid-cols-[1fr_80px_1fr_2fr_1fr_1fr_40px] gap-3 px-5 py-3.5 items-center border-b border-gray-50 last:border-b-0 hover:bg-gray-50/40 transition-colors">
            <span className="text-sm text-gray-500">{entry.date}</span>
            <span>
              <span className={`inline-block px-2 py-0.5 text-xs font-medium rounded-full ${
                entry.type === "매출" ? "bg-blue-50 text-blue-500 border border-blue-100" : "bg-red-50 text-red-500 border border-red-100"
              }`}>{entry.type}</span>
            </span>
            <span className="text-sm text-gray-600">{entry.category}</span>
            <span className="text-sm text-gray-800">{entry.description}</span>
            <span className={`text-sm font-semibold text-right ${entry.type === "매출" ? "text-blue-600" : "text-red-500"}`}>
              {entry.type === "매출" ? "+" : "-"}{fmtAmt(entry.amount)}
            </span>
            <span className="text-sm text-gray-500">{entry.payment}</span>
            <button onClick={() => deleteEntry(entry.id)} className="text-gray-300 hover:text-red-400 transition-colors flex justify-center">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </>
  );
}

/* ───── 가로 바 차트 (직원별 주간 근무시간) ───── */
function HBarChart({ employees }: { employees: Employee[] }) {
  const W = 420, H = 200;
  const pl = 60, pr = 36, pt = 12, pb = 28;
  const chartW = W - pl - pr;
  const chartH = H - pt - pb;
  const maxHours = Math.max(12, ...employees.map((e) => e.weeklyHours));
  const xSteps = [0, 3, 6, 9, 12];
  const rowH = chartH / employees.length;
  const bh = Math.min(18, rowH * 0.44);
  const [hovIdx, setHovIdx] = useState<number | null>(null);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" onMouseLeave={() => setHovIdx(null)}>
      {/* X 그리드 & 레이블 */}
      {xSteps.map((v) => {
        const x = pl + (v / maxHours) * chartW;
        return (
          <g key={v}>
            <line x1={x} x2={x} y1={pt} y2={pt + chartH} stroke="#e5e7eb" strokeWidth="1" strokeDasharray={v > 0 ? "3 3" : undefined} />
            <text x={x} y={H - 6} textAnchor="middle" fontSize="9" fill="#9ca3af">{`${v}h`}</text>
          </g>
        );
      })}

      {/* 1. 하이라이트 */}
      {employees.map((emp, i) => {
        const ry = pt + i * rowH;
        return hovIdx === i ? (
          <rect key={`hl-${emp.id}`} x={pl} y={ry + 1} width={chartW} height={rowH - 2} fill="#e5e7eb" opacity="0.5" rx="3" />
        ) : null;
      })}

      {/* 2. 바 + Y 레이블 */}
      {employees.map((emp, i) => {
        const cy = pt + i * rowH + rowH / 2;
        const bw = (emp.weeklyHours / maxHours) * chartW;
        return (
          <g key={`bar-${emp.id}`}>
            <text x={pl - 6} y={cy + 4} textAnchor="end" fontSize="10" fill="#374151">{emp.name}</text>
            <rect x={pl} y={cy - bh / 2} width={Math.max(bw, 2)} height={bh} fill="#EA4F1E" rx="3" />
            <text x={pl + bw + 5} y={cy + 4} fontSize="9" fill="#6b7280">{`${emp.weeklyHours}h`}</text>
          </g>
        );
      })}

      {/* 3. 히트 영역 */}
      {employees.map((emp, i) => {
        const ry = pt + i * rowH;
        return (
          <rect key={`hit-${emp.id}`} x={pl} y={ry + 1} width={chartW} height={rowH - 2}
            fill="transparent" style={{ cursor: "pointer" }}
            onMouseEnter={() => setHovIdx(i)} />
        );
      })}

      {/* 4. 툴팁 */}
      {hovIdx !== null && (() => {
        const emp = employees[hovIdx];
        const cy = pt + hovIdx * rowH + rowH / 2;
        const bw = (emp.weeklyHours / maxHours) * chartW;
        const tw = 138, th = 58;
        const rawTx = pl + bw + 8;
        const tx = rawTx + tw > W ? pl + bw - tw - 8 : rawTx;
        const ty = cy - th / 2;
        return (
          <g pointerEvents="none">
            <rect x={tx} y={ty} width={tw} height={th} rx="7" fill="white" stroke="#e5e7eb" strokeWidth="1.5" filter="drop-shadow(0 3px 10px rgba(0,0,0,0.13))" />
            <text x={tx + 10} y={ty + 19} fontSize="11" fontWeight="700" fill="#1f2937">{emp.name}</text>
            <text x={tx + 10} y={ty + 36} fontSize="10" fontWeight="600" fill="#EA4F1E">{`주간 근무 : ${emp.weeklyHours}시간`}</text>
            <text x={tx + 10} y={ty + 51} fontSize="10" fill="#9ca3af">{emp.role}</text>
          </g>
        );
      })()}
    </svg>
  );
}

/* ───── 직원 근무관리 탭 ───── */
function WorkTab({ employees }: { employees: Employee[] }) {
  const todayScheduled = employees.filter((e) => e.todayStart && e.todayEnd).length;
  const todayHours = employees
    .filter((e) => e.status === "근무중" && e.todayStart && e.todayEnd)
    .reduce((sum, e) => {
      const [sh, sm] = e.todayStart!.split(":").map(Number);
      const [eh, em] = e.todayEnd!.split(":").map(Number);
      return sum + (eh * 60 + em - sh * 60 - sm) / 60;
    }, 0);
  const weeklyLaborCost = employees.reduce((s, e) => s + e.hourlyWage * e.weeklyHours, 0);
  const activeCount = employees.filter((e) => e.status !== "휴무").length;

  const statusCls = (status: WorkStatus) => {
    switch (status) {
      case "근무중": return "bg-green-50 text-green-600 border-green-100";
      case "예정":   return "bg-blue-50 text-blue-500 border-blue-100";
      case "퇴근":   return "bg-gray-100 text-gray-500 border-gray-200";
      case "휴무":   return "bg-gray-100 text-gray-400 border-gray-200";
    }
  };

  return (
    <>
      {/* 요약 카드 */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <p className="text-xs text-gray-500 mb-1">오늘 총근</p>
          <p className="text-2xl font-bold text-gray-900">{todayScheduled}<span className="text-sm font-medium text-gray-500 ml-1">명</span></p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <p className="text-xs text-gray-500 mb-1">오늘 근무시간</p>
          <p className="text-2xl font-bold text-gray-900">{todayHours}<span className="text-sm font-medium text-gray-500 ml-1">시간</span></p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <p className="text-xs text-gray-500 mb-1">주간 인건비(예상)</p>
          <p className="text-2xl font-bold text-[#EA4F1E]">{fmtAmt(weeklyLaborCost)}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <p className="text-xs text-gray-500 mb-1">등록 직원</p>
          <p className="text-2xl font-bold text-gray-900">
            {employees.length}<span className="text-sm font-medium text-gray-500 ml-1">명</span>
            <span className="text-sm text-green-500 ml-1">({activeCount} 활성)</span>
          </p>
        </div>
      </div>

      {/* 차트 + 오늘 현황 */}
      <div className="grid grid-cols-5 gap-4 mb-6">
        <div className="col-span-3 bg-white rounded-xl border border-gray-100 p-5">
          <p className="text-sm font-semibold text-gray-700 mb-3">직원별 주간 근무시간</p>
          <HBarChart employees={employees} />
        </div>
        <div className="col-span-2 bg-white rounded-xl border border-gray-100 p-5">
          <p className="text-sm font-semibold text-gray-700 mb-4">
            오늘의 근무 현황 <span className="text-gray-400 font-normal text-xs">2/24</span>
          </p>
          <div className="space-y-3">
            {employees.map((emp) => (
              <div key={emp.id} className="flex items-center gap-3">
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0"
                  style={{ backgroundColor: emp.avatarColor }}
                >
                  {emp.name[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">{emp.name}</p>
                  <p className="text-xs text-gray-500">{emp.role}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-400">
                    {emp.todayStart && emp.todayEnd ? `${emp.todayStart}~${emp.todayEnd}` : "-"}
                  </p>
                  <span className={`inline-block mt-0.5 px-2 py-0.5 text-xs font-medium rounded-full border ${statusCls(emp.status)}`}>
                    {emp.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 주간 스케줄 */}
      <div className="bg-white rounded-xl border border-gray-100 p-5 mb-6">
        <p className="text-sm font-semibold text-gray-700 mb-4">주간 근무 스케줄</p>
        <div className="grid grid-cols-7 gap-2">
          {WORK_WEEK.map((day) => {
            const shifts = WORK_SCHEDULE[day.date] || [];
            return (
              <div
                key={day.date}
                className={`rounded-lg p-2 min-h-[80px] ${day.isToday ? "bg-[#FFF7EF] border border-[#EA4F1E]/20" : "bg-gray-50"}`}
              >
                <p className={`text-xs font-semibold mb-2 text-center ${day.isToday ? "text-[#EA4F1E]" : "text-gray-500"}`}>
                  {day.label}
                </p>
                <div className="space-y-1.5">
                  {shifts.map((s) => {
                    const emp = employees.find((e) => e.id === s.empId);
                    if (!emp) return null;
                    return (
                      <div
                        key={s.empId}
                        className="rounded-md px-1.5 py-1 text-xs"
                        style={{ backgroundColor: `${emp.avatarColor}1A`, color: emp.avatarColor }}
                      >
                        <p className="font-semibold">{emp.name}</p>
                        <p className="opacity-75">{s.start}~{s.end}</p>
                      </div>
                    );
                  })}
                  {shifts.length === 0 && (
                    <p className="text-xs text-gray-300 text-center pt-2">-</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 직원 목록 테이블 */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <h3 className="text-base font-bold text-gray-900">직원 목록</h3>
        </div>
        <div className="grid grid-cols-[2fr_1fr_1fr_1.5fr_1fr_1fr_1fr] gap-3 px-5 py-3 text-xs font-medium text-gray-500 border-b border-gray-100 bg-gray-50/30">
          <span>이름</span><span>역할</span><span>시급</span><span>연락처</span>
          <span>상태</span><span>주간 근무</span><span className="text-right">예상 급여</span>
        </div>
        {employees.map((emp) => (
          <div
            key={emp.id}
            className="grid grid-cols-[2fr_1fr_1fr_1.5fr_1fr_1fr_1fr] gap-3 px-5 py-4 items-center border-b border-gray-50 last:border-b-0 hover:bg-gray-50/40 transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0"
                style={{ backgroundColor: emp.avatarColor }}
              >
                {emp.name[0]}
              </div>
              <span className="text-sm font-medium text-gray-900">{emp.name}</span>
            </div>
            <span className="text-sm text-gray-600">{emp.role}</span>
            <span className="text-sm text-gray-800">{emp.hourlyWage.toLocaleString("ko-KR")}원</span>
            <span className="text-sm text-gray-500">{emp.phone}</span>
            <span>
              <span className={`inline-block px-2 py-0.5 text-xs font-medium rounded-full border ${statusCls(emp.status)}`}>
                {emp.status}
              </span>
            </span>
            <span className="text-sm text-gray-700">{emp.weeklyHours}시간</span>
            <span className="text-sm font-semibold text-gray-900 text-right">{fmtAmt(emp.hourlyWage * emp.weeklyHours)}</span>
          </div>
        ))}
      </div>
    </>
  );
}

/* ───── 마진 파이 차트 ───── */
function MarginPieChart({ items, total }: { items: { label: string; amount: number; color: string }[]; total: number }) {
  const cx = 80, cy = 80, r = 68;
  let angle = -90;
  const slices = items.map((item) => {
    const pct = total > 0 ? item.amount / total : 0;
    const sweep = pct * 360;
    const sa = angle, ea = angle + sweep;
    angle += sweep;
    const large = sweep > 180 ? 1 : 0;
    const start = polarToCartesian(cx, cy, r, sa);
    const end = polarToCartesian(cx, cy, r, ea);
    const d = sweep > 0.5
      ? `M ${cx} ${cy} L ${start.x.toFixed(2)} ${start.y.toFixed(2)} A ${r} ${r} 0 ${large} 1 ${end.x.toFixed(2)} ${end.y.toFixed(2)} Z`
      : "";
    const midAngle = sa + sweep / 2;
    const lpos = polarToCartesian(cx, cy, r * 0.62, midAngle);
    return { ...item, d, pct, lpos, sweep };
  });

  return (
    <svg viewBox="0 0 160 160" className="w-52 h-52 shrink-0">
      {slices.map((s) => s.d ? (
        <path key={s.label} d={s.d} fill={s.color} stroke="white" strokeWidth="1.5" />
      ) : null)}
      {slices.map((s) => s.sweep > 14 ? (
        <text key={`lbl-${s.label}`} x={s.lpos.x.toFixed(1)} y={s.lpos.y.toFixed(1)}
          textAnchor="middle" dominantBaseline="middle" fontSize="11" fontWeight="700" fill="white">
          {Math.round(s.pct * 100)}%
        </text>
      ) : null)}
    </svg>
  );
}

/* ───── 마진 계산기 탭 ───── */
function MarginTab() {
  const [cost, setCost] = useState("8000");
  const [price, setPrice] = useState("15000");
  const [platformFee, setPlatformFee] = useState("15");
  const [cardFee, setCardFee] = useState("2.5");
  const [monthlyQty, setMonthlyQty] = useState("100");
  const [rent, setRent] = useState("1500000");
  const [labor, setLabor] = useState("2000000");

  const costN = parseFloat(cost) || 0;
  const priceN = parseFloat(price) || 0;
  const platformFeeN = parseFloat(platformFee) || 0;
  const cardFeeN = parseFloat(cardFee) || 0;
  const monthlyQtyN = parseInt(monthlyQty) || 0;
  const rentN = parseFloat(rent) || 0;
  const laborN = parseFloat(labor) || 0;

  const platformFeeAmt = Math.round(priceN * platformFeeN / 100);
  const cardFeeAmt = Math.round(priceN * cardFeeN / 100);
  const unitProfit = priceN - costN - platformFeeAmt - cardFeeAmt;
  const marginRate = priceN > 0 ? (unitProfit / priceN) * 100 : 0;

  const monthlySales = priceN * monthlyQtyN;
  const monthlyCost = costN * monthlyQtyN;
  const monthlyPlatformFee = platformFeeAmt * monthlyQtyN;
  const monthlyCardFee = cardFeeAmt * monthlyQtyN;
  const monthlyProfit = monthlySales - monthlyCost - monthlyPlatformFee - monthlyCardFee - rentN - laborN;

  const expenseItems = [
    { label: "원가", amount: monthlyCost, color: "#EF4444" },
    { label: "플랫폼수수료", amount: monthlyPlatformFee, color: "#F59E0B" },
    { label: "카드수수료", amount: monthlyCardFee, color: "#EA4F1E" },
    { label: "임대료", amount: rentN, color: "#3B82F6" },
    { label: "인건비", amount: laborN, color: "#14B8A6" },
  ].filter((e) => e.amount > 0);
  const totalExpense = expenseItems.reduce((s, e) => s + e.amount, 0);

  const inputCls = "w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#EA4F1E] bg-white transition-colors";
  const labelCls = "block text-xs text-gray-500 mb-1.5";

  return (
    <div className="grid grid-cols-5 gap-5">
      {/* ── 좌측 입력 ── */}
      <div className="col-span-2 space-y-4">
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <h3 className="text-sm font-bold text-gray-800 mb-4">단품 정보</h3>
          <div className="space-y-3">
            <div>
              <label className={labelCls}>원가 (원)</label>
              <input type="number" value={cost} onChange={(e) => setCost(e.target.value)} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>판매가 (원)</label>
              <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} className={inputCls} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelCls}>플랫폼 수수료 (%)</label>
                <input type="number" value={platformFee} onChange={(e) => setPlatformFee(e.target.value)} className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>카드 수수료 (%)</label>
                <input type="number" value={cardFee} onChange={(e) => setCardFee(e.target.value)} className={inputCls} />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <h3 className="text-sm font-bold text-gray-800 mb-4">월간 정보</h3>
          <div className="space-y-3">
            <div>
              <label className={labelCls}>월 예상 판매량 (개)</label>
              <input type="number" value={monthlyQty} onChange={(e) => setMonthlyQty(e.target.value)} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>월 임대료 (원)</label>
              <input type="number" value={rent} onChange={(e) => setRent(e.target.value)} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>월 인건비 (원)</label>
              <input type="number" value={labor} onChange={(e) => setLabor(e.target.value)} className={inputCls} />
            </div>
          </div>
        </div>
      </div>

      {/* ── 우측 결과 ── */}
      <div className="col-span-3 space-y-4">
        {/* 단품 수익 분석 */}
        <div className="bg-[#FFF7EF] rounded-xl border border-[#EA4F1E]/10 p-5">
          <h3 className="text-sm font-bold text-gray-800 mb-4">단품 수익 분석</h3>
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="bg-white rounded-lg p-4 text-center">
              <p className="text-xs text-gray-500 mb-1">판매가</p>
              <p className="text-xl font-bold text-[#EA4F1E]">{fmtAmt(priceN)}</p>
            </div>
            <div className="bg-white rounded-lg p-4 text-center">
              <p className="text-xs text-gray-500 mb-1">원가</p>
              <p className="text-xl font-bold text-gray-700">{fmtAmt(costN)}</p>
            </div>
            <div className="bg-white rounded-lg p-4 text-center">
              <p className="text-xs text-gray-500 mb-1">순수익</p>
              <p className={`text-xl font-bold ${unitProfit >= 0 ? "text-green-600" : "text-red-500"}`}>{fmtAmt(unitProfit)}</p>
            </div>
            <div className="bg-white rounded-lg p-4 text-center">
              <p className="text-xs text-gray-500 mb-1">마진율</p>
              <p className={`text-xl font-bold ${marginRate >= 0 ? "text-green-600" : "text-red-500"}`}>{marginRate.toFixed(1)}%</p>
            </div>
          </div>
          <div className="space-y-1.5">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">플랫폼 수수료</span>
              <span className="text-red-400 font-medium">-{fmtAmt(platformFeeAmt)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">카드 수수료</span>
              <span className="text-red-400 font-medium">-{fmtAmt(cardFeeAmt)}</span>
            </div>
          </div>
        </div>

        {/* 월간 수익 시뮬레이션 */}
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <h3 className="text-sm font-bold text-gray-800 mb-4">월간 수익 시뮬레이션</h3>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="font-medium text-gray-700">월 매출</span>
              <span className="font-semibold text-gray-900">{fmtAmt(monthlySales)}</span>
            </div>
            {[
              { label: "원가 합계", val: monthlyCost },
              { label: "플랫폼 수수료", val: monthlyPlatformFee },
              { label: "카드 수수료", val: monthlyCardFee },
              { label: "임대료", val: rentN },
              { label: "인건비", val: laborN },
            ].map(({ label, val }) => (
              <div key={label} className="flex justify-between text-sm">
                <span className="text-gray-500 pl-2">· {label}</span>
                <span className="text-red-400">-{fmtAmt(val)}</span>
              </div>
            ))}
            <div className="border-t border-gray-100 pt-2.5 flex justify-between items-center">
              <span className="text-sm font-bold text-gray-800">월 순이익</span>
              <span className={`text-base font-bold ${monthlyProfit >= 0 ? "text-green-600" : "text-red-500"}`}>
                {monthlyProfit >= 0 ? "+" : ""}{fmtAmt(monthlyProfit)}
              </span>
            </div>
          </div>
        </div>

        {/* 비용 구조 */}
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <h3 className="text-sm font-bold text-gray-800 mb-4">비용 구조</h3>
          {totalExpense > 0 ? (
            <div className="flex items-center gap-6">
              <MarginPieChart items={expenseItems} total={totalExpense} />
              <div className="space-y-3 flex-1">
                {expenseItems.map((item) => (
                  <div key={item.label} className="flex items-center gap-2.5">
                    <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                    <span className="text-sm text-gray-600 flex-1">{item.label}</span>
                    <span className="text-sm font-semibold text-gray-700">
                      {totalExpense > 0 ? Math.round(item.amount / totalExpense * 100) : 0}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-sm text-gray-400 text-center py-6">값을 입력하면 비용 구조가 표시됩니다.</p>
          )}
        </div>
      </div>
    </div>
  );
}

/* ───── 메인 페이지 ───── */
export default function DxPage() {
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab") as DxTab | null;
  const [activeTab, setActiveTab] = useState<DxTab>(
    tabParam && ["재고 관리", "매출/지출 장부", "직원 근무관리", "마진 계산기"].includes(tabParam)
      ? tabParam
      : "재고 관리"
  );

  useEffect(() => {
    if (tabParam && ["재고 관리", "매출/지출 장부", "직원 근무관리", "마진 계산기"].includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, [tabParam]);
  const [inventory, setInventory] = useState<InventoryItem[]>(INITIAL_INVENTORY);
  const [ledger, setLedger] = useState<LedgerEntry[]>(INITIAL_LEDGER);
  const [employees] = useState<Employee[]>(INITIAL_EMPLOYEES);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newItem, setNewItem] = useState({ name: "", stock: "", unit: "개", category: "식재료" as ItemCategory });
  const [nextId, setNextId] = useState(7);

  const adjustStock = (id: number, delta: number) => {
    setInventory((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, stock: Math.max(0, item.stock + delta), lastUpdated: formatDate(new Date()) }
          : item
      )
    );
  };

  const addItem = () => {
    const stockNum = parseInt(newItem.stock);
    if (!newItem.name.trim() || isNaN(stockNum) || stockNum < 0) return;
    setInventory((prev) => [
      ...prev,
      {
        id: nextId,
        name: newItem.name,
        barcode: `8801234${String(567890 + nextId).padStart(6, "0")}`,
        category: newItem.category,
        stock: stockNum,
        unit: newItem.unit,
        minStock: Math.max(1, Math.floor(stockNum * 0.3)),
        lastUpdated: formatDate(new Date()),
      },
    ]);
    setNextId((n) => n + 1);
    setNewItem({ name: "", stock: "", unit: "개", category: "식재료" });
    setShowAddForm(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-8">
        {/* 타이틀 */}
        <div className="flex items-center gap-2 mb-1">
          <Wrench className="w-6 h-6 text-[#EA4F1E]" />
          <h1 className="text-2xl font-bold text-gray-900">DX 디지털 전환 도구</h1>
        </div>
        <p className="text-sm text-gray-500 mb-6">소상공인에게 꼭 필요한 가벼운 관리 도구</p>

        {/* 탭 */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {DX_TABS.map(({ label, Icon }) => (
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

        {/* 재고 관리 */}
        {activeTab === "재고 관리" && (
          <>
            {/* 차트 영역 */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="col-span-2 bg-white rounded-xl border border-gray-100 p-5">
                <p className="text-sm font-semibold text-gray-700 mb-3">재고 현황 차트</p>
                <BarChart inventory={inventory} />
              </div>
              <div className="bg-white rounded-xl border border-gray-100 p-5 flex flex-col">
                <p className="text-sm font-semibold text-gray-700 mb-3">카테고리별 분포</p>
                <div className="flex-1 flex items-center justify-center">
                  <PieChart inventory={inventory} />
                </div>
              </div>
            </div>

            {/* 재고 목록 */}
            <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
              {/* 헤더 */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                <h3 className="text-base font-bold text-gray-900">재고 목록</h3>
                <button
                  onClick={() => setShowAddForm((v) => !v)}
                  className="flex items-center gap-1.5 px-4 py-2 bg-[#EA4F1E] hover:bg-[#D44418] text-white text-sm font-semibold rounded-lg transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  품목 추가
                </button>
              </div>

              {/* 추가 폼 */}
              {showAddForm && (
                <div className="px-5 py-4 border-b border-gray-100 bg-gray-50/60">
                  <div className="flex gap-2 items-center">
                    <input
                      type="text"
                      placeholder="품목명"
                      value={newItem.name}
                      onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                      onKeyDown={(e) => e.key === "Enter" && addItem()}
                      className="flex-[2] px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#EA4F1E] transition-colors bg-white"
                    />
                    <input
                      type="number"
                      placeholder="수량"
                      value={newItem.stock}
                      onChange={(e) => setNewItem({ ...newItem, stock: e.target.value })}
                      onKeyDown={(e) => e.key === "Enter" && addItem()}
                      className="w-24 px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#EA4F1E] transition-colors bg-white"
                    />
                    <select
                      value={newItem.unit}
                      onChange={(e) => setNewItem({ ...newItem, unit: e.target.value })}
                      className="px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#EA4F1E] transition-colors bg-white"
                    >
                      {UNITS.map((u) => <option key={u}>{u}</option>)}
                    </select>
                    <select
                      value={newItem.category}
                      onChange={(e) => setNewItem({ ...newItem, category: e.target.value as ItemCategory })}
                      className="px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#EA4F1E] transition-colors bg-white"
                    >
                      {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                    </select>
                    <button
                      onClick={addItem}
                      className="flex-1 px-6 py-2.5 bg-[#EA4F1E] hover:bg-[#D44418] text-white text-sm font-semibold rounded-lg transition-colors"
                    >
                      추가
                    </button>
                  </div>
                </div>
              )}

              {/* 테이블 헤더 */}
              <div className="grid grid-cols-[2.5fr_1fr_1fr_1fr_100px_1fr] gap-4 px-5 py-3 text-xs font-medium text-gray-500 border-b border-gray-100 bg-gray-50/30">
                <span>품목</span>
                <span>카테고리</span>
                <span>재고</span>
                <span>상태</span>
                <span className="text-center">입출고</span>
                <span className="text-right">최종 수정</span>
              </div>

              {/* 행 */}
              {inventory.map((item) => (
                <div
                  key={item.id}
                  className="grid grid-cols-[2.5fr_1fr_1fr_1fr_100px_1fr] gap-4 px-5 py-4 items-center border-b border-gray-50 last:border-b-0 hover:bg-gray-50/40 transition-colors"
                >
                  <div>
                    <p className="text-sm font-medium text-gray-900">{item.name}</p>
                    <p className="text-xs text-[#EA4F1E] mt-0.5">{item.barcode}</p>
                  </div>
                  <span className="text-sm text-gray-600">{item.category}</span>
                  <span className="text-sm font-semibold text-gray-900">
                    {item.stock}{" "}
                    <span className="font-normal text-gray-500 text-xs">{item.unit}</span>
                  </span>
                  <span>
                    {item.stock <= item.minStock ? (
                      <span className="inline-block px-2 py-0.5 text-xs font-medium bg-red-50 text-red-500 rounded-full border border-red-100">
                        부족
                      </span>
                    ) : (
                      <span className="inline-block px-2 py-0.5 text-xs font-medium bg-green-50 text-green-500 rounded-full border border-green-100">
                        정상
                      </span>
                    )}
                  </span>
                  <div className="flex items-center justify-center gap-1">
                    <button
                      onClick={() => adjustStock(item.id, -1)}
                      className="w-7 h-7 flex items-center justify-center border border-gray-200 rounded-md text-gray-500 hover:bg-gray-100 hover:border-gray-300 transition-colors text-base leading-none"
                    >
                      −
                    </button>
                    <button
                      onClick={() => adjustStock(item.id, 1)}
                      className="w-7 h-7 flex items-center justify-center border border-gray-200 rounded-md text-gray-500 hover:bg-gray-100 hover:border-gray-300 transition-colors text-base leading-none"
                    >
                      +
                    </button>
                  </div>
                  <span className="text-xs text-gray-400 text-right">{item.lastUpdated}</span>
                </div>
              ))}
            </div>
          </>
        )}

        {/* 매출/지출 장부 */}
        {activeTab === "매출/지출 장부" && (
          <LedgerTab entries={ledger} setEntries={setLedger} />
        )}

        {/* 직원 근무관리 */}
        {activeTab === "직원 근무관리" && (
          <WorkTab employees={employees} />
        )}

        {/* 마진 계산기 */}
        {activeTab === "마진 계산기" && (
          <MarginTab />
        )}
      </main>

      <Footer />
    </div>
  );
}

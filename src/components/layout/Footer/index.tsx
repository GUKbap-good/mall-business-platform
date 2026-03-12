import Link from "next/link";
import { Store, Phone, Mail, ArrowUpRight } from "lucide-react";

const footerLinks = {
  서비스: [
    { label: "정부 지원사업", href: "/grants" },
    { label: "사장님 커뮤니티", href: "/community" },
    { label: "광장", href: "/marketplace" },
  ],
  도구: [
    { label: "재고 관리", href: "/dx?tab=재고+관리" },
    { label: "매출/지출 장부", href: "/dx?tab=매출%2F지출+장부" },
    { label: "직원 근무관리", href: "/dx?tab=직원+근무관리" },
    { label: "마진 계산기", href: "/dx?tab=마진+계산기" },
    { label: "식자재 시세", href: "/price" },
  ],
  고객지원: [
    { label: "공지사항", href: "/notice" },
    { label: "자주 묻는 질문", href: "/faq" },
    { label: "이용약관", href: "/terms" },
    { label: "개인정보처리방침", href: "/privacy" },
    { label: "문의하기", href: "/contact" },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-[#192031] text-gray-400">
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-[1.2fr_1fr_1fr_1fr_1fr] gap-4">
          {/* 브랜드 정보 */}
          <div>
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 bg-[#EA4F1E] rounded-xl flex items-center justify-center">
                <Store className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-bold text-white">소상<span className="text-[#EA4F1E]">광장</span></span>
            </Link>
            <p className="text-sm leading-relaxed mb-6">
              소상공인의 성장을 돕는 종합 플랫폼.
              <br />
              정보, 커뮤니티, 도구를 한 곳에서.
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 shrink-0" />
                <span>1588-0000 (평일 09:00~18:00)</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 shrink-0" />
                <span>help@sajangnim.kr</span>
              </div>
            </div>
          </div>

          {/* 링크 컬럼들 */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="text-white font-semibold mb-4">{category}</h3>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* 관련기관 */}
          <div>
            <h3 className="text-white font-semibold mb-4">관련기관</h3>
            <ul className="space-y-2.5">
              {[
                { label: "소상공인시장진흥공단", href: "https://www.semas.or.kr" },
                { label: "중소벤처기업부", href: "https://www.mss.go.kr" },
                { label: "소상공인마당", href: "https://www.sbiz.or.kr" },
                { label: "창업진흥원", href: "https://www.kised.or.kr" },
                { label: "신용보증기금", href: "https://www.kodit.co.kr" },
                { label: "기술보증기금", href: "https://www.kibo.or.kr" },
              ].map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm hover:text-white transition-colors flex items-center gap-1"
                  >
                    {item.label}
                    <ArrowUpRight className="w-3 h-3 shrink-0" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* 하단 구분선 */}
        <div className="border-t border-gray-700 mt-12 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm">
          <p>© 2026 소상광장. All rights reserved.</p>
          <p>사업자등록번호 000-00-00000 | 대표 홍길동</p>
        </div>
      </div>
    </footer>
  );
}

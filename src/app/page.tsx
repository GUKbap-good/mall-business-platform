import Link from "next/link";
import {
  ChevronRight, TrendingUp, Users, FileText,
  ShoppingCart, Heart,
  MessageCircle, Star, ArrowUpRight, Zap, Shield, Store, Wrench,
} from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const stats = [
  { value: "12,847", unit: "명", label: "가입 사장님" },
  { value: "324", unit: "건", label: "지원사업 정보" },
  { value: "5,291", unit: "개", label: "커뮤니티 글" },
  { value: "1,830", unit: "건", label: "거래 완료" },
];

const services = [
  { title: "정부 지원사업", description: "지자체별 지원금·대출·교육 정보를 실시간으로 모아둡니다", iconBg: "bg-blue-500", Icon: FileText, href: "/grants" },
  { title: "사장님 커뮤니티", description: "업종별 노하우 공유, 공동 상담, 자유 게시판", iconBg: "bg-green-500", Icon: Users, href: "/community" },
  { title: "서비스", description: "재고관리, QR 메뉴판, 마진 계산기까지 한 번에", iconBg: "bg-[#EA4F1E]", Icon: Wrench, href: "/dx" },
  { title: "식자재 시세", description: "실시간 식자재 가격 추이와 변동 분석을 한눈에", iconBg: "bg-teal-500", Icon: TrendingUp, href: "/price" },
  { title: "거래 + 공동구매", description: "포스기, 냉장고, 테이블 등 업소용 집기 거래·나눔", iconBg: "bg-amber-500", Icon: ShoppingCart, href: "/marketplace" },
];

const grants = [
  { agency: "중소벤처기업부", title: "2026년 소상공인 디지털 전환 지원사업", amount: "최대 500만원", deadline: "~03.31", color: "text-blue-600", dot: "bg-blue-600" },
  { agency: "서울특별시", title: "서울시 소상공인 임차료 보조금", amount: "월 30만원", deadline: "~04.15", color: "text-red-500", dot: "bg-red-500" },
  { agency: "경기도", title: "경기도 소상공인 경영안정 자금 대출", amount: "최대 3천만원", deadline: "~03.20", color: "text-green-600", dot: "bg-green-600" },
  { agency: "부산광역시", title: "부산시 전통시장 현대화 사업", amount: "최대 200만원", deadline: "~05.01", color: "text-purple-600", dot: "bg-purple-600" },
];

const posts = [
  { category: "외식업", time: "2시간 전", title: "배달앱 수수료 줄이는 현실적인 방법 공유합니다", author: "치킨사장", likes: 123, comments: 47 },
  { category: "서비스업", time: "5시간 전", title: "1인 카페 운영 6개월 차, 현실 매출 공개합니다", author: "카페장인", likes: 89, comments: 32 },
  { category: "노하우", time: "1일 전", title: "인스타그램으로 월 매출 200만원 늘린 마케팅 전략", author: "마케팅초보", likes: 456, comments: 112 },
];

const galleryItems = [
  { category: "DX 도구", title: "QR 메뉴판으로 주문 효율 높이기", gradient: "from-gray-900 to-gray-700" },
  { category: "커뮤니티", title: "1인 카페 운영 노하우 모음", gradient: "from-stone-900 to-stone-700" },
  { category: "동네가게", title: "우리 동네 사장님 연합 마케팅", gradient: "from-zinc-900 to-zinc-700" },
];

function HeroSection() {
  return (
    <section className="bg-[#FFF7EF] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 py-20 flex flex-col lg:flex-row items-center gap-12">
        <div className="flex-1 text-center lg:text-left">
          <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm mb-6 text-sm text-gray-600">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            12,847명의 사장님이 함께하고 있어요
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold leading-tight text-gray-900 mb-4">
            소상공인을 위한<br />
            <span className="text-[#EA4F1E]">종합 비즈니스 플랫폼</span>
          </h1>
          <p className="text-gray-500 text-base lg:text-lg mb-8 leading-relaxed">
            정부 지원사업 알림, 사장님 커뮤니티, 디지털 도구, 지역 마케팅까지.<br className="hidden sm:block" />
            사장님께 필요한 모든 것을 한 곳에서.
          </p>
          <div className="flex flex-wrap gap-3 justify-center lg:justify-start mb-8">
            <Link href="/grants" className="flex items-center gap-2 px-6 py-3 bg-[#EA4F1E] hover:bg-[#D44418] text-white font-semibold rounded-lg transition-colors">
              지원사업 확인하기 <ChevronRight className="w-4 h-4" />
            </Link>
            <Link href="/community" className="px-6 py-3 border border-gray-300 text-gray-700 hover:bg-white font-semibold rounded-lg transition-colors">
              커뮤니티 둘러보기
            </Link>
          </div>
          <div className="flex flex-wrap gap-5 justify-center lg:justify-start text-sm text-gray-500">
            <span className="flex items-center gap-1.5"><Zap className="w-4 h-4 text-[#EA4F1E]" /> 실시간 업데이트</span>
            <span className="flex items-center gap-1.5"><Shield className="w-4 h-4 text-[#EA4F1E]" /> 검증된 정보</span>
            <span className="flex items-center gap-1.5"><Heart className="w-4 h-4 text-[#EA4F1E]" /> 사장님 중심</span>
          </div>
        </div>
        <div className="flex-1 relative h-[480px] w-full max-w-lg hidden lg:block">
          {/* 대시 원형 궤도 */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full border-2 border-dashed border-gray-200" />

          {/* 중앙 Store 아이콘 */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[76px] h-[76px] bg-gradient-to-br from-orange-400 to-[#EA4F1E] rounded-3xl shadow-2xl flex items-center justify-center z-10">
            <Store className="w-9 h-9 text-white" />
          </div>

          {/* 궤도 아이콘들 (6개, 원 위에 배치) */}
          {/* FileText - 12시 */}
          <div className="absolute top-[13%] left-1/2 -translate-x-1/2 w-12 h-12 bg-white rounded-2xl shadow-md flex items-center justify-center">
            <FileText className="w-5 h-5 text-blue-500" />
          </div>
          {/* TrendingUp - 10시 */}
          <div className="absolute top-[26%] left-[19%] w-12 h-12 bg-white rounded-2xl shadow-md flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-purple-500" />
          </div>
          {/* Store - 8시 */}
          <div className="absolute top-[58%] left-[17%] w-12 h-12 bg-white rounded-2xl shadow-md flex items-center justify-center">
            <Store className="w-5 h-5 text-pink-500" />
          </div>
          {/* ShoppingCart - 6시 */}
          <div className="absolute bottom-[13%] left-1/2 -translate-x-1/2 w-12 h-12 bg-white rounded-2xl shadow-md flex items-center justify-center">
            <ShoppingCart className="w-5 h-5 text-amber-500" />
          </div>
          {/* Wrench - 4시 */}
          <div className="absolute top-[58%] right-[17%] w-12 h-12 bg-white rounded-2xl shadow-md flex items-center justify-center">
            <Wrench className="w-5 h-5 text-orange-500" />
          </div>
          {/* Users - 2시 */}
          <div className="absolute top-[26%] right-[19%] w-12 h-12 bg-white rounded-2xl shadow-md flex items-center justify-center">
            <Users className="w-5 h-5 text-green-500" />
          </div>

          {/* 스탯 카드 - 우측 상단 */}
          <div className="absolute top-4 right-0 bg-white rounded-2xl shadow-lg px-4 py-3">
            <p className="text-gray-400 text-xs mb-1">이번 달 신규 지원</p>
            <div className="flex items-center gap-1.5 text-green-500 font-bold text-xl">
              <TrendingUp className="w-5 h-5" /> +28건
            </div>
          </div>

          {/* 스탯 카드 - 좌측 하단 */}
          <div className="absolute bottom-8 left-0 bg-white rounded-2xl shadow-lg px-4 py-3">
            <p className="text-gray-400 text-xs mb-1">오늘 활성 사장님</p>
            <div className="flex items-center gap-1.5 text-gray-900 font-bold text-xl">
              <Users className="w-5 h-5 text-blue-500" /> 2,341명
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function StatsSection() {
  return (
    <section className="bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-14">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
          {stats.map((stat) => (
            <div key={stat.label}>
              <p className="text-3xl lg:text-4xl font-bold text-gray-900">
                {stat.value}<span className="text-xl lg:text-2xl ml-0.5">{stat.unit}</span>
              </p>
              <p className="text-gray-400 text-sm mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ServicesSection() {
  return (
    <section className="bg-gray-50 py-20">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <span className="inline-block px-3 py-1 bg-orange-100 text-[#EA4F1E] text-xs font-semibold rounded-full mb-3">서비스 안내</span>
          <h2 className="text-3xl font-bold text-gray-900 mb-3">
            사장님께 필요한 <span className="text-[#EA4F1E]">모든 서비스</span>
          </h2>
          <p className="text-gray-500">복잡한 건 저희가 해결할게요. 클릭 한 번이면 충분합니다.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {services.map((service) => (
            <Link key={service.title} href={service.href} className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow group">
              <div className={"w-12 h-12 " + service.iconBg + " rounded-xl flex items-center justify-center mb-4"}>
                <service.Icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-base font-bold text-gray-900 mb-1.5">{service.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed mb-4">{service.description}</p>
              <span className="flex items-center gap-1 text-sm font-medium text-[#EA4F1E] group-hover:gap-2 transition-all">
                자세히 보기 <ChevronRight className="w-4 h-4" />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function GrantsAndCommunitySection() {
  return (
    <section className="bg-white py-20">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-xl font-bold text-gray-900">최신 지원사업</h2>
              <Link href="/grants" className="flex items-center gap-1 text-sm text-[#EA4F1E] font-medium">전체보기 <ChevronRight className="w-4 h-4" /></Link>
            </div>
            <p className="text-sm text-gray-400 mb-6">놓치면 안 되는 지원 정보</p>
            <div className="space-y-4">
              {grants.map((grant) => (
                <Link key={grant.title} href="/grants" className="flex items-start justify-between p-4 rounded-xl hover:bg-gray-50 transition-colors group">
                  <div className="flex items-start gap-3">
                    <span className={"mt-1.5 w-2 h-2 rounded-full shrink-0 " + grant.dot} />
                    <div>
                      <p className="text-xs text-gray-400 mb-0.5">{grant.agency}</p>
                      <p className="text-sm font-medium text-gray-800 group-hover:text-[#EA4F1E] transition-colors">{grant.title}</p>
                    </div>
                  </div>
                  <div className="text-right shrink-0 ml-4">
                    <p className={"text-sm font-bold " + grant.color}>{grant.amount}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{grant.deadline}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-xl font-bold text-gray-900">인기 게시글</h2>
              <Link href="/community" className="flex items-center gap-1 text-sm text-[#EA4F1E] font-medium">전체보기 <ChevronRight className="w-4 h-4" /></Link>
            </div>
            <p className="text-sm text-gray-400 mb-6">사장님들이 주목하는 이야기</p>
            <div className="space-y-4">
              {posts.map((post) => (
                <Link key={post.title} href="/community" className="block p-4 rounded-xl hover:bg-gray-50 transition-colors group">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="text-xs font-medium text-[#EA4F1E] bg-orange-50 px-2 py-0.5 rounded-full">{post.category}</span>
                        <span className="text-xs text-gray-400">{post.time}</span>
                      </div>
                      <p className="text-sm font-medium text-gray-800 group-hover:text-[#EA4F1E] transition-colors truncate">{post.title}</p>
                      <p className="text-xs text-gray-400 mt-1">by {post.author}</p>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-gray-400 shrink-0">
                      <span className="flex items-center gap-1"><Heart className="w-3.5 h-3.5" /> {post.likes}</span>
                      <span className="flex items-center gap-1"><MessageCircle className="w-3.5 h-3.5" /> {post.comments}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function PhotoGallerySection() {
  return (
    <section className="bg-gray-50 py-20">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {galleryItems.map((item) => (
            <Link key={item.title} href="#" className={"relative h-64 md:h-80 rounded-2xl overflow-hidden bg-gradient-to-br " + item.gradient + " group"}>
              <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors" />
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <span className="inline-block px-2.5 py-1 bg-white/20 backdrop-blur-sm text-white text-xs font-medium rounded-full mb-2">{item.category}</span>
                <p className="text-white font-semibold text-base leading-snug">{item.title}</p>
              </div>
              <div className="absolute top-4 right-4 w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <ArrowUpRight className="w-4 h-4 text-white" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTASection() {
  return (
    <section className="bg-[#1E2640] py-20">
      <div className="max-w-2xl mx-auto px-4 text-center">
        <div className="inline-flex items-center gap-2 bg-white/10 text-yellow-400 text-sm px-4 py-2 rounded-full mb-6">
          <Star className="w-4 h-4 fill-yellow-400" />
          12,000명 이상의 사장님이 함께합니다
        </div>
        <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">지금 바로 사장님광장에 합류하세요</h2>
        <p className="text-gray-400 mb-8 leading-relaxed">
          무료 회원가입으로 모든 서비스를 바로 이용할 수 있습니다.<br />
          사장님의 성장을 함께 응원합니다.
        </p>
        <div className="flex flex-wrap gap-3 justify-center">
          <Link href="/register" className="px-8 py-3 bg-[#EA4F1E] hover:bg-[#D44418] text-white font-semibold rounded-lg transition-colors">무료로 시작하기</Link>
          <Link href="/about" className="px-8 py-3 border border-white/30 text-white hover:bg-white/10 font-semibold rounded-lg transition-colors">서비스 소개 보기</Link>
        </div>
      </div>
    </section>
  );
}

export default function HomePage() {
  return (
    <>
      <Header />
      <main>
        <HeroSection />
        <StatsSection />
        <ServicesSection />
        <GrantsAndCommunitySection />
        <PhotoGallerySection />
        <CTASection />
      </main>
      <Footer />
    </>
  );
}

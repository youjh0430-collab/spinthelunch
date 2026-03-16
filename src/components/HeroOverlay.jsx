/**
 * Role: 메인 화면 오버레이 — 지도 위에 타이틀 + CTA 버튼 표시
 * Key Features: 타이틀, CTA → 바로 슬롯 실행
 * Dependencies: motion/react, ShimmerButton
 * Notes: idle 상태에서만 표시, 필터바 아래 z-index로 배치
 */
import { motion } from 'motion/react';
import ShimmerButton from './ShimmerButton';

export default function HeroOverlay({ onStart, loading }) {
  return (
    <div
      className="absolute inset-0 z-[5] flex items-center justify-center overflow-hidden pointer-events-none"
    >
      {/* 반투명 오버레이 */}
      <div className="absolute inset-0 bg-black/50" />

      {/* 중앙 타이틀 + CTA */}
      <motion.div
        className="z-50 text-center space-y-5 items-center flex flex-col pointer-events-auto"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.88, delay: 0.5 }}
      >
        <h1
          className="text-5xl md:text-7xl text-white drop-shadow-lg tracking-tighter"
          style={{ fontFamily: "'GmarketSans', sans-serif", fontWeight: 300 }}
        >
          오늘 뭐 먹지?
        </h1>
        <p className="text-white/60 text-sm md:text-base">
          결정 장애 끝. 근처 식당을 랜덤으로 골라드려요
        </p>
        <ShimmerButton
          onClick={onStart}
          disabled={loading}
          background="rgba(249, 115, 22, 1)"
          className="shadow-2xl shadow-orange-500/50 min-w-[320px]"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <span className="animate-spin inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full" />
              검색 중...
            </span>
          ) : (
            '돌려돌려밥'
          )}
        </ShimmerButton>
      </motion.div>
    </div>
  );
}

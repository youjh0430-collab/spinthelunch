/**
 * Role: 메인 화면 오버레이 — 지도 위에 음식 사진이 떠다니며 CTA 버튼 표시
 * Key Features: 패럴랙스 플로팅 음식 이미지, 타이틀, CTA → 바로 슬롯 실행
 * Dependencies: Floating, motion/react
 * Notes: idle 상태에서만 표시, 필터바 아래 z-index로 배치
 */
import { useEffect } from 'react';
import { motion, stagger, useAnimate } from 'motion/react';
import Floating, { FloatingElement } from './Floating';
import ShimmerButton from './ShimmerButton';

/** 플로팅 음식 이미지 */
const FOOD_IMAGES = [
  { url: 'https://images.unsplash.com/photo-1553621042-f6e147245754?w=200&q=80', alt: '비빔밥' },
  { url: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=200&q=80', alt: '라멘' },
  { url: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=200&q=80', alt: '스테이크' },
  { url: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=200&q=80', alt: '피자' },
  { url: 'https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=200&q=80', alt: '초밥' },
  { url: 'https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?w=200&q=80', alt: '파스타' },
  { url: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=200&q=80', alt: '도넛' },
  { url: 'https://images.unsplash.com/photo-1498654896293-37aacf113fd9?w=200&q=80', alt: '떡볶이' },
];

export default function HeroOverlay({ onStart, loading }) {
  const [scope, animate] = useAnimate();

  // 이미지 순차 페이드인
  useEffect(() => {
    animate(
      'img',
      { opacity: [0, 1] },
      { duration: 0.5, delay: stagger(0.15) }
    );
  }, [animate]);

  return (
    <div
      ref={scope}
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
          style={{ fontFamily: "'EF_jejudoldam', sans-serif" }}
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

      {/* 플로팅 음식 이미지 */}
      <Floating sensitivity={-1} className="overflow-hidden">
        <FloatingElement depth={0.5} className="top-[8%] left-[11%]">
          <motion.img
            initial={{ opacity: 0 }}
            src={FOOD_IMAGES[0].url}
            alt={FOOD_IMAGES[0].alt}
            className="w-16 h-16 md:w-24 md:h-24 rounded-2xl object-cover hover:scale-105 duration-200 transition-transform shadow-lg"
          />
        </FloatingElement>

        <FloatingElement depth={1} className="top-[10%] left-[32%]">
          <motion.img
            initial={{ opacity: 0 }}
            src={FOOD_IMAGES[1].url}
            alt={FOOD_IMAGES[1].alt}
            className="w-20 h-20 md:w-28 md:h-28 rounded-2xl object-cover hover:scale-105 duration-200 transition-transform shadow-lg"
          />
        </FloatingElement>

        <FloatingElement depth={2} className="top-[2%] left-[53%]">
          <motion.img
            initial={{ opacity: 0 }}
            src={FOOD_IMAGES[2].url}
            alt={FOOD_IMAGES[2].alt}
            className="w-28 h-40 md:w-40 md:h-52 rounded-2xl object-cover hover:scale-105 duration-200 transition-transform shadow-lg"
          />
        </FloatingElement>

        <FloatingElement depth={1} className="top-[0%] left-[83%]">
          <motion.img
            initial={{ opacity: 0 }}
            src={FOOD_IMAGES[3].url}
            alt={FOOD_IMAGES[3].alt}
            className="w-24 h-24 md:w-32 md:h-32 rounded-2xl object-cover hover:scale-105 duration-200 transition-transform shadow-lg"
          />
        </FloatingElement>

        <FloatingElement depth={1} className="top-[40%] left-[2%]">
          <motion.img
            initial={{ opacity: 0 }}
            src={FOOD_IMAGES[4].url}
            alt={FOOD_IMAGES[4].alt}
            className="w-28 h-28 md:w-36 md:h-36 rounded-2xl object-cover hover:scale-105 duration-200 transition-transform shadow-lg"
          />
        </FloatingElement>

        <FloatingElement depth={2} className="top-[70%] left-[77%]">
          <motion.img
            initial={{ opacity: 0 }}
            src={FOOD_IMAGES[5].url}
            alt={FOOD_IMAGES[5].alt}
            className="w-28 h-28 md:w-36 md:h-48 rounded-2xl object-cover hover:scale-105 duration-200 transition-transform shadow-lg"
          />
        </FloatingElement>

        <FloatingElement depth={4} className="top-[73%] left-[15%]">
          <motion.img
            initial={{ opacity: 0 }}
            src={FOOD_IMAGES[6].url}
            alt={FOOD_IMAGES[6].alt}
            className="w-40 md:w-52 h-32 md:h-40 rounded-2xl object-cover hover:scale-105 duration-200 transition-transform shadow-lg"
          />
        </FloatingElement>

        <FloatingElement depth={1} className="top-[80%] left-[50%]">
          <motion.img
            initial={{ opacity: 0 }}
            src={FOOD_IMAGES[7].url}
            alt={FOOD_IMAGES[7].alt}
            className="w-24 h-24 md:w-32 md:h-32 rounded-2xl object-cover hover:scale-105 duration-200 transition-transform shadow-lg"
          />
        </FloatingElement>
      </Floating>
    </div>
  );
}

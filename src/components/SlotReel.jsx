/**
 * Role: 슬롯머신 내부 릴 — 세로 스크롤 애니메이션 단위
 * Key Features: CSS translateY 애니메이션, cubic-bezier 감속, 반복 릴 생성
 * Notes: 자연스러운 스크롤을 위해 식당 목록을 4회 반복하여 긴 릴 생성
 */
import { useRef, useEffect, useState } from 'react';
import { SLOT_ITEM_HEIGHT, SLOT_SPIN_DURATION } from '../constants';

export default function SlotReel({ items, finalItem, isSpinning, onStop }) {
  const stripRef = useRef(null);
  const [translateY, setTranslateY] = useState(0);
  const [hasTransition, setHasTransition] = useState(false);

  // 긴 릴 생성 (4회 반복 + 혹시 모를 짧은 배열 대비 최소 개수 보장도 가능하지만 현재는 4배수)
  const extendedItems = [...items, ...items, ...items, ...items];

  // 최종 아이템의 인덱스 (마지막 반복 세트에서 찾기, -1 방어)
  const finalIndexInLastSet = finalItem
    ? items.findIndex(item => item.id === finalItem.id)
    : 0;
  // 3번째 반복 세트의 해당 위치에 정지 (충분한 회전 보장)
  const stopIndex = items.length * 3 + Math.max(0, finalIndexInLastSet);

  useEffect(() => {
    if (!isSpinning || !finalItem) return;

    // 시작 위치를 0으로 리셋 (트랜지션 없이)
    setHasTransition(false);
    setTranslateY(0);

    // 리셋 후 다음 프레임에서 애니메이션 시작 (레버 당기는 시간 고려해 약간 지연)
    const spinTimer = setTimeout(() => {
      requestAnimationFrame(() => {
        setHasTransition(true);
        setTranslateY(-(stopIndex * SLOT_ITEM_HEIGHT));
      });
    }, 150);

    return () => clearTimeout(spinTimer);
  }, [isSpinning, finalItem, stopIndex]);

  // 트랜지션 종료 감지
  const handleTransitionEnd = () => {
    if (isSpinning && onStop) {
      onStop();
    }
  };

  return (
    <div
      className="overflow-hidden relative w-full"
      style={{ height: SLOT_ITEM_HEIGHT }}
    >
      {/* 릴 상단 및 하단 그림자 (원통 질감용 입체감) */}
      <div className="absolute top-0 inset-x-0 h-4 sm:h-6 bg-gradient-to-b from-black/40 to-transparent z-10 pointer-events-none" />
      <div className="absolute bottom-0 inset-x-0 h-4 sm:h-6 bg-gradient-to-t from-black/40 to-transparent z-10 pointer-events-none" />

      {/* 가운데 하이라이트/포커스 기준선 (옵션 - 원하면 살릴 수 있음) */}
      {/* <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-[50px] border-y-2 border-red-500/30 z-10 pointer-events-none" /> */}

      <div
        ref={stripRef}
        className="will-change-transform w-full bg-white text-center"
        style={{
          transform: `translateY(${translateY}px)`,
          transition: hasTransition
            ? `transform ${SLOT_SPIN_DURATION}ms cubic-bezier(0.15, 0.85, 0.35, 1.05)` // 약간 탄성있게 멈추도록 감속 타이밍 변경
            : 'none',
        }}
        onTransitionEnd={handleTransitionEnd}
      >
        {extendedItems.map((item, index) => (
          <div
            key={`${item.id}-${index}`}
            className="flex flex-col items-center justify-center w-full px-1"
            style={{ height: SLOT_ITEM_HEIGHT }}
          >
            {/* 식당 이름 (릴에 적힌 숫자/텍스트 느낌) */}
            <p className="text-lg sm:text-[28px] font-black text-[#1a1a1a] truncate w-full tracking-tighter" style={{ fontFamily: 'var(--font-gmarket), sans-serif' }}>
              {item.place_name}
            </p>
            {/* 카테고리 (하단 작은 글씨) */}
            {item.category_name && (
              <p className="text-[10px] sm:text-xs text-stone-500 font-bold tracking-widest uppercase mt-0.5 w-full truncate">
                {item.category_name.split(' > ').pop()}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

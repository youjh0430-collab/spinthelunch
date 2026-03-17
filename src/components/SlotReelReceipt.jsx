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

  // 긴 릴 생성 (4회 반복)
  const extendedItems = [...items, ...items, ...items, ...items];

  // 최종 아이템의 인덱스 (마지막 반복 세트에서 찾기)
  const finalIndexInLastSet = items.findIndex(
    item => item.id === finalItem?.id,
  );
  // 3번째 반복 세트의 해당 위치에 정지 (충분한 회전 보장)
  const stopIndex = items.length * 3 + finalIndexInLastSet;

  useEffect(() => {
    if (!isSpinning || !finalItem) return;

    // 시작 위치를 0으로 리셋 (트랜지션 없이)
    setHasTransition(false);
    setTranslateY(0);

    // 리셋 후 다음 프레임에서 애니메이션 시작
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setHasTransition(true);
        setTranslateY(-(stopIndex * SLOT_ITEM_HEIGHT));
      });
    });
  }, [isSpinning, finalItem, stopIndex]);

  // 트랜지션 종료 감지
  const handleTransitionEnd = () => {
    if (isSpinning && onStop) {
      onStop();
    }
  };

  return (
    <div
      className="overflow-hidden relative"
      style={{ height: SLOT_ITEM_HEIGHT }}
    >
      {/* 가운데 하이라이트 */}
      <div className="absolute inset-0 border-2 border-orange-400 rounded-lg z-10 pointer-events-none" />

      <div
        ref={stripRef}
        className="will-change-transform"
        style={{
          transform: `translateY(${translateY}px)`,
          transition: hasTransition
            ? `transform ${SLOT_SPIN_DURATION}ms cubic-bezier(0.1, 0.7, 0.1, 1)` // 영수증이 쭉 뽑혀 나오는 듯한 기계적인 감속
            : 'none',
        }}
        onTransitionEnd={handleTransitionEnd}
      >
        {extendedItems.map((item, index) => {
          // 마지막 세트이고, 이 아이템이 최종 당첨 아이템이면 도장 표시 (멈춘 후에만)
          const isWinnerStamp = index === stopIndex && !isSpinning && finalItem;

          return (
            <div
              key={`${item.id}-${index}`}
              className="flex flex-col items-center justify-center text-center px-4 relative"
              style={{ height: SLOT_ITEM_HEIGHT }}
            >
              {/* 도장 효과 */}
              {isWinnerStamp && (
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none rotate-[-15deg] opacity-90">
                  <div className="border-[3px] border-red-600 text-red-600 px-3 py-1 font-black text-2xl tracking-widest rounded-sm animate-[pulse_0.5s_ease-out]">
                    당첨
                  </div>
                </div>
              )}

              <p className={`text-xl font-bold font-mono tracking-tight truncate max-w-[250px]
                ${isWinnerStamp ? 'text-gray-900' : 'text-gray-800'}`}>
                {item.place_name}
              </p>
              <p className="text-xs font-mono text-gray-500 truncate max-w-[250px] mt-1">
                {item.category_name?.split(' > ').pop()} - 1 ITEM
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

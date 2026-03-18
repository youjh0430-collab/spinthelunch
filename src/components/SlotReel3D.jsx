import { useRef, useEffect, useState } from 'react';
import { SLOT_ITEM_HEIGHT, SLOT_SPIN_DURATION } from '../constants';

export default function SlotReel3D({ items, finalItem, isSpinning, onStop }) {
  const stripRef = useRef(null);
  const [translateY, setTranslateY] = useState(0);
  const [hasTransition, setHasTransition] = useState(false);

  // 긴 릴 생성 (반복 횟수 늘려 회전감 강조)
  const extendedItems = [...items, ...items, ...items, ...items, ...items];

  // 최종 아이템의 인덱스 (마지막 반복 세트에서 찾기)
  const finalIndexInLastSet = items.findIndex(
    item => item.id === finalItem?.id,
  );
  // 충분한 회전(4바퀴)을 위해 4번째 세트 위치 계산
  const stopIndex = items.length * 4 + finalIndexInLastSet;

  useEffect(() => {
    if (!isSpinning || !finalItem) return;

    setHasTransition(false);
    setTranslateY(0);

    // 약간 지연 후 회전 시작
    const spinTimer = setTimeout(() => {
      requestAnimationFrame(() => {
        setHasTransition(true);
        setTranslateY(-(stopIndex * SLOT_ITEM_HEIGHT));
      });
    }, 100);

    return () => clearTimeout(spinTimer);
  }, [isSpinning, finalItem, stopIndex]);

  const handleTransitionEnd = () => {
    if (isSpinning && onStop) {
      onStop();
    }
  };

  return (
    <div
      className="overflow-hidden relative w-full h-full"
      style={{ height: SLOT_ITEM_HEIGHT }}
    >
      {/* 릴 내부 입체감 (강한 상하 그림자) */}
      <div className="absolute top-0 inset-x-0 h-4 sm:h-8 bg-gradient-to-b from-orange-100 to-transparent z-10 pointer-events-none" />
      <div className="absolute bottom-0 inset-x-0 h-4 sm:h-8 bg-gradient-to-t from-orange-100 to-transparent z-10 pointer-events-none" />

      <div
        ref={stripRef}
        className="will-change-transform w-full bg-white text-center"
        style={{
          transform: `translateY(${translateY}px)`,
          transition: hasTransition
            ? `transform ${SLOT_SPIN_DURATION}ms cubic-bezier(0.15, 0.85, 0.35, 1.05)`
            : 'none',
        }}
        onTransitionEnd={handleTransitionEnd}
      >
        {extendedItems.map((item, index) => (
          <div
            key={`${item.id}-${index}`}
            className="flex flex-col items-center justify-center w-full px-4"
            style={{ height: SLOT_ITEM_HEIGHT }}
          >
            <p className="text-[20px] sm:text-[28px] font-black text-orange-600 truncate w-full tracking-tighter" style={{ fontFamily: 'var(--font-gmarket), sans-serif' }}>
              {item.place_name}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

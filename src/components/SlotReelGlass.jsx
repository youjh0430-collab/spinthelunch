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
            ? `transform ${SLOT_SPIN_DURATION}ms cubic-bezier(0.25, 1, 0.5, 1)` // 더 부드럽고 우아한 감속 (Ease Out Quart)
            : 'none',
        }}
        onTransitionEnd={handleTransitionEnd}
      >
        {extendedItems.map((item, index) => (
          <div
            key={`${item.id}-${index}`}
            className="flex items-center justify-center text-center px-4"
            style={{ height: SLOT_ITEM_HEIGHT }}
          >
            <div>
              <p className="text-xl font-bold text-gray-800 tracking-tight truncate max-w-[250px] drop-shadow-sm">
                {item.place_name}
              </p>
              <p className="text-sm font-medium text-orange-500/80 truncate max-w-[250px] mt-0.5">
                {item.category_name?.split(' > ').pop()}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

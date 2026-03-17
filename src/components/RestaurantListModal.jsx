/**
 * Role: 슬롯 대상 식당 리스트 모달 — 제외할 식당을 선택할 수 있는 UI
 * Key Features: 식당 목록 표시, 개별 제외 토글, 전체 선택/해제, 적용하기/취소 분리
 * Dependencies: distance.js
 */
import { useState, useMemo } from 'react';
import { formatDistance } from '../utils/distance';

export default function RestaurantListModal({
  restaurants,
  excludedIds,
  onExcludedChange,
  onClose,
  loading,
}) {
  // 임시 제외 상태 — 적용하기 전까지 원본에 영향 없음
  const [tempExcludedIds, setTempExcludedIds] = useState(() => new Set(excludedIds));

  // 거리순(가까운순) 정렬
  const sortedRestaurants = useMemo(
    () => [...restaurants].sort((a, b) => Number(a.distance) - Number(b.distance)),
    [restaurants]
  );
  const includedCount = restaurants.length - tempExcludedIds.size;

  // 개별 식당 토글
  const toggleExclude = (id) => {
    const next = new Set(tempExcludedIds);
    if (next.has(id)) {
      next.delete(id);
    } else {
      // 최소 3개는 포함되어야 슬롯머신 가능
      if (includedCount <= 3) return;
      next.add(id);
    }
    setTempExcludedIds(next);
  };

  // 전체 선택 (제외 초기화)
  const selectAll = () => {
    setTempExcludedIds(new Set());
  };

  // 적용하기 — 임시 상태를 실제로 반영
  const handleApply = () => {
    onExcludedChange(tempExcludedIds);
    onClose();
  };

  // 취소 — 변경사항 버리고 닫기
  const handleCancel = () => {
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-end sm:items-center justify-center">
      <div className="bg-white w-full max-w-[500px] max-h-[80vh] rounded-t-2xl sm:rounded-2xl shadow-2xl flex flex-col animate-slide-up">
        {/* 헤더 */}
        <div className="p-4 border-b border-gray-100 shrink-0">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-bold text-gray-900">
              슬롯 대상 식당
            </h2>
            <button
              onClick={handleCancel}
              className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
              aria-label="닫기"
            >
              ×
            </button>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">
              {loading
                ? '검색 중...'
                : `${restaurants.length}건 중 ${includedCount}건 포함`
              }
            </p>
            {!loading && restaurants.length > 0 && (
              <button
                onClick={selectAll}
                className="text-sm text-orange-500 font-medium hover:text-orange-600"
              >
                전체 선택
              </button>
            )}
          </div>
        </div>

        {/* 식당 리스트 */}
        <div className="overflow-y-auto flex-1 p-2">
          {loading && (
            <div className="flex items-center justify-center py-12">
              <span className="animate-spin inline-block w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full" />
            </div>
          )}

          {!loading && restaurants.length === 0 && (
            <p className="text-center text-gray-400 py-12">
              검색 결과가 없어요
            </p>
          )}

          {!loading && sortedRestaurants.map(r => {
            const isExcluded = tempExcludedIds.has(r.id);
            const subCategory = r.category_name?.split(' > ').slice(1).join(' > ') || '';

            return (
              <button
                key={r.id}
                onClick={() => toggleExclude(r.id)}
                className={`w-full flex items-center gap-3 p-3 rounded-xl transition-colors text-left
                  ${isExcluded
                    ? 'bg-gray-50 opacity-50'
                    : 'hover:bg-orange-50'
                  }`}
              >
                {/* 체크박스 */}
                <div className={`w-5 h-5 rounded border-2 shrink-0 flex items-center justify-center
                  ${isExcluded
                    ? 'border-gray-300 bg-gray-100'
                    : 'border-orange-500 bg-orange-500'
                  }`}
                >
                  {!isExcluded && (
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>

                {/* 식당 정보 */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className={`font-medium truncate ${isExcluded ? 'text-gray-400 line-through' : 'text-gray-900'}`}>
                      {r.place_name}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-400 mt-0.5">
                    <span>{subCategory}</span>
                    <span>·</span>
                    <span>{formatDistance(r.distance)}</span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* 하단 안내 */}
        {!loading && includedCount <= 3 && restaurants.length > 3 && (
          <div className="px-4 py-2 bg-orange-50 text-xs text-orange-600 text-center shrink-0">
            슬롯머신을 돌리려면 최소 3개 이상 포함해야 해요
          </div>
        )}

        {/* 적용하기 버튼 */}
        {!loading && restaurants.length > 0 && (
          <div className="p-4 border-t border-gray-100 shrink-0">
            <button
              onClick={handleApply}
              className="w-full py-3 bg-orange-500 text-white font-bold rounded-xl hover:bg-orange-600 transition-colors min-h-[48px]"
            >
              {includedCount}개 식당 적용하기
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Role: 카테고리 다중 선택 + 반경 드롭다운 필터 UI
 * Key Features: 토글 버튼, 반경 선택, 상단 고정 배치
 * Dependencies: categories.js, constants
 */
import { CATEGORIES } from '../utils/categories';
import { RADIUS_OPTIONS } from '../constants';

export default function FilterBar({
  selectedCategories,
  onCategoriesChange,
  radius,
  onRadiusChange,
  onListClick,
  excludedCount,
}) {
  // 카테고리 토글
  const toggleCategory = (id) => {
    if (selectedCategories.includes(id)) {
      onCategoriesChange(selectedCategories.filter(c => c !== id));
    } else {
      onCategoriesChange([...selectedCategories, id]);
    }
  };

  return (
    <div className="absolute top-0 left-0 right-0 z-10 bg-white/90 backdrop-blur-sm shadow-md p-3">
      {/* 카테고리 토글 버튼 */}
      <div className="flex flex-wrap gap-2 mb-2">
        {/* 전체 버튼 — 선택된 카테고리가 없으면 활성화 */}
        <button
          onClick={() => onCategoriesChange([])}
          className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors min-h-[36px]
            ${selectedCategories.length === 0
              ? 'bg-orange-500 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          aria-pressed={selectedCategories.length === 0}
        >
          전체
        </button>
        {CATEGORIES.map(cat => {
          const isSelected = selectedCategories.includes(cat.id);
          return (
            <button
              key={cat.id}
              onClick={() => toggleCategory(cat.id)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors min-h-[36px]
                ${isSelected
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              aria-pressed={isSelected}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* 반경 선택 + 리스트 아이콘 */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-600 font-medium">반경</span>
        <select
          value={radius}
          onChange={(e) => onRadiusChange(Number(e.target.value))}
          className="px-3 py-1.5 rounded-lg border border-gray-300 text-sm bg-white min-h-[36px]"
          aria-label="검색 반경 선택"
        >
          {RADIUS_OPTIONS.map(opt => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        {/* 리스트 보기 버튼 */}
        <button
          onClick={onListClick}
          className="ml-auto relative p-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition-colors min-h-[36px] min-w-[36px] flex items-center justify-center"
          aria-label="식당 리스트 보기"
          title="슬롯 대상 식당 보기"
        >
          <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 12h.007v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm-.375 5.25h.007v.008H3.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
          </svg>
          {/* 제외된 식당 수 뱃지 */}
          {excludedCount > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
              {excludedCount}
            </span>
          )}
        </button>
      </div>
    </div>
  );
}

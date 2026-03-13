/**
 * Role: 선택된 식당 정보를 바텀시트 스타일로 표시
 * Key Features: 식당 상세 정보, 카카오맵 딥링크, 다시 돌리기
 * Dependencies: distance.js
 */
import { formatDistance } from '../utils/distance';

export default function ResultCard({ restaurant, onClose, onRespin }) {
  // 카테고리에서 세부 분류만 추출 (예: "음식점 > 한식 > 칼국수" → "칼국수")
  const subCategory = restaurant.category_name?.split(' > ').pop() || '';

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 animate-slide-up">
      <div className="bg-white rounded-t-2xl shadow-2xl p-5 max-w-[500px] mx-auto">
        {/* 드래그 핸들 */}
        <div className="w-10 h-1 bg-gray-300 rounded-full mx-auto mb-4" />

        {/* 식당 정보 */}
        <div className="space-y-2">
          <div className="flex items-start justify-between">
            <h3 className="text-xl font-bold text-gray-900">
              {restaurant.place_name}
            </h3>
            <span className="text-sm text-orange-500 font-medium bg-orange-50 px-2 py-1 rounded-full shrink-0 ml-2">
              {subCategory}
            </span>
          </div>

          <p className="text-sm text-gray-600">
            {restaurant.road_address_name || restaurant.address_name}
          </p>

          <div className="flex items-center gap-3 text-sm text-gray-500">
            <span>{formatDistance(restaurant.distance)}</span>
            {restaurant.phone && (
              <>
                <span>·</span>
                <a
                  href={`tel:${restaurant.phone}`}
                  className="text-blue-500 hover:underline"
                >
                  {restaurant.phone}
                </a>
              </>
            )}
          </div>
        </div>

        {/* 액션 버튼 */}
        <div className="flex gap-3 mt-5">
          <a
            href={restaurant.place_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 py-3 text-center bg-orange-500 text-white font-bold rounded-xl hover:bg-orange-600 transition-colors min-h-[48px] flex items-center justify-center"
          >
            자세히 보기
          </a>
          <button
            onClick={onRespin}
            className="flex-1 py-3 text-center bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-colors min-h-[48px]"
          >
            다시 돌리기
          </button>
        </div>

        {/* 닫기 */}
        <button
          onClick={onClose}
          className="w-full mt-3 py-2 text-sm text-gray-400 hover:text-gray-600"
        >
          닫기
        </button>
      </div>
    </div>
  );
}

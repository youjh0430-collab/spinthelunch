/**
 * Role: 검색 결과 1~2건일 때 슬롯머신 대신 카드 리스트로 표시
 * Key Features: 소수 결과 안내, 식당 카드 목록
 * Dependencies: distance.js
 */
import { formatDistance } from '../utils/distance';

export default function FewResultsList({ restaurants, onClose }) {
  return (
    <div className="fixed inset-0 z-40 bg-black/50 flex items-end justify-center">
      <div className="bg-white rounded-t-2xl p-5 w-full max-w-[500px] shadow-2xl">
        <div className="w-10 h-1 bg-gray-300 rounded-full mx-auto mb-4" />

        <p className="text-center text-sm text-gray-500 mb-4">
          주변에 {restaurants.length}개 식당만 있어요!
        </p>

        <div className="space-y-3">
          {restaurants.map((r) => (
            <a
              key={r.id}
              href={r.place_url}
              target="_blank"
              rel="noopener noreferrer"
              className="block p-4 bg-orange-50 rounded-xl hover:bg-orange-100 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-bold text-gray-900">{r.place_name}</h4>
                  <p className="text-sm text-gray-500 mt-1">
                    {r.category_name?.split(' > ').pop()}
                  </p>
                </div>
                <span className="text-sm text-orange-500 font-medium">
                  {formatDistance(r.distance)}
                </span>
              </div>
              <p className="text-xs text-gray-400 mt-1">
                {r.road_address_name || r.address_name}
              </p>
            </a>
          ))}
        </div>

        <button
          onClick={onClose}
          className="w-full mt-4 py-3 text-gray-500 hover:text-gray-700 text-sm"
        >
          닫기
        </button>
      </div>
    </div>
  );
}

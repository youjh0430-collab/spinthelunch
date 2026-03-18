/**
 * Role: 선택된 식당 정보를 바텀시트 스타일로 표시
 * Key Features: 식당 상세 정보, 네이버 이미지/블로그 리뷰, 카카오맵 딥링크, 다시 돌리기
 * Dependencies: distance.js, naver-search API
 */
import { useState, useEffect } from 'react';
import { formatDistance } from '../utils/distance';

/** HTML 태그 제거 — 네이버 API 응답에 <b> 태그가 포함되어 있어서 */
function stripHtml(str) {
  return str?.replace(/<[^>]*>/g, '') || '';
}

export default function ResultCard({ restaurant, onClose, onRespin }) {
  const [images, setImages] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  // 카테고리에서 세부 분류만 추출 (예: "음식점 > 한식 > 칼국수" → "칼국수")
  const subCategory = restaurant.category_name?.split(' > ').pop() || '';

  // 식당명 + 동이름으로 네이버 검색 — 지번 주소에서 동 추출 (블로그에서 더 많이 쓰이는 표현)
  useEffect(() => {
    // 지번 주소에서 동 이름 추출 (예: "서울 강남구 역삼동 123-45" → "역삼동")
    const addrParts = restaurant.address_name?.split(' ') || [];
    const dong = addrParts.find(p => /[동면읍리]$/.test(p)) || '';

    // 블로그: 식당명 + 동이름 (따옴표 없이 — 정확 매칭이 너무 엄격하면 0건 나옴)
    const blogQuery = `${restaurant.place_name} ${dong} 맛집 리뷰`;
    // 이미지: 식당명 + 동이름 (음식 키워드 대신 동이름으로 특정 매장 정확도 향상)
    const imageQuery = `${restaurant.place_name} ${dong}`;

    fetch(`/api/naver-search?blogQuery=${encodeURIComponent(blogQuery)}&imageQuery=${encodeURIComponent(imageQuery)}`)
      .then((res) => res.json())
      .then((data) => {
        setImages(data.images || []);
        setBlogs(data.blogs || []);
      })
      .catch(() => {
        // 네이버 검색 실패해도 기본 정보는 표시
      })
      .finally(() => setLoading(false));
  }, [restaurant]);

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 animate-slide-up">
      <div className="bg-white rounded-t-2xl shadow-2xl p-5 max-w-[500px] mx-auto max-h-[80vh] overflow-y-auto">
        {/* 드래그 핸들 — 탭하면 바텀시트 닫기 */}
        <button
          onClick={onClose}
          className="w-full flex justify-center py-2 -mt-2 mb-2 cursor-pointer"
          aria-label="닫기"
        >
          <div className="w-10 h-1 bg-gray-300 rounded-full" />
        </button>

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

        {/* 네이버 이미지 — 로딩 중이면 스켈레톤 표시 */}
        <div className="mt-4">
          {loading ? (
            <div className="flex gap-2">
              {[0, 1, 2].map((i) => (
                <div key={i} className="w-1/3 aspect-square bg-gray-100 rounded-lg animate-pulse" />
              ))}
            </div>
          ) : images.length > 0 ? (
            <div className="flex gap-2 overflow-x-auto">
              {images.map((img, i) => (
                <a
                  key={i}
                  href={img.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="shrink-0 w-1/3"
                >
                  <img
                    src={img.thumbnail}
                    alt={stripHtml(img.title)}
                    className="w-full aspect-square object-cover rounded-lg"
                    onError={(e) => { e.target.style.display = 'none'; }}
                  />
                </a>
              ))}
            </div>
          ) : null}
        </div>

        {/* 네이버 블로그 리뷰 */}
        {!loading && blogs.length > 0 && (
          <div className="mt-4 space-y-2">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">블로그 리뷰</p>
            {blogs.map((blog, i) => (
              <a
                key={i}
                href={blog.link}
                target="_blank"
                rel="noopener noreferrer"
                className="block p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
              >
                <p className="text-sm font-semibold text-gray-800 line-clamp-1">
                  {stripHtml(blog.title)}
                </p>
                <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                  {stripHtml(blog.description)}
                </p>
                <div className="flex items-center gap-2 mt-2 text-xs text-gray-400">
                  <span>{blog.bloggername}</span>
                  <span>·</span>
                  <span>
                    {blog.postdate?.replace(/(\d{4})(\d{2})(\d{2})/, '$1.$2.$3')}
                  </span>
                </div>
              </a>
            ))}
          </div>
        )}

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

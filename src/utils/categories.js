/**
 * Role: 카테고리 상수 및 카카오 API 카테고리 매핑
 * Key Features: 카테고리 목록, 카카오 API 그룹 코드 매핑, 필터 키워드
 * Notes: 카카오 API는 FD6(음식점), CE7(카페) 대분류만 지원하므로
 *        세부 카테고리는 응답의 category_name 필드로 클라이언트 필터링.
 *        label은 UI 표시용, keywords는 category_name 매칭용 (분리)
 */

export const CATEGORIES = [
  { id: 'korean', label: '한식', kakaoCode: 'FD6', keywords: ['한식'] },
  { id: 'chinese', label: '중식', kakaoCode: 'FD6', keywords: ['중식'] },
  { id: 'japanese', label: '일식', kakaoCode: 'FD6', keywords: ['일식'] },
  { id: 'western', label: '양식', kakaoCode: 'FD6', keywords: ['양식'] },
  { id: 'snack', label: '분식', kakaoCode: 'FD6', keywords: ['분식'] },
  { id: 'cafe', label: '카페/디저트', kakaoCode: 'CE7', keywords: ['카페', '디저트'] },
  { id: 'fastfood', label: '패스트푸드', kakaoCode: 'FD6', keywords: ['패스트푸드'] },
  { id: 'etc', label: '기타', kakaoCode: 'FD6', keywords: ['뷔페', '술집', '간식', '족발', '보쌈'] },
];

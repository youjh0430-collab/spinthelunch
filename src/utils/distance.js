/**
 * Role: 거리 값을 사용자 친화적 문자열로 포맷팅
 * Key Features: m/km 자동 변환
 */

/** 미터 단위 거리를 "350m" / "1.2km" 형태로 변환 */
export function formatDistance(meters) {
  const m = Number(meters);
  if (m < 1000) {
    return `${Math.round(m)}m`;
  }
  return `${(m / 1000).toFixed(1)}km`;
}

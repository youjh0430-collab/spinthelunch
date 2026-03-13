/**
 * Role: 앱 전역 상수 정의
 * Key Features: 반경 옵션, 최대 결과 수, 슬롯머신 설정
 */

// 반경 옵션 (미터 단위)
export const RADIUS_OPTIONS = [
  { value: 300, label: '300m' },
  { value: 500, label: '500m' },
  { value: 1000, label: '1km' },
  { value: 2000, label: '2km' },
];

export const DEFAULT_RADIUS = 500;

// 카카오 API 페이징 한도 (15건 × 3페이지)
export const MAX_RESULTS = 45;

// 슬롯머신 아이템 높이 (px)
export const SLOT_ITEM_HEIGHT = 80;

// 슬롯머신 애니메이션 시간 (ms)
export const SLOT_SPIN_DURATION = 3000;

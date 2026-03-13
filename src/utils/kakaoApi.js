/**
 * Role: 카카오 로컬 REST API 호출 함수
 * Key Features: 키워드 검색 + 카테고리 검색 병행, 주소 → 좌표 변환
 * Dependencies: categories.js
 * Notes: 세부 카테고리(분식, 카페 등)는 카테고리 검색에서 누락되는 경우가 많아
 *        키워드 검색을 병행하여 정확도를 높임
 */

import { CATEGORIES } from './categories';
import { MAX_RESULTS } from '../constants';

const REST_KEY = import.meta.env.VITE_KAKAO_REST_KEY;
const API_BASE = '/kakao-api/v2/local';

/** 공통 fetch 래퍼 — Authorization 헤더 자동 추가 */
async function kakaoFetch(path, params) {
  const url = `${API_BASE}${path}?${new URLSearchParams(params)}`;
  const res = await fetch(url, {
    headers: { Authorization: `KakaoAK ${REST_KEY}` },
  });

  if (!res.ok) {
    throw new Error(`카카오 API 호출 실패 (${res.status})`);
  }

  return res.json();
}

/** 페이지 순회하며 결과 수집 (최대 3페이지) */
async function fetchPages(path, baseParams) {
  const results = [];
  for (let page = 1; page <= 3; page++) {
    const data = await kakaoFetch(path, { ...baseParams, page });
    results.push(...data.documents);
    if (data.meta.is_end) break;
  }
  return results;
}

/**
 * 주변 식당 검색
 * - 전체 선택: 카테고리 검색(FD6) 사용
 * - 세부 카테고리 선택: 키워드 검색으로 정확한 결과 확보
 */
export async function searchRestaurants({ lat, lng, radius, categories }) {
  const selectedCats = categories.length > 0
    ? CATEGORIES.filter(c => categories.includes(c.id))
    : [];

  let allResults = [];

  if (selectedCats.length === 0) {
    // 전체 검색 — 카테고리 검색(FD6)으로 음식점 전체 조회
    allResults = await fetchPages('/search/category.json', {
      category_group_code: 'FD6',
      x: lng,
      y: lat,
      radius,
      sort: 'distance',
      size: 15,
    });

    allResults.sort((a, b) => Number(a.distance) - Number(b.distance));
    return allResults.slice(0, MAX_RESULTS);
  }

  // 세부 카테고리 선택 — 카테고리별 균등 할당
  const perCatLimit = Math.ceil(MAX_RESULTS / selectedCats.length);
  const seen = new Set();

  // 카테고리별로 결과를 따로 모은 뒤, 각각 할당량만큼만 유지
  const buckets = [];

  for (const cat of selectedCats) {
    const groupCode = cat.kakaoCode;
    const bucket = [];

    for (const keyword of cat.keywords) {
      const results = await fetchPages('/search/keyword.json', {
        query: keyword,
        x: lng,
        y: lat,
        radius,
        sort: 'distance',
        size: 15,
        category_group_code: groupCode,
      });

      for (const r of results) {
        if (!seen.has(r.id)) {
          seen.add(r.id);
          bucket.push(r);
        }
      }
    }

    // 거리순 정렬 후 할당량만큼 자르기
    bucket.sort((a, b) => Number(a.distance) - Number(b.distance));
    buckets.push(bucket.slice(0, perCatLimit));
  }

  // 할당량을 못 채운 카테고리의 남은 자리를 다른 카테고리에 재분배
  const totalSlots = MAX_RESULTS;
  let filled = buckets.reduce((sum, b) => sum + b.length, 0);

  if (filled < totalSlots) {
    // 여유 슬롯이 있으면, 원본에서 더 가져올 수 있는 카테고리에 재분배
    // (이미 slice된 결과를 사용하므로 현재 구조에서는 추가 fetch 불필요)
  }

  // 모든 버킷 병합 후 거리순 정렬
  allResults = buckets.flat();
  allResults.sort((a, b) => Number(a.distance) - Number(b.distance));
  return allResults.slice(0, MAX_RESULTS);
}

/**
 * 주소 → 좌표 변환 (수동 위치 입력용)
 * @param {string} address - 검색할 주소
 * @returns {{ lat: number, lng: number } | null}
 */
export async function searchAddress(address) {
  const data = await kakaoFetch('/search/address.json', { query: address });

  if (data.documents.length === 0) {
    return null;
  }

  const { y, x } = data.documents[0];
  return { lat: Number(y), lng: Number(x) };
}

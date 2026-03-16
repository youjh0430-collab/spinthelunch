/**
 * Role: 카카오 JavaScript SDK 기반 장소 검색 함수
 * Key Features: 키워드 검색 + 카테고리 검색 병행, 주소 → 좌표 변환
 * Dependencies: categories.js, 카카오맵 JavaScript SDK (index.html에서 로드)
 * Notes: REST API 대신 JavaScript SDK를 사용하여 CORS 문제 없이 정적 호스팅에서도 동작
 */

import { CATEGORIES } from './categories';
import { MAX_RESULTS } from '../constants';

/** SDK의 Places 서비스 인스턴스를 지연 생성 */
function getPlaces() {
  if (!window.kakao?.maps?.services) {
    throw new Error('카카오맵 SDK가 아직 로드되지 않았어요.');
  }
  return new window.kakao.maps.services.Places();
}

/** SDK의 Geocoder 서비스 인스턴스를 지연 생성 */
function getGeocoder() {
  if (!window.kakao?.maps?.services) {
    throw new Error('카카오맵 SDK가 아직 로드되지 않았어요.');
  }
  return new window.kakao.maps.services.Geocoder();
}

/** SDK 콜백을 Promise로 변환하는 헬퍼 */
function searchByCategory(places, code, { lat, lng, radius, page = 1 }) {
  return new Promise((resolve, reject) => {
    places.categorySearch(
      code,
      (data, status, pagination) => {
        if (status === window.kakao.maps.services.Status.OK) {
          resolve({ documents: data, isEnd: pagination.is_end });
        } else if (status === window.kakao.maps.services.Status.ZERO_RESULT) {
          resolve({ documents: [], isEnd: true });
        } else {
          reject(new Error(`카테고리 검색 실패 (${status})`));
        }
      },
      {
        location: new window.kakao.maps.LatLng(lat, lng),
        radius,
        sort: window.kakao.maps.services.SortBy.DISTANCE,
        size: 15,
        page,
      }
    );
  });
}

/** 키워드 검색을 Promise로 변환 */
function searchByKeyword(places, keyword, { lat, lng, radius, page = 1, categoryCode }) {
  return new Promise((resolve, reject) => {
    places.keywordSearch(
      keyword,
      (data, status, pagination) => {
        if (status === window.kakao.maps.services.Status.OK) {
          resolve({ documents: data, isEnd: pagination.is_end });
        } else if (status === window.kakao.maps.services.Status.ZERO_RESULT) {
          resolve({ documents: [], isEnd: true });
        } else {
          reject(new Error(`키워드 검색 실패 (${status})`));
        }
      },
      {
        location: new window.kakao.maps.LatLng(lat, lng),
        radius,
        sort: window.kakao.maps.services.SortBy.DISTANCE,
        size: 15,
        page,
        category_group_code: categoryCode,
      }
    );
  });
}

/** 페이지 순회하며 결과 수집 (최대 3페이지) */
async function fetchCategoryPages(places, code, options) {
  const results = [];
  for (let page = 1; page <= 3; page++) {
    const { documents, isEnd } = await searchByCategory(places, code, { ...options, page });
    results.push(...documents);
    if (isEnd) break;
  }
  return results;
}

/** 키워드 검색 페이지 순회 (최대 3페이지) */
async function fetchKeywordPages(places, keyword, options) {
  const results = [];
  for (let page = 1; page <= 3; page++) {
    const { documents, isEnd } = await searchByKeyword(places, keyword, { ...options, page });
    results.push(...documents);
    if (isEnd) break;
  }
  return results;
}

/**
 * 주변 식당 검색
 * - 전체 선택: 카테고리 검색(FD6) 사용
 * - 세부 카테고리 선택: 키워드 검색으로 정확한 결과 확보
 */
export async function searchRestaurants({ lat, lng, radius, categories }) {
  const places = getPlaces();
  const selectedCats = categories.length > 0
    ? CATEGORIES.filter(c => categories.includes(c.id))
    : [];

  let allResults = [];

  if (selectedCats.length === 0) {
    // 전체 검색 — 카테고리 검색(FD6)으로 음식점 전체 조회
    allResults = await fetchCategoryPages(places, 'FD6', { lat, lng, radius });
    allResults.sort((a, b) => Number(a.distance) - Number(b.distance));
    return allResults.slice(0, MAX_RESULTS);
  }

  // 세부 카테고리 선택 — 카테고리별 균등 할당
  const perCatLimit = Math.ceil(MAX_RESULTS / selectedCats.length);
  const seen = new Set();
  const buckets = [];

  for (const cat of selectedCats) {
    const bucket = [];

    for (const keyword of cat.keywords) {
      const results = await fetchKeywordPages(places, keyword, {
        lat,
        lng,
        radius,
        categoryCode: cat.kakaoCode,
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
  const geocoder = getGeocoder();

  return new Promise((resolve, reject) => {
    geocoder.addressSearch(address, (result, status) => {
      if (status === window.kakao.maps.services.Status.OK && result.length > 0) {
        resolve({ lat: Number(result[0].y), lng: Number(result[0].x) });
      } else if (status === window.kakao.maps.services.Status.ZERO_RESULT || result.length === 0) {
        resolve(null);
      } else {
        reject(new Error('주소 검색에 실패했어요.'));
      }
    });
  });
}

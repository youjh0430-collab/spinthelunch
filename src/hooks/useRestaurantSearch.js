/**
 * Role: 카카오 로컬 API 식당 검색 상태 관리 훅
 * Key Features: 검색 실행, 로딩/에러 상태
 * Dependencies: kakaoApi.searchRestaurants
 * Notes: App.jsx에서 직접 searchRestaurants를 호출하는 대안도 있으나
 *        재사용성을 위해 훅으로 분리
 */
import { useState, useCallback } from 'react';
import { searchRestaurants } from '../utils/kakaoApi';

export function useRestaurantSearch() {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const search = useCallback(async ({ lat, lng, radius, categories }) => {
    try {
      setLoading(true);
      setError(null);
      const results = await searchRestaurants({ lat, lng, radius, categories });
      setRestaurants(results);
      return results;
    } catch (err) {
      setError(err.message || '식당 검색에 실패했어요.');
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  return { restaurants, loading, error, search };
}

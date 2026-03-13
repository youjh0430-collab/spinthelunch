/**
 * Role: 브라우저 Geolocation API 래퍼 훅
 * Key Features: 현재 위치 감지, 에러 코드별 한국어 메시지, 타임아웃 10초
 */
import { useState, useEffect } from 'react';

const ERROR_MESSAGES = {
  1: '위치 권한이 거부되었어요. 주소를 직접 입력해주세요.',
  2: '현재 위치를 확인할 수 없어요. 주소를 직접 입력해주세요.',
  3: '위치 확인 시간이 초과되었어요. 다시 시도해주세요.',
};

export function useGeolocation() {
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError('이 브라우저에서는 위치 서비스를 지원하지 않아요.');
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setLoading(false);
      },
      (err) => {
        setError(ERROR_MESSAGES[err.code] || '알 수 없는 위치 오류가 발생했어요.');
        setLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000, // 1분 캐시 허용
      },
    );
  }, []);

  return { location, error, loading };
}

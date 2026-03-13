/**
 * Role: 카카오맵 JavaScript SDK 로드 상태 감지 훅
 * Key Features: index.html에서 로드된 SDK의 준비 상태 확인
 * Notes: SDK는 index.html에서 autoload=false로 로드하므로 여기서 maps.load() 호출
 */
import { useState, useEffect } from 'react';

export function useKakaoMap() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // SDK가 이미 완전히 로드된 경우
    if (window.kakao?.maps?.Map) {
      setIsLoaded(true);
      return;
    }

    // SDK 스크립트는 로드되었지만 maps.load()가 필요한 경우
    if (window.kakao?.maps?.load) {
      window.kakao.maps.load(() => {
        console.log('[카카오맵] maps.load 완료');
        setIsLoaded(true);
      });
      return;
    }

    // SDK가 아직 로드 중일 수 있으므로 대기
    const checkInterval = setInterval(() => {
      if (window.kakao?.maps?.load) {
        clearInterval(checkInterval);
        window.kakao.maps.load(() => {
          console.log('[카카오맵] maps.load 완료 (대기 후)');
          setIsLoaded(true);
        });
      }
    }, 100);

    // 10초 후 타임아웃
    const timeout = setTimeout(() => {
      clearInterval(checkInterval);
      if (!isLoaded) {
        console.error('[카카오맵] SDK 로드 타임아웃');
        setError('카카오맵을 불러오지 못했어요. 새로고침해주세요.');
      }
    }, 10000);

    return () => {
      clearInterval(checkInterval);
      clearTimeout(timeout);
    };
  }, []);

  return { isLoaded, error };
}

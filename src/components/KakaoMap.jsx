/**
 * Role: 카카오맵 렌더링 + 현재 위치/결과 식당 마커 표시
 * Key Features: 지도 초기화, 반경 원 표시, 원 경계 기준 줌 자동 맞춤, 마커
 * Dependencies: useKakaoMap 훅으로 SDK 로드 완료 후 사용
 */
import { useRef, useEffect, memo } from 'react';

/** 반경 원이 화면에 꽉 차도록 bounds를 계산하여 지도 줌 조정 */
function fitMapToRadius(map, centerLatLng, radius) {
  // 반경의 동서남북 끝점으로 bounds 생성
  const bounds = new window.kakao.maps.LatLngBounds();

  // 위도 1도 ≈ 111,320m, 경도 1도 ≈ 111,320m × cos(위도)
  const lat = centerLatLng.getLat();
  const lng = centerLatLng.getLng();
  const latOffset = radius / 111320;
  const lngOffset = radius / (111320 * Math.cos(lat * Math.PI / 180));

  bounds.extend(new window.kakao.maps.LatLng(lat - latOffset, lng - lngOffset));
  bounds.extend(new window.kakao.maps.LatLng(lat + latOffset, lng + lngOffset));

  map.setBounds(bounds);
}

function KakaoMap({ center, radius, selectedRestaurant }) {
  const containerRef = useRef(null);
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const restaurantMarkerRef = useRef(null);
  const circleRef = useRef(null);
  const overlayRef = useRef(null);

  // 지도 초기화
  useEffect(() => {
    if (!containerRef.current || !window.kakao?.maps) return;

    const position = new window.kakao.maps.LatLng(center.lat, center.lng);
    const map = new window.kakao.maps.Map(containerRef.current, {
      center: position,
      level: 5,
    });

    // 현재 위치 마커
    const marker = new window.kakao.maps.Marker({
      position,
      map,
    });

    // "내 위치" 오버레이
    const overlay = new window.kakao.maps.CustomOverlay({
      content: '<div style="padding:4px 8px;background:#3B82F6;color:#fff;border-radius:12px;font-size:12px;font-weight:600;transform:translateY(-45px);">내 위치</div>',
      position,
      map,
    });

    // 반경 원 표시
    const circle = new window.kakao.maps.Circle({
      center: position,
      radius,
      strokeWeight: 2,
      strokeColor: '#F97316',
      strokeOpacity: 0.8,
      strokeStyle: 'dashed',
      fillColor: '#F97316',
      fillOpacity: 0.08,
    });
    circle.setMap(map);

    mapRef.current = map;
    markerRef.current = marker;
    circleRef.current = circle;
    overlayRef.current = overlay;

    // 반경에 맞게 줌 조정
    fitMapToRadius(map, position, radius);

    return () => {
      overlay.setMap(null);
      marker.setMap(null);
      circle.setMap(null);
    };
  }, [center.lat, center.lng]);

  // 반경 변경 시 원 크기 + 줌 자동 맞춤
  useEffect(() => {
    if (!mapRef.current) return;

    const position = new window.kakao.maps.LatLng(center.lat, center.lng);

    // 원 반경 업데이트
    if (circleRef.current) {
      circleRef.current.setRadius(radius);
    }

    // 지도 중심 복원 + 반경에 맞게 줌 조정
    mapRef.current.setCenter(position);
    fitMapToRadius(mapRef.current, position, radius);
  }, [radius, center.lat, center.lng]);

  // 선택된 식당 마커 업데이트
  useEffect(() => {
    if (!mapRef.current) return;

    // 기존 식당 마커 제거
    if (restaurantMarkerRef.current) {
      restaurantMarkerRef.current.setMap(null);
      restaurantMarkerRef.current = null;
    }

    if (!selectedRestaurant) return;

    const position = new window.kakao.maps.LatLng(
      Number(selectedRestaurant.y),
      Number(selectedRestaurant.x),
    );

    // 식당 마커 추가
    const marker = new window.kakao.maps.Marker({
      position,
      map: mapRef.current,
    });

    restaurantMarkerRef.current = marker;

    // 지도 중심을 현재 위치와 식당 사이로 이동
    const bounds = new window.kakao.maps.LatLngBounds();
    bounds.extend(new window.kakao.maps.LatLng(center.lat, center.lng));
    bounds.extend(position);
    mapRef.current.setBounds(bounds);
  }, [selectedRestaurant, center.lat, center.lng]);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 w-full h-full"
      aria-label="주변 지도"
    />
  );
}

// 불필요한 리렌더링 방지
export default memo(KakaoMap);

/**
 * Role: 루트 컴포넌트 — 전체 상태 관리 및 레이아웃 오케스트레이션
 * Key Features: 위치 감지, 필터, 식당 검색, 슬롯머신, 결과 표시, 식당 제외
 * Dependencies: 모든 컴포넌트 및 훅
 */
import { useState, useCallback } from 'react';
import { useGeolocation } from './hooks/useGeolocation';
import { useKakaoMap } from './hooks/useKakaoMap';
import { searchRestaurants } from './utils/kakaoApi';
import { DEFAULT_RADIUS } from './constants';
import KakaoMap from './components/KakaoMap';
import FilterBar from './components/FilterBar';
import SlotMachine from './components/SlotMachine';
import ResultCard from './components/ResultCard';
import ManualAddressInput from './components/ManualAddressInput';
import ErrorMessage from './components/ErrorMessage';
import FewResultsList from './components/FewResultsList';
import RestaurantListModal from './components/RestaurantListModal';
import HeroOverlay from './components/HeroOverlay';

export default function App() {
  // 위치 관련
  const { location, error: locationError, loading: locationLoading } = useGeolocation();
  const [manualLocation, setManualLocation] = useState(null);
  const currentLocation = manualLocation || location;

  // 카카오맵 SDK 로드
  const { isLoaded: isMapLoaded } = useKakaoMap();

  // 필터 관련
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [radius, setRadius] = useState(DEFAULT_RADIUS);

  // 검색 결과
  const [restaurants, setRestaurants] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState(null);

  // 식당 제외 관리
  const [excludedIds, setExcludedIds] = useState(new Set());
  const [showListModal, setShowListModal] = useState(false);
  const [previewRestaurants, setPreviewRestaurants] = useState([]);
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);

  // 지역 변경 모달
  const [showLocationChange, setShowLocationChange] = useState(false);

  // UI 단계: idle | spinning | result | few-results
  const [phase, setPhase] = useState('idle');
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [lastResult, setLastResult] = useState(null);

  // 리스트 아이콘 클릭 — 미리보기 검색 후 모달 표시
  const handleListClick = useCallback(async () => {
    if (!currentLocation) return;

    setShowListModal(true);
    setIsPreviewLoading(true);

    try {
      const results = await searchRestaurants({
        lat: currentLocation.lat,
        lng: currentLocation.lng,
        radius,
        categories: selectedCategories,
      });
      setPreviewRestaurants(results);
    } catch {
      setPreviewRestaurants([]);
    } finally {
      setIsPreviewLoading(false);
    }
  }, [currentLocation, radius, selectedCategories]);

  // "돌려돌려밥" CTA 클릭 — 검색 + 바로 슬롯 실행
  const handleSpin = useCallback(async () => {
    if (!currentLocation) return;

    try {
      setIsSearching(true);
      setSearchError(null);

      const results = await searchRestaurants({
        lat: currentLocation.lat,
        lng: currentLocation.lng,
        radius,
        categories: selectedCategories,
      });

      // 제외된 식당 필터링
      const filtered = results.filter(r => !excludedIds.has(r.id));

      if (filtered.length === 0) {
        setPhase('idle');
        setSearchError('주변에 조건에 맞는 식당이 없어요. 반경을 넓히거나 제외 목록을 확인해보세요!');
        return;
      }

      if (filtered.length <= 2) {
        setRestaurants(filtered);
        setPhase('few-results');
        return;
      }

      setRestaurants(filtered);
      setPhase('spinning');
    } catch {
      setSearchError('식당 정보를 불러오지 못했어요. 잠시 후 다시 시도해주세요.');
    } finally {
      setIsSearching(false);
    }
  }, [currentLocation, radius, selectedCategories, excludedIds]);

  // 슬롯머신 완료 핸들러
  const handleSlotComplete = useCallback((restaurant) => {
    setSelectedRestaurant(restaurant);
    setLastResult(restaurant);
    setPhase('result');
  }, []);

  // 다시 돌리기 핸들러
  const handleRespin = useCallback(() => {
    if (restaurants.length <= 2) {
      setPhase('few-results');
      return;
    }
    setPhase('spinning');
  }, [restaurants]);

  // 결과 닫기
  const handleCloseResult = useCallback(() => {
    setPhase('idle');
    setSelectedRestaurant(null);
  }, []);

  // 지역 변경 핸들러 — 기존 상태 초기화 후 수동 입력 모달 표시
  const handleLocationChange = useCallback(() => {
    setShowLocationChange(true);
  }, []);

  // 지역 변경 완료 핸들러
  const handleLocationChangeComplete = useCallback((newLocation) => {
    setManualLocation(newLocation);
    setShowLocationChange(false);
    // 지역 변경 시 기존 검색 결과 초기화
    setRestaurants([]);
    setSelectedRestaurant(null);
    setExcludedIds(new Set());
    setPhase('idle');
  }, []);

  // 위치 권한 거부 + 수동 입력이 필요한 상태
  const needManualInput = !locationLoading && !location && locationError;

  return (
    <div className="relative h-full w-full bg-gray-100">
      {/* 배경 지도 */}
      {isMapLoaded && currentLocation && (
        <KakaoMap
          center={currentLocation}
          radius={radius}
          selectedRestaurant={selectedRestaurant}
        />
      )}

      {/* 지도 로딩 중 또는 위치 미확인 시 */}
      {!currentLocation && (
        <div className="flex h-full items-center justify-center bg-gray-200">
          {locationLoading && (
            <p className="text-gray-500 text-lg">현재 위치를 확인하고 있어요...</p>
          )}
          {needManualInput && (
            <ManualAddressInput onLocationSet={setManualLocation} />
          )}
        </div>
      )}

      {/* 상단 필터 바 — 항상 표시 */}
      {currentLocation && (
        <FilterBar
          selectedCategories={selectedCategories}
          onCategoriesChange={setSelectedCategories}
          radius={radius}
          onRadiusChange={setRadius}
          onListClick={handleListClick}
          includedCount={previewRestaurants.length > 0 ? previewRestaurants.length - excludedIds.size : 0}
          onLocationChange={handleLocationChange}
        />
      )}

      {/* idle 상태: 플로팅 음식 사진 + 타이틀 + CTA 버튼 */}
      {currentLocation && phase === 'idle' && (
        <HeroOverlay
          onStart={handleSpin}
          loading={isSearching}
        />
      )}

      {/* 에러 메시지 */}
      {searchError && (
        <ErrorMessage
          message={searchError}
          onClose={() => setSearchError(null)}
          action="다시 시도"
          onAction={handleSpin}
        />
      )}

      {/* 슬롯머신 모달 — 시안 4(삼첩분식) 적용 */}
      {phase === 'spinning' && (
        <SlotMachine
          restaurants={restaurants}
          lastResult={lastResult}
          onComplete={handleSlotComplete}
          onClose={handleCloseResult}
        />
      )}

      {/* 결과 카드 */}
      {phase === 'result' && selectedRestaurant && (
        <ResultCard
          restaurant={selectedRestaurant}
          onClose={handleCloseResult}
          onRespin={handleRespin}
        />
      )}

      {/* 소수 결과 리스트 (1~2건) */}
      {phase === 'few-results' && (
        <FewResultsList
          restaurants={restaurants}
          onClose={handleCloseResult}
        />
      )}

      {/* 지역 변경 모달 */}
      {showLocationChange && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="relative w-full max-w-[400px] mx-4">
            <button
              onClick={() => setShowLocationChange(false)}
              className="absolute -top-10 right-0 text-white text-sm hover:underline"
            >
              닫기
            </button>
            <ManualAddressInput onLocationSet={handleLocationChangeComplete} />
          </div>
        </div>
      )}

      {/* 식당 리스트 모달 */}
      {showListModal && (
        <RestaurantListModal
          restaurants={previewRestaurants}
          excludedIds={excludedIds}
          onExcludedChange={setExcludedIds}
          onClose={() => setShowListModal(false)}
          loading={isPreviewLoading}
        />
      )}
    </div>
  );
}

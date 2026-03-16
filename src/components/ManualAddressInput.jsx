/**
 * Role: 위치 권한 거부 시 수동 주소 입력 UI
 * Key Features: 주소 검색 → 좌표 변환, 에러 처리
 * Dependencies: kakaoApi.searchAddress
 */
import { useState } from 'react';
import { searchAddress } from '../utils/kakaoApi';

export default function ManualAddressInput({ onLocationSet }) {
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!address.trim()) return;

    try {
      setLoading(true);
      setError(null);

      const result = await searchAddress(address.trim());
      if (!result) {
        setError('주소를 찾을 수 없어요. 다른 주소로 다시 검색해주세요.');
        return;
      }

      onLocationSet(result);
    } catch {
      setError('주소 검색에 실패했어요. 다시 시도해주세요.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-[380px] mx-auto p-6">
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-2">
          위치를 입력해주세요
        </h2>
        <p className="text-sm text-gray-500 mb-4">
          위치 권한이 거부되었어요. 주소를 직접 입력하면 주변 식당을 찾아드릴게요.
        </p>

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="예: 강남역, 서울시 강남구 역삼동"
            className="w-full px-4 py-3 border border-gray-300 rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
            aria-label="주소 입력"
          />

          {error && (
            <p className="text-sm text-red-500">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading || !address.trim()}
            className={`w-full py-3 rounded-xl font-bold text-white transition-colors min-h-[48px]
              ${loading || !address.trim()
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-orange-500 hover:bg-orange-600'
              }`}
          >
            {loading ? '검색 중...' : '이 위치로 시작'}
          </button>
        </form>
      </div>
    </div>
  );
}

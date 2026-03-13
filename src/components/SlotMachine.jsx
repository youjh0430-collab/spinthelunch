/**
 * Role: 슬롯머신 풀스크린 모달
 * Key Features: 슬롯머신 릴 표시, 자동 스핀 시작, 결과 콜백
 * Dependencies: SlotReel, useSlotMachine
 */
import { useEffect } from 'react';
import { useSlotMachine } from '../hooks/useSlotMachine';
import SlotReel from './SlotReel';

export default function SlotMachine({ restaurants, lastResult, onComplete, onClose }) {
  const { state, winner, spin, stop } = useSlotMachine(restaurants, lastResult);

  // 모달 열릴 때 자동으로 스핀 시작
  useEffect(() => {
    spin();
  }, [spin]);

  // 스핀 정지 후 결과 전달
  useEffect(() => {
    if (state === 'stopped' && winner) {
      // 결과 카드로 전환하기 전 잠깐 멈춤 (당첨 강조)
      const timer = setTimeout(() => {
        onComplete(winner);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [state, winner, onComplete]);

  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex flex-col items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-6 w-full max-w-[400px] shadow-2xl">
        <h2 className="text-center text-xl font-bold text-gray-900 mb-6">
          오늘의 점심은?
        </h2>

        {/* 슬롯머신 프레임 */}
        <div className="border-4 border-orange-400 rounded-xl bg-orange-50 overflow-hidden">
          <SlotReel
            items={restaurants}
            finalItem={winner}
            isSpinning={state === 'spinning'}
            onStop={stop}
          />
        </div>

        {/* 스핀 중 안내 */}
        {state === 'spinning' && (
          <p className="text-center text-sm text-gray-500 mt-4 animate-pulse">
            두구두구두구...
          </p>
        )}

        {/* 결과 확정 */}
        {state === 'stopped' && winner && (
          <p
            className="text-center text-lg font-bold text-orange-600 mt-4"
            aria-live="polite"
          >
            {winner.place_name}!
          </p>
        )}

        {/* 닫기 버튼 */}
        <button
          onClick={onClose}
          className="mt-4 w-full py-2 text-sm text-gray-500 hover:text-gray-700"
          aria-label="닫기"
        >
          취소
        </button>
      </div>
    </div>
  );
}

/**
 * Role: 슬롯머신 풀스크린 모달 (글래스모피즘 시안 2)
 * Key Features: 슬롯머신 릴 표시, 자동 스핀 시작, 결과 콜백, 유리 질감 UI
 * Dependencies: SlotReelGlass, useSlotMachine
 */
import { useEffect } from 'react';
import { useSlotMachine } from '../hooks/useSlotMachine';
import SlotReelGlass from './SlotReelGlass';

export default function SlotMachineGlass({ restaurants, lastResult, onComplete, onClose }) {
  const { state, winner, spin, stop } = useSlotMachine(restaurants, lastResult);

  // 모달 열릴 때 자동으로 스핀 시작
  useEffect(() => {
    spin();
  }, [spin]);

  // 스핀 정지 후 결과 전달
  useEffect(() => {
    if (state === 'stopped' && winner) {
      // 결과 카드로 전환하기 전 충분히 멈춤 (결과를 볼 수 있도록 2초 대기)
      const timer = setTimeout(() => {
        onComplete(winner);
      }, 2000); 
      return () => clearTimeout(timer);
    }
  }, [state, winner, onComplete]);

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex flex-col items-center justify-center p-4">
        {/* 글래스모피즘 모달 패널 */}
        <div className="bg-white/20 backdrop-blur-xl border border-white/40 rounded-[32px] p-8 w-full max-w-[380px] shadow-[0_20px_40px_-15px_rgba(0,0,0,0.3)] relative overflow-hidden">
          {/* 패널 내부 은은한 빛 효과 */}
          <div className="absolute -top-[100px] -left-[100px] w-[200px] h-[200px] bg-orange-400/30 rounded-full blur-[60px] pointer-events-none"></div>
          <div className="absolute -bottom-[100px] -right-[100px] w-[200px] h-[200px] bg-pink-400/30 rounded-full blur-[60px] pointer-events-none"></div>

          <h2 className="text-center text-2xl font-black text-white drop-shadow-md mb-8 relative z-10 tracking-tight" style={{ fontFamily: "'EF_jejudoldam', sans-serif" }}>
            점심 메뉴 추천
          </h2>

          {/* 슬롯머신 릴 프레임 (유리 질감 내부) */}
          <div className="bg-white/40 backdrop-blur-md rounded-2xl overflow-hidden relative shadow-inner border border-white/50 mb-8 h-[160px]">
             {/* 상하단 그라데이션 가림막 (스무스한 깊이감) */}
             <div className="absolute top-0 inset-x-0 h-10 bg-gradient-to-b from-white/60 to-transparent z-10 pointer-events-none"></div>
             <div className="absolute bottom-0 inset-x-0 h-10 bg-gradient-to-t from-white/60 to-transparent z-10 pointer-events-none"></div>
             
             <SlotReelGlass
                items={restaurants}
                finalItem={winner}
                isSpinning={state === 'spinning'}
                onStop={stop}
              />
          </div>

          {/* 스핀 중 안내 */}
          <div className="min-h-[60px] flex items-center justify-center relative z-10">
            {state === 'spinning' && (
              <p className="text-center text-white/90 font-medium animate-pulse tracking-wide">
                맛있는 곳을 찾는 중...
              </p>
            )}

            {/* 결과 확정 */}
            {state === 'stopped' && winner && (
              <div className="text-center animate-[slide-up_0.5s_ease-out]">
                <p className="text-sm font-medium text-white/80 mb-1">오늘의 픽은 바로 이곳!</p>
                <p className="text-2xl font-black text-white drop-shadow-md" aria-live="polite">
                  {winner.place_name}
                </p>
              </div>
            )}
          </div>

          {/* 닫기 버튼 */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 bg-white/20 hover:bg-white/30 border border-white/30 rounded-full flex items-center justify-center text-white backdrop-blur-sm transition-all shadow-sm z-20"
            aria-label="닫기"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>
    </div>
  );
}

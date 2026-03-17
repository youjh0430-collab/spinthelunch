import { useEffect } from 'react';
import { useSlotMachine } from '../hooks/useSlotMachine';
import SlotReelReceipt from './SlotReelReceipt';

export default function SlotMachineReceipt({ restaurants, lastResult, onComplete, onClose }) {
  const { state, winner, spin, stop } = useSlotMachine(restaurants, lastResult);

  // 모달 열릴 때 자동으로 스핀 시작
  useEffect(() => {
    spin();
  }, [spin]);

  // 스핀 정지 후 결과 전달
  useEffect(() => {
    if (state === 'stopped' && winner) {
      // 결과 카드로 전환하기 전 충분히 멈춤 (영수증 결과를 볼 수 있도록 3초 대기)
      const timer = setTimeout(() => {
        onComplete(winner);
      }, 3000); 
      return () => clearTimeout(timer);
    }
  }, [state, winner, onComplete]);

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex flex-col items-center justify-center p-4">
      
      {/* POS 기기 상단 (영수증이 나오는 틈새) */}
      <div className="bg-gray-800 rounded-t-2xl w-full max-w-[320px] h-12 relative z-20 shadow-[0_4px_10px_rgba(0,0,0,0.5)] border-b-4 border-gray-900 flex items-center justify-center">
         <div className="bg-black w-[90%] h-2 rounded-full opacity-80 shadow-inner"></div>
         <p className="absolute -top-8 text-white/50 text-xs font-mono tracking-widest">LUNCH TICKET PRINTER</p>
      </div>

      {/* 영수증 본체 (모달) */}
      <div className="bg-[#fdfbf7] w-full max-w-[300px] shadow-2xl relative z-10 origin-top flex flex-col items-center pt-8 pb-4 border-x border-gray-300"
          style={{ 
             // 핑킹가위 라인 (영수증 뜯어진 자국) 효과 
             maskImage: 'radial-gradient(circle at 10px calc(100% - 10px), transparent 10px, black 11px)',
             maskSize: '100% 100%',
             clipPath: 'polygon(0% 0%, 100% 0%, 100% calc(100% - 10px), 95% 100%, 90% calc(100% - 10px), 85% 100%, 80% calc(100% - 10px), 75% 100%, 70% calc(100% - 10px), 65% 100%, 60% calc(100% - 10px), 55% 100%, 50% calc(100% - 10px), 45% 100%, 40% calc(100% - 10px), 35% 100%, 30% calc(100% - 10px), 25% 100%, 20% calc(100% - 10px), 15% 100%, 10% calc(100% - 10px), 5% 100%, 0% calc(100% - 10px))'
          }}>
        
        {/* 영수증 헤더 텍스트 */}
        <div className="text-center font-mono w-full px-6 mb-4 border-b-2 border-dashed border-gray-300 pb-4">
          <h2 className="text-xl font-bold text-gray-800 tracking-wider">
            ORDER: LUNCH
          </h2>
          <p className="text-xs text-gray-500 mt-1">DATE: {new Date().toLocaleDateString()}</p>
        </div>

        {/* 슬롯머신 릴 프레임 (영수증 항목 롤) */}
        <div className="w-full relative h-[140px] overflow-hidden mb-4">
          {/* 부드러운 그라데이션 대신 선명한 페이드 */}
          <div className="absolute top-0 inset-x-0 h-8 bg-gradient-to-b from-[#fdfbf7] to-transparent z-10 pointer-events-none"></div>
          
          <SlotReelReceipt
            items={restaurants}
            finalItem={winner}
            isSpinning={state === 'spinning'}
            onStop={stop}
          />
        </div>

        {/* 바코드 및 스핀 안내 */}
        <div className="text-center font-mono w-full px-6 pt-4 border-t-2 border-dashed border-gray-300 mt-2">
          {state === 'spinning' && (
            <p className="text-sm text-gray-600 animate-pulse font-bold">
              &gt; PRINTING...
            </p>
          )}

          {/* 결과 확정 시 바코드와 상태 메시지 */}
          {state === 'stopped' && winner && (
            <div className="animate-[slide-up_0.3s_ease-out]">
              <p className="text-xl text-gray-800 font-bold mb-3 tracking-widest break-all">|||||||||||||||||</p>
              <p className="text-sm font-bold text-gray-800">
                TOTAL: 1 MEAL
              </p>
            </div>
          )}
        </div>

        {/* 닫기 버튼 (영수증 캔슬) */}
        <button
          onClick={onClose}
          className="mt-6 font-mono text-xs text-red-500 hover:text-red-700 underline underline-offset-4 mb-4"
          aria-label="닫기"
        >
          [ CANCEL ORDER ]
        </button>
      </div>
    </div>
  );
}

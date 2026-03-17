/**
 * Role: 슬롯머신 풀스크린 모달
 * Key Features: 슬롯머신 릴 표시, 자동 스핀 시작, 결과 콜백
 * Dependencies: SlotReel, useSlotMachine
 */
import { useEffect, useState } from 'react';
import { useSlotMachine } from '../hooks/useSlotMachine';
import SlotReel from './SlotReel';

export default function SlotMachine({ restaurants, lastResult, onComplete, onClose }) {
  const { state, winner, spin, stop } = useSlotMachine(restaurants, lastResult);
  const [isLeverPulled, setIsLeverPulled] = useState(false);

  // 모달 열릴 때 자동으로 스핀 시작 (레버 당기는 애니메이션과 함께)
  useEffect(() => {
    // 레버 당김 상태로 변경 후 스핀
    const timer = setTimeout(() => {
      setIsLeverPulled(true);
      setTimeout(() => {
        setIsLeverPulled(false);
        spin();
      }, 300); // 레버가 원래 위치로 돌아가는 시간
    }, 500); // 모달 열리고 0.5초 뒤 자동 시작

    return () => clearTimeout(timer);
  }, [spin]);

  // 스핀 정지 후 결과 전달
  useEffect(() => {
    if (state === 'stopped' && winner) {
      const timer = setTimeout(() => {
        onComplete(winner);
      }, 1000); // 결과 확인을 위해 좀 더 길게 대기
      return () => clearTimeout(timer);
    }
  }, [state, winner, onComplete]);

  return (
    <div className="fixed inset-0 z-50 bg-black/75 flex flex-col items-center justify-center p-4 font-sans backdrop-blur-sm">
      <div className="relative w-full max-w-[380px] mt-8">
        
        {/* 타이틀 */}
        <h2 className="text-center text-[32px] font-black text-[#ffcc22] mb-8 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] tracking-tight" style={{ fontFamily: 'GmarketSans, sans-serif' }}>
          오늘 뭐먹지?
        </h2>

        <div className="relative z-10 w-full mb-8">
          {/* 레버 (오른쪽 부착) */}
          <div className="absolute -right-8 top-16 w-8 h-32 flex flex-col items-center z-0 sm:-right-10">
            {/* 레버 베이스 (슬롯머신 본체에 붙는 부분) */}
            <div className="w-5 h-16 bg-[#b32d00] rounded-r-md border-y-2 border-r-2 border-[#802000] absolute top-0 -left-1"></div>
            {/* 레버 막대 */}
            <div 
              className="w-3.5 h-24 bg-gradient-to-r from-gray-400 via-gray-200 to-gray-500 rounded-full origin-bottom absolute top-4 transition-transform duration-300 ease-in-out shadow-inner"
              style={{ transform: isLeverPulled ? 'rotateX(180deg) translateY(-20px)' : 'rotateX(0deg)' }}
            >
              {/* 레버 손잡이 (빨간 공) */}
              <div className="w-9 h-9 bg-gradient-to-br from-red-500 to-red-700 rounded-full absolute -top-5 -left-2.5 shadow-[0_4px_6px_rgba(0,0,0,0.5)] border-2 border-red-800"></div>
            </div>
          </div>

          {/* 슬롯머신 본체 (빨간/오렌지색 계열) */}
          <div className="bg-[#ff4500] rounded-[2rem] p-4 sm:p-5 shadow-[0_20px_25px_-5px_rgba(0,0,0,0.5),auto,0_10px_10px_-5px_rgba(0,0,0,0.5)] relative border-b-[12px] border-[#cc3700] z-10 mx-auto">
            
            {/* 내부 하얀색/아이보리색 화면 프레임 */}
            <div className="bg-[#fffaf0] rounded-xl p-4 sm:p-5 relative border-[5px] border-[#ff7a33] shadow-[inset_0_4px_10px_rgba(0,0,0,0.1)] flex flex-col items-center">
              
              {/* 전구 장식물 (도트 보더를 통한 카지노 라이트) */}
              <div className="absolute inset-1.5 border-[6px] border-dotted border-[#ffcc22] rounded-[10px] opacity-100 animate-casino-lights pointer-events-none"></div>

              {/* LUCKY 라벨 */}
              <div className="bg-[#ff4500] text-white px-8 py-1.5 rounded-full text-xl font-black tracking-widest mb-5 z-10 shadow-md border-2 border-[#cc3700] mt-1" style={{ fontFamily: 'GmarketSans, sans-serif' }}>
                LUCKY
              </div>

              {/* 슬롯 릴 영역 */}
              <div className="bg-white border-4 border-gray-300 rounded-lg w-full overflow-hidden shadow-[inset_0_4px_15px_rgba(0,0,0,0.15)] flex justify-center z-10 relative">
                
                {/* 릴 세로 구분선 장식 */}
                <div className="absolute top-0 bottom-0 left-1/4 border-l-2 border-gray-200 z-10"></div>
                <div className="absolute top-0 bottom-0 left-2/4 border-l-2 border-gray-200 z-10"></div>
                <div className="absolute top-0 bottom-0 left-3/4 border-l-2 border-gray-200 z-10"></div>
                
                <div className="w-full h-full flex justify-center bg-white relative">
                  <SlotReel
                    items={restaurants}
                    finalItem={winner}
                    isSpinning={state === 'spinning'}
                    onStop={stop}
                  />
                </div>
              </div>

              {/* 하단 이모티콘 & 장식 */}
              <div className="flex gap-3 mt-5 z-10 pb-1">
                <div className="w-9 h-9 flex items-center justify-center text-xl bg-red-600 rounded-full shadow-[inset_0_-2px_4px_rgba(0,0,0,0.4)] border border-red-800">😋</div>
                <div className="w-9 h-9 flex items-center justify-center text-xl bg-[#fff0e6] rounded-full shadow-[inset_0_-2px_4px_rgba(0,0,0,0.2)] border border-[#ffcca8]">🥰</div>
                <div className="w-9 h-9 flex items-center justify-center text-xl bg-[#ffe680] rounded-full shadow-[inset_0_-2px_4px_rgba(0,0,0,0.2)] border border-[#e6b800]">🥳</div>
              </div>

            </div>
            
            {/* 하단 레터링 */}
            <div className="text-center mt-6 mb-3">
              <p className="text-white text-xl sm:text-2xl font-black tracking-[0.2em] drop-shadow-[0_2px_2px_rgba(0,0,0,0.5)]" style={{ fontFamily: 'GmarketSans, sans-serif' }}>
                돌려돌려밥!
              </p>
            </div>
          </div>
        </div>

        {/* 닫기 버튼 */}
        <button
          onClick={onClose}
          className="w-full py-4 bg-white/10 hover:bg-white/20 text-white/80 hover:text-white rounded-2xl font-bold transition-all backdrop-blur-md border border-white/20"
          aria-label="닫기"
        >
          그만 돌리기 (취소)
        </button>
      </div>
    </div>
  );
}

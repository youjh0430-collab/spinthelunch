import { useEffect, useState } from 'react';
import { useSlotMachine } from '../hooks/useSlotMachine';
import SlotReel3D from './SlotReel3D';

// 컴포넌트 이름은 그대로 유지하되 내부는 심플한 2D 플랫 디자인으로 변경
export default function SlotMachine3D({ restaurants, lastResult, onComplete, onClose }) {
  const { state, winner, spin, stop } = useSlotMachine(restaurants, lastResult);
  const [isLeverPulled, setIsLeverPulled] = useState(false);

  // 모달 열릴 때 자동으로 스핀 시작 (레버 연출 포함)
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLeverPulled(true);
      setTimeout(() => {
        setIsLeverPulled(false);
        spin();
      }, 300);
    }, 500);
    return () => clearTimeout(timer);
  }, [spin]);

  // 스핀 정지 후 결과 전달
  useEffect(() => {
    if (state === 'stopped' && winner) {
      const timer = setTimeout(() => {
        onComplete(winner);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [state, winner, onComplete]);

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex flex-col items-center justify-center p-4 font-sans backdrop-blur-sm">
      
      {/* 바깥 전체 컨테이너 */}
      <div className="relative w-full max-w-[400px] mt-4 sm:mt-8 flex flex-col items-center">
        
        {/* 상단 텍스트 */}
        <h2 className="text-center text-[24px] sm:text-[32px] font-black text-white mb-4 sm:mb-8 tracking-wide drop-shadow-md">
          오늘 뭐 먹지?
        </h2>

        {/* 심플 슬롯 본체 래퍼 */}
        <div className="relative z-10 w-full flex items-center justify-center mb-6 sm:mb-10 pl-2 pr-8">
          
          {/* 레버 (오른쪽 부착) */}
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-8 sm:w-10 h-24 sm:h-32 z-20" style={{ perspective: '800px' }}>
            {/* 레버 베이스 박스 (오렌지톤 회색) */}
            <div className="absolute top-1/2 -translate-y-1/2 left-0 w-6 sm:w-8 h-12 sm:h-16 bg-orange-200 rounded-r-lg shadow-md z-20"></div>

            {/* 움직이는 막대 (회전 축 지정) */}
            <div
              className="absolute left-[8px] sm:left-[12px] w-3 sm:w-3.5 h-16 sm:h-20 origin-bottom transition-all duration-300 ease-in-out z-10"
              style={{
                top: '-16px',
                transform: isLeverPulled ? 'rotateX(170deg)' : 'rotateX(0deg)'
              }}
            >
              <div className="w-full h-full bg-orange-800 rounded-t-full"></div>

              {/* 레버 빨간손잡이 (납작한 원) */}
              <div className="absolute -top-3 sm:-top-4 -left-[10px] sm:-left-[13px] w-8 sm:w-10 h-8 sm:h-10 bg-red-500 rounded-full shadow-[0_4px_8px_rgba(0,0,0,0.6)] border-2 sm:border-[3px] border-red-700"></div>
            </div>
          </div>

          {/* 심플 플랫 본체 (브랜드 컬러 오렌지 테두리) */}
          <div className="w-full bg-orange-500 rounded-[20px] sm:rounded-[30px] p-3 sm:p-5 shadow-xl relative z-10 border-4 sm:border-[6px] border-orange-700">
            
            {/* 내부 코랄/연주황 배경 (3칸이 들어가는 액자) */}
            <div className="bg-orange-100 p-2 sm:p-4 rounded-xl sm:rounded-[16px] shadow-[inset_0_4px_10px_rgba(0,0,0,0.1)]">
              
              {/* 슬롯 윈도우 (크고 길게 하나로 통합 - 흰색 배경) */}
              <div className="bg-white rounded-lg h-[80px] sm:h-[120px] w-full overflow-hidden shadow-[inset_0_2px_8px_rgba(0,0,0,0.1)] border-2 border-orange-200 relative flex justify-center">
                
                {/* 양옆 희미한 분리선 장식 (디자인 요소) */}
                <div className="absolute top-0 bottom-0 left-1/4 border-l-2 border-dashed border-[#d0d0d0] z-0"></div>
                <div className="absolute top-0 bottom-0 right-1/4 border-l-2 border-dashed border-[#d0d0d0] z-0"></div>

                <div className="w-full h-full flex justify-center items-center relative z-10">
                  <SlotReel3D
                    items={restaurants}
                    finalItem={winner}
                    isSpinning={state === 'spinning'}
                    onStop={stop}
                  />
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* 닫기 버튼 */}
        <button
          onClick={onClose}
          className="w-[80%] mt-2 py-3 sm:py-4 bg-white/10 hover:bg-white/20 text-white/90 hover:text-white rounded-full font-bold transition-all border border-white/20 tracking-wider shadow-md text-sm sm:text-base"
        >
          돌리기 취소
        </button>
      </div>
    </div>
  );
}

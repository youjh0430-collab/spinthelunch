/**
 * Role: 마우스/터치 위치를 ref로 추적하는 훅
 * Key Features: 컨테이너 기준 상대 좌표, 마우스 + 터치 지원
 * Notes: parallax-floating 효과를 위해 리렌더링 없이 ref로 위치 관리
 */
import { useEffect, useRef } from 'react';

export function useMousePositionRef(containerRef) {
  const positionRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const updatePosition = (x, y) => {
      if (containerRef?.current) {
        const rect = containerRef.current.getBoundingClientRect();
        positionRef.current = {
          x: x - rect.left,
          y: y - rect.top,
        };
      } else {
        positionRef.current = { x, y };
      }
    };

    const handleMouseMove = (e) => updatePosition(e.clientX, e.clientY);
    const handleTouchMove = (e) => {
      const touch = e.touches[0];
      updatePosition(touch.clientX, touch.clientY);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, [containerRef]);

  return positionRef;
}

/**
 * Role: 마우스/터치 기반 패럴랙스 플로팅 효과 컴포넌트
 * Key Features: depth별 차등 이동, GPU 가속 transform, 이징 애니메이션
 * Dependencies: motion/react, useMousePositionRef
 * Notes: fancycomponents.dev/parallax-floating 기반, JSX로 변환
 */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
} from 'react';
import { useAnimationFrame } from 'motion/react';
import { useMousePositionRef } from '../hooks/useMousePositionRef';

const FloatingContext = createContext(null);

export default function Floating({
  children,
  className = '',
  sensitivity = 1,
  easingFactor = 0.05,
}) {
  const containerRef = useRef(null);
  const elementsMap = useRef(new Map());
  const mousePositionRef = useMousePositionRef(containerRef);

  const registerElement = useCallback((id, element, depth) => {
    elementsMap.current.set(id, {
      element,
      depth,
      currentPosition: { x: 0, y: 0 },
    });
  }, []);

  const unregisterElement = useCallback((id) => {
    elementsMap.current.delete(id);
  }, []);

  useAnimationFrame(() => {
    if (!containerRef.current) return;

    elementsMap.current.forEach((data) => {
      const strength = (data.depth * sensitivity) / 20;
      const newTargetX = mousePositionRef.current.x * strength;
      const newTargetY = mousePositionRef.current.y * strength;
      const dx = newTargetX - data.currentPosition.x;
      const dy = newTargetY - data.currentPosition.y;

      data.currentPosition.x += dx * easingFactor;
      data.currentPosition.y += dy * easingFactor;

      data.element.style.transform = `translate3d(${data.currentPosition.x}px, ${data.currentPosition.y}px, 0)`;
    });
  });

  return (
    <FloatingContext.Provider value={{ registerElement, unregisterElement }}>
      <div
        ref={containerRef}
        className={`absolute top-0 left-0 w-full h-full ${className}`}
      >
        {children}
      </div>
    </FloatingContext.Provider>
  );
}

export function FloatingElement({ children, className = '', depth = 1 }) {
  const elementRef = useRef(null);
  const idRef = useRef(Math.random().toString(36).substring(7));
  const context = useContext(FloatingContext);

  useEffect(() => {
    if (!elementRef.current || !context) return;

    const d = depth ?? 0.01;
    context.registerElement(idRef.current, elementRef.current, d);
    return () => context.unregisterElement(idRef.current);
  }, [depth, context]);

  return (
    <div
      ref={elementRef}
      className={`absolute will-change-transform ${className}`}
    >
      {children}
    </div>
  );
}

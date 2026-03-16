/**
 * Role: 반짝이는 쉬머 효과가 있는 CTA 버튼
 * Key Features: conic-gradient 회전 쉬머, hover/active 인터랙션
 * Notes: fancycomponents.dev ShimmerButton 기반, JSX 변환
 */
import { forwardRef } from 'react';

const ShimmerButton = forwardRef(
  (
    {
      shimmerColor = '#ffffff',
      shimmerSize = '0.05em',
      shimmerDuration = '3s',
      borderRadius = '100px',
      background = 'rgba(249, 115, 22, 1)',
      className = '',
      children,
      ...props
    },
    ref,
  ) => {
    return (
      <button
        style={{
          '--spread': '90deg',
          '--shimmer-color': shimmerColor,
          '--radius': borderRadius,
          '--speed': shimmerDuration,
          '--cut': shimmerSize,
          '--bg': background,
          fontFamily: "'GmarketSans', sans-serif",
          fontWeight: 700,
        }}
        className={`group relative z-0 flex cursor-pointer items-center justify-center overflow-hidden whitespace-nowrap border border-white/10 px-16 py-6 text-3xl font-bold text-white [background:var(--bg)] [border-radius:var(--radius)] transform-gpu transition-transform duration-300 ease-in-out active:translate-y-px ${className}`}
        ref={ref}
        {...props}
      >
        {/* 쉬머 컨테이너 */}
        <div className="absolute inset-0 overflow-visible [container-type:size] -z-30 blur-[2px]">
          <div className="absolute inset-0 h-[100cqh] [aspect-ratio:1] [border-radius:0] [mask:none] animate-shimmer-slide">
            <div className="absolute -inset-full w-auto rotate-0 [background:conic-gradient(from_calc(270deg-(var(--spread)*0.5)),transparent_0,var(--shimmer-color)_var(--spread),transparent_var(--spread))] [translate:0_0] animate-spin-around" />
          </div>
        </div>

        {children}

        {/* 하이라이트 */}
        <div className="absolute inset-0 size-full rounded-2xl px-4 py-1.5 text-sm font-medium shadow-[inset_0_-8px_10px_#ffffff1f] transform-gpu transition-all duration-300 ease-in-out group-hover:shadow-[inset_0_-6px_10px_#ffffff3f] group-active:shadow-[inset_0_-10px_10px_#ffffff3f]" />

        {/* 배경 */}
        <div className="absolute -z-20 [background:var(--bg)] [border-radius:var(--radius)] [inset:var(--cut)]" />
      </button>
    );
  },
);

ShimmerButton.displayName = 'ShimmerButton';

export default ShimmerButton;

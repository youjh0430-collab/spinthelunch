/**
 * Role: 하단 고정 "돌려돌려밥!" 버튼
 * Key Features: 로딩 상태, 비활성화, 시머 효과, 글로우 그림자
 */
export default function SpinButton({ onSpin, disabled, loading }) {
  return (
    <div className="absolute bottom-8 left-0 right-0 flex flex-col items-center gap-3 z-10">
      {/* 소제목 */}
      <p className="text-sm text-gray-400 font-medium tracking-widest">
        오늘 뭐먹지?
      </p>

      {/* 메인 버튼 */}
      <button
        onClick={onSpin}
        disabled={disabled}
        style={disabled ? {} : {
          boxShadow: '0 0 40px 10px rgba(249,115,22,0.45), 0 8px 32px rgba(249,115,22,0.3)',
        }}
        className={`relative overflow-hidden px-20 py-8 rounded-full text-5xl font-extrabold transition-all min-w-[600px] min-h-[160px] active:scale-95
          ${disabled
            ? 'bg-gray-300 text-gray-400 cursor-not-allowed shadow-none'
            : 'bg-orange-500 text-white hover:bg-orange-600'
          }`}
        aria-label="룰렛 돌리기"
      >
        {/* 시머 효과 */}
        {!disabled && (
          <span
            className="pointer-events-none absolute inset-0 rounded-full"
            style={{
              background: 'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.25) 50%, transparent 60%)',
              backgroundSize: '200% 100%',
              animation: 'shimmer 2.2s infinite',
            }}
          />
        )}

        {loading ? (
          <span className="flex items-center justify-center gap-3">
            <span className="animate-spin inline-block w-8 h-8 border-[3px] border-white border-t-transparent rounded-full" />
            <span>검색 중...</span>
          </span>
        ) : (
          <span className="relative z-10">돌려돌려밥! 🍚</span>
        )}
      </button>
    </div>
  );
}

/**
 * Role: 에러/안내 메시지 공통 컴포넌트
 * Key Features: 메시지 표시, 액션 버튼, 닫기
 */
export default function ErrorMessage({ message, onClose, action, onAction }) {
  return (
    <div className="absolute top-28 left-4 right-4 z-20 max-w-[400px] mx-auto">
      <div className="bg-white rounded-xl shadow-lg p-4 border border-red-100">
        <div className="flex items-start gap-3">
          <span className="text-red-500 text-xl shrink-0">!</span>
          <div className="flex-1">
            <p className="text-sm text-gray-700">{message}</p>
            {action && onAction && (
              <button
                onClick={onAction}
                className="mt-2 text-sm text-orange-500 font-medium hover:underline"
              >
                {action}
              </button>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-lg leading-none"
            aria-label="닫기"
          >
            ×
          </button>
        </div>
      </div>
    </div>
  );
}

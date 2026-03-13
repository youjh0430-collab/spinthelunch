/**
 * Role: 슬롯머신 상태 관리 및 당첨 로직 훅
 * Key Features: 랜덤 선택, 직전 결과 제외, 상태 머신 (idle → spinning → stopped)
 */
import { useState, useCallback } from 'react';

export function useSlotMachine(restaurants, lastResult) {
  const [state, setState] = useState('idle'); // 'idle' | 'spinning' | 'stopped'
  const [winner, setWinner] = useState(null);

  const spin = useCallback(() => {
    if (restaurants.length === 0) return;

    // 직전 결과 제외 (후보가 2개 이상일 때만)
    const candidates = lastResult && restaurants.length > 1
      ? restaurants.filter(r => r.id !== lastResult.id)
      : restaurants;

    // 랜덤 선택
    const winnerIndex = Math.floor(Math.random() * candidates.length);
    const selected = candidates[winnerIndex];

    setWinner(selected);
    setState('spinning');
  }, [restaurants, lastResult]);

  const stop = useCallback(() => {
    setState('stopped');
  }, []);

  const reset = useCallback(() => {
    setState('idle');
    setWinner(null);
  }, []);

  return { state, winner, spin, stop, reset };
}

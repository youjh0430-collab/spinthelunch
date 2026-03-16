/**
 * Role: Vite 빌드 설정
 * Key Features: React 플러그인, Tailwind CSS v4 플러그인, 카카오 API 프록시
 * Dependencies: @vitejs/plugin-react, @tailwindcss/vite
 */
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  base: '/spinthelunch/',
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      // 카카오 API 프록시 — 브라우저 CORS/ORB 우회
      '/kakao-api': {
        target: 'https://dapi.kakao.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/kakao-api/, ''),
      },
    },
  },
});

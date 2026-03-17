/**
 * Role: Vite 빌드 설정
 * Key Features: React 플러그인, Tailwind CSS v4 플러그인, 카카오 API 프록시, 네이버 검색 로컬 프록시
 * Dependencies: @vitejs/plugin-react, @tailwindcss/vite
 */
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

/** 로컬 개발용 네이버 검색 API 프록시 — Vercel Serverless Function을 Vite에서 대체 */
function naverSearchDevPlugin() {
  let env;

  return {
    name: 'naver-search-dev-proxy',
    configResolved(config) {
      // VITE_ 접두사 없는 환경변수도 로드 (NAVER_CLIENT_ID 등)
      env = loadEnv(config.mode, config.root, '');
    },
    configureServer(server) {
      server.middlewares.use('/api/naver-search', async (req, res) => {
        const url = new URL(req.url, 'http://localhost');
        const query = url.searchParams.get('query');
        const blogQuery = url.searchParams.get('blogQuery');
        const imageQuery = url.searchParams.get('imageQuery');

        // blogQuery/imageQuery 분리 방식 또는 기존 query 단일 방식 모두 지원
        const finalBlogQuery = blogQuery || query;
        const finalImageQuery = imageQuery || query;

        if (!finalBlogQuery && !finalImageQuery) {
          res.statusCode = 400;
          res.end(JSON.stringify({ error: '검색어가 필요합니다.' }));
          return;
        }

        if (!env.NAVER_CLIENT_ID || !env.NAVER_CLIENT_SECRET) {
          res.statusCode = 500;
          res.end(JSON.stringify({ error: '네이버 API 키가 .env.local에 설정되지 않았습니다.' }));
          return;
        }

        const headers = {
          'X-Naver-Client-Id': env.NAVER_CLIENT_ID,
          'X-Naver-Client-Secret': env.NAVER_CLIENT_SECRET,
        };

        try {
          const [blogRes, imageRes] = await Promise.all([
            fetch(
              `https://openapi.naver.com/v1/search/blog.json?query=${encodeURIComponent(finalBlogQuery)}&display=2&sort=sim`,
              { headers },
            ),
            fetch(
              `https://openapi.naver.com/v1/search/image.json?query=${encodeURIComponent(finalImageQuery)}&display=3&sort=sim`,
              { headers },
            ),
          ]);

          const [blogData, imageData] = await Promise.all([
            blogRes.json(),
            imageRes.json(),
          ]);

          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({
            blogs: blogData.items || [],
            images: imageData.items || [],
          }));
        } catch {
          res.statusCode = 500;
          res.end(JSON.stringify({ error: '네이버 검색 API 호출에 실패했습니다.' }));
        }
      });
    },
  };
}

export default defineConfig({
  base: '/',
  plugins: [react(), tailwindcss(), naverSearchDevPlugin()],
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

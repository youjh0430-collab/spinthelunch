/**
 * Role: 네이버 검색 API 프록시 — 브라우저 CORS 우회용 Vercel Serverless Function
 * Key Features: 블로그 검색 + 이미지 검색을 병렬 호출 후 통합 응답
 * Dependencies: 네이버 오픈 API (X-Naver-Client-Id, X-Naver-Client-Secret)
 */

export default async function handler(req, res) {
  // CORS 헤더 설정
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');

  const { query } = req.query;

  if (!query) {
    return res.status(400).json({ error: '검색어(query)가 필요합니다.' });
  }

  const headers = {
    'X-Naver-Client-Id': process.env.NAVER_CLIENT_ID,
    'X-Naver-Client-Secret': process.env.NAVER_CLIENT_SECRET,
  };

  try {
    // 블로그 검색 + 이미지 검색 병렬 호출
    const [blogRes, imageRes] = await Promise.all([
      fetch(
        `https://openapi.naver.com/v1/search/blog.json?query=${encodeURIComponent(query)}&display=2&sort=sim`,
        { headers }
      ),
      fetch(
        `https://openapi.naver.com/v1/search/image.json?query=${encodeURIComponent(query)}&display=3&sort=sim`,
        { headers }
      ),
    ]);

    const [blogData, imageData] = await Promise.all([
      blogRes.json(),
      imageRes.json(),
    ]);

    return res.status(200).json({
      blogs: blogData.items || [],
      images: imageData.items || [],
    });
  } catch {
    return res.status(500).json({ error: '네이버 검색 API 호출에 실패했습니다.' });
  }
}

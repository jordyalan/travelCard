// Vercel Serverless Function handler for /api/parse-itinerary
export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { text } = req.body || {};
  if (!text) {
    return res.status(400).json({ error: 'Missing itinerary text' });
  }

  const apiKey = process.env.GEMINI_API_KEY;

  if (apiKey) {
    try {
      const { GoogleGenAI, Type } = await import('@google/genai');
      const ai = new GoogleGenAI({ apiKey });

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `請解析以下這段旅遊行程筆記或文字，轉成結構化站點清單：\n\n${text}`,
        config: {
          systemInstruction: '你是一位精通台灣旅遊地理的導遊助手。請以繁體中文 (zh-TW) 解析並標定合理的經緯度座標。',
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              itineraryTitle: { type: Type.STRING },
              destinationCity: { type: Type.STRING },
              items: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    title: { type: Type.STRING },
                    location: { type: Type.STRING },
                    lat: { type: Type.NUMBER },
                    lng: { type: Type.NUMBER },
                    time: { type: Type.STRING },
                    category: { type: Type.STRING, enum: ['culture', 'food', 'scenic', 'shopping', 'nature', 'entertainment', 'other'] },
                    notes: { type: Type.STRING },
                  },
                  required: ['title', 'location', 'lat', 'lng', 'category'],
                },
              },
            },
            required: ['itineraryTitle', 'destinationCity', 'items'],
          },
        },
      });

      if (response.text) {
        return res.status(200).json(JSON.parse(response.text));
      }
    } catch (e) {
      console.warn('Vercel Gemini parse error, using fallback', e);
    }
  }

  // Fallback
  const lines = text
    .split(/[\n,，;；。→\->]/)
    .map((s: string) => s.trim())
    .filter((s: string) => s.length > 1);

  const items = lines.slice(0, 10).map((line: string, idx: number) => {
    let time = `${String(8 + idx * 2).padStart(2, '0')}:00`;
    const cleanTitle = line.replace(/早上|中午|下午|傍晚|晚上|\d{1,2}[:點]\d{0,2}[分度]?|集合|出發|去|到|參觀|吃/g, '').trim();

    return {
      title: cleanTitle || `行程第 ${idx + 1} 站`,
      location: cleanTitle || '在地特色景點',
      lat: 24.6366 + (idx % 3) * 0.05,
      lng: 121.8048 + (idx % 3) * 0.04,
      time,
      category: cleanTitle.includes('吃') || cleanTitle.includes('餐') ? 'food' : 'scenic',
      notes: line,
    };
  });

  return res.status(200).json({
    itineraryTitle: '自訂匯入行程',
    destinationCity: '精選旅遊景點',
    items: items.length > 0 ? items : [
      {
        title: '宜蘭三奇美徑黃金稻浪',
        location: '宜蘭縣冬山鄉三奇村',
        lat: 24.6366,
        lng: 121.8048,
        time: '09:00',
        category: 'scenic',
        notes: '漫步金黃稻浪，無電線桿純淨美景',
      },
    ],
  });
}

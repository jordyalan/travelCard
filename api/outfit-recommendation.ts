// Vercel Serverless Function handler for /api/outfit-recommendation
export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { weather, currentSpot } = req.body || {};
  const temp = weather?.temp ?? 24;
  const rain = weather?.rainProb ?? 15;
  const uv = weather?.uv ?? 4;

  const apiKey = process.env.GEMINI_API_KEY;

  if (apiKey) {
    try {
      const { GoogleGenAI, Type } = await import('@google/genai');
      const ai = new GoogleGenAI({ apiKey });

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `目前氣候資訊：氣溫 ${temp}°C, 體感 ${weather?.apparentTemp ?? temp}°C, 降雨機率 ${rain}%, 紫外線指數 UV ${uv}。請為正在「${currentSpot || '台灣景點'}」的旅客提供繁體中文即時穿搭與實用出行建議。`,
        config: {
          systemInstruction: '你是一位專業的個人旅行穿搭顧問。請以繁體中文 (zh-TW) 提供具體實用、兼顧美觀與舒適度的穿搭建議。',
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              headline: { type: Type.STRING },
              summary: { type: Type.STRING },
              tags: { type: Type.ARRAY, items: { type: Type.STRING } },
              outfit: {
                type: Type.OBJECT,
                properties: {
                  top: { type: Type.STRING },
                  bottom: { type: Type.STRING },
                  outerwear: { type: Type.STRING },
                  shoes: { type: Type.STRING },
                  accessories: { type: Type.ARRAY, items: { type: Type.STRING } },
                },
                required: ['top', 'bottom', 'outerwear', 'shoes', 'accessories'],
              },
              practicalTips: { type: Type.ARRAY, items: { type: Type.STRING } },
            },
            required: ['headline', 'summary', 'tags', 'outfit', 'practicalTips'],
          },
        },
      });

      if (response.text) {
        return res.status(200).json(JSON.parse(response.text));
      }
    } catch (e) {
      console.warn('Vercel Gemini outfit generation error, using fallback', e);
    }
  }

  // Fallback
  return res.status(200).json({
    headline: temp >= 28 ? '炎熱晴朗高溫：透氣涼感防曬' : temp <= 18 ? '涼意微寒：防風保暖洋蔥式穿法' : '舒適微風：輕薄透氣隨性自在',
    summary: `目前氣溫約 ${temp}°C，體感舒適宜人。建議著輕便休閒服裝，隨身攜帶薄外套以因應冷氣房與戶外溫差。`,
    tags: ['舒適透氣', '休閒好走', '防風薄外套'],
    outfit: {
      top: '吸濕排汗舒適棉質短袖T恤',
      bottom: '休閒運動短褲或九分休閒長褲',
      outerwear: '抗UV防風輕薄外套',
      shoes: '舒適避震慢跑鞋或防滑休閒鞋',
      accessories: ['抗UV太陽眼鏡', '遮陽帽', '晴雨兩用折傘'],
    },
    practicalTips: [
      '戶外活動行走時間較長，請適時補充水分。',
      '進入車內或冷氣空間時穿上薄外套以防著涼。',
    ],
  });
}

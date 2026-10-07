import type { Request, Response } from 'express';

// Vercel Serverless Function handler for /api/attraction-info
export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, location } = req.body || {};
  if (!name) {
    return res.status(400).json({ error: 'Missing attraction name' });
  }

  const apiKey = process.env.GEMINI_API_KEY;

  if (apiKey) {
    try {
      const { GoogleGenAI, Type } = await import('@google/genai');
      const ai = new GoogleGenAI({ apiKey });

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `請針對旅遊景點「${name}」(可能地址或位置：${location || '台灣'})，提供專業深度的繁體中文旅遊導覽手冊資訊。`,
        config: {
          systemInstruction: '你是一位精通台灣旅遊的專業導遊兼文化歷史顧問。請以繁體中文 (zh-TW) 輸出真實、精確且生動的景點導覽內容。',
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              summary: { type: Type.STRING },
              highlights: { type: Type.ARRAY, items: { type: Type.STRING } },
              openingHours: { type: Type.STRING },
              ticketInfo: { type: Type.STRING },
              estimatedDuration: { type: Type.STRING },
              photoSpots: { type: Type.ARRAY, items: { type: Type.STRING } },
              nearbyFood: { type: Type.ARRAY, items: { type: Type.STRING } },
              tips: { type: Type.ARRAY, items: { type: Type.STRING } },
              audioGuide: { type: Type.STRING },
            },
            required: ['name', 'summary', 'highlights', 'openingHours', 'ticketInfo', 'estimatedDuration', 'photoSpots', 'nearbyFood', 'tips', 'audioGuide'],
          },
        },
      });

      if (response.text) {
        return res.status(200).json(JSON.parse(response.text));
      }
    } catch (e) {
      console.warn('Vercel Gemini generation error, using fallback', e);
    }
  }

  // Fallback
  return res.status(200).json({
    name,
    summary: `${name}是極具代表性的熱門人氣造訪景點，擁有迷人的大自然景觀與豐富的人文底蘊，非常適合細細品味慢活漫遊。`,
    highlights: [
      `必看地標性景觀，感受${name}的獨特魅力`,
      '視野開闊悠閒，非常適合散步與拍照留念',
      '四季風貌各具特色，享受放鬆身心的旅行時光',
    ],
    openingHours: '建議參訪時間 09:00 - 18:00 (以現場公告為準)',
    ticketInfo: '免費開放或視現場設施規範為準',
    estimatedDuration: '約 1 - 1.5 小時',
    photoSpots: [`${name}正門或主要地標前`, '開闊視野全景透視視角', '順光自然採光特寫'],
    nearbyFood: ['在地經典老字號小吃', '人氣手作飲品與點心', '特色在地風味料理'],
    tips: ['建議穿著舒適好走的休閒鞋', '戶外請做好防曬遮陽與補充水分', '請遵守現場環境禮儀'],
    audioGuide: `您好，歡迎來到${name}。這裡是許多旅人喜愛的精彩景點。漫步其中，感受在地的生活節奏與自然微風，祝您在此度過愉快難忘的時光。`,
  });
}

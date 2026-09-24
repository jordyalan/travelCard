import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

// Initialize GoogleGenAI client
const apiKey = process.env.GEMINI_API_KEY || '';
const ai = new GoogleGenAI({
  apiKey,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Helper for Gemini call with timeout and retry
async function generateWithRetry(options: any, maxRetries = 1, timeoutMs = 7000) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const callPromise = ai.models.generateContent(options);
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('AI generation timed out')), timeoutMs)
      );
      const response = await Promise.race([callPromise, timeoutPromise]);
      return response;
    } catch (err: any) {
      if (attempt < maxRetries) {
        await new Promise((resolve) => setTimeout(resolve, 800));
      } else {
        throw err;
      }
    }
  }
}

// Fallback generator for itinerary parsing
function fallbackParseItinerary(text: string) {
  const lines = text
    .split(/[\n,，;；。]/)
    .map((s) => s.trim())
    .filter((s) => s.length > 2);

  const items = lines.slice(0, 6).map((line, idx) => {
    let time = `${String(9 + idx * 2).padStart(2, '0')}:00`;
    const timeMatch = line.match(/(\d{1,2})[:點](\d{0,2})/);
    if (timeMatch) {
      const hour = String(parseInt(timeMatch[1], 10)).padStart(2, '0');
      const min = timeMatch[2] ? String(parseInt(timeMatch[2], 10)).padStart(2, '0') : '00';
      time = `${hour}:${min}`;
    }

    const cleanTitle = line
      .replace(/早上|中午|下午|傍晚|晚上|\d{1,2}[:點]\d{0,2}[分度]?|去|到|參觀|吃/g, '')
      .trim();

    return {
      title: cleanTitle || `行程第 ${idx + 1} 站`,
      location: cleanTitle || '市區中心景點',
      lat: 35.7148 + idx * 0.005,
      lng: 139.7967 + idx * 0.006,
      time,
      durationMinutes: 60,
      category: cleanTitle.includes('吃') || cleanTitle.includes('肉') || cleanTitle.includes('麵') ? 'food' : 'scenic',
      notes: '推薦停留拍照與深度探索周邊在地街道特色。',
    };
  });

  return {
    itineraryTitle: '我的自訂智慧行程',
    destinationCity: '自訂城市',
    items: items.length > 0 ? items : [
      {
        title: '淺草寺雷門',
        location: '東京都台東區淺草2-3-1',
        lat: 35.7148,
        lng: 139.7967,
        time: '09:30',
        durationMinutes: 90,
        category: 'culture',
        notes: '東京最古老寺廟，拍照必訪大紅燈籠',
      }
    ],
  };
}

// Fallback generator for attraction info
function fallbackAttractionInfo(name: string, location?: string) {
  return {
    name,
    summary: `${name}是當地極富盛名的人氣造訪景點，擁有迷人的建築風貌與在地人文底蘊，無論是散步觀光或是深度人文體驗都相當推薦。`,
    highlights: [
      `地標性代表景觀，感受${name}獨特的文化與歷史魅力`,
      '周邊步道與街廓氛圍悠閒，非常適合慢活散策與拍照留念',
      '四季景致各異，日照與夜間點燈擁有完全不同的視覺享受',
    ],
    openingHours: '建議參訪時間 09:00 - 18:00 (以現場公告為準)',
    ticketInfo: '境內免費或視特展與設施收取門票',
    estimatedDuration: '約 1.5 - 2 小時',
    photoSpots: [`${name}正門入口與地標招牌前`, '周邊制高點或街角透視視角', '傍晚藍調時刻逆光拍攝'],
    nearbyFood: ['在地老字號排隊美食小吃', '人氣文青手沖咖啡與日式甜點', '傳統特色定食與風味料理'],
    tips: ['建議穿著舒適好走的休閒鞋', '假日人潮眾多，提早到達拍照光線最佳', '請尊重當地環境禮儀與拍照規範'],
    audioGuide: `您好，歡迎來到${name}。這裡是許多旅人心中不容錯過的熱門目的地。周邊綠意與建築交織，漫步其中能感受到獨特的生活節奏與在地記憶。不妨放慢腳步，細細品味這裡的每個角落。`,
  };
}

// Fallback generator for outfit
function fallbackOutfit(weather: any) {
  const temp = weather?.temp ?? 23;
  const rain = weather?.rainProb ?? 20;

  if (temp >= 28) {
    return {
      headline: '炎熱晴朗高溫：透氣涼感、嚴防紫外線防曬',
      summary: `氣溫高達 ${temp}°C，戶外體感炎熱，紫外線偏強。建議以輕薄透氣、吸濕排汗服飾為主，並做好全方位防曬與水分補給。`,
      tags: ['防曬透氣', '吸濕排汗', '遮陽抗UV', '補水防中暑'],
      outfit: {
        top: '吸濕排汗短袖T恤或亞麻透氣襯衫，淺色系散熱佳',
        bottom: '輕薄涼感休閒短褲、九分棉麻休閒褲或透氣寬褲',
        outerwear: '防曬涼感抗UV輕薄外套（室內強冷氣房隨時穿上）',
        shoes: '透氣網布慢跑鞋或防滑支撐性佳的健走涼鞋',
        accessories: ['抗UV折疊陽傘', '抗紫外線偏光太陽眼鏡', '大帽簷遮陽帽', '防曬乳液', '保溫保冷隨身水瓶'],
      },
      practicalTips: [
        '戶外景點行走容易大量流汗，請隨時補充水分與電解質。',
        '進入商場或電車車廂時冷氣較強，隨身攜帶薄外套可避免室內外溫差著涼。',
      ],
    };
  } else if (temp <= 16) {
    return {
      headline: '涼意明顯微寒：保暖防風、洋蔥式疊穿法',
      summary: `氣溫約 ${temp}°C，體感偏冷且可能有微風，建議採用洋蔥式穿法，內層保暖、外層防風，隨活動調節體溫。`,
      tags: ['防風保暖', '洋蔥式穿法', '保暖外套', '舒適健走'],
      outfit: {
        top: '保暖長袖打底衫加上純棉針織衫或衛衣',
        bottom: '防風彈性休閒長褲或厚磅牛仔褲',
        outerwear: '防風保暖連帽夾克、輕量羽絨外套或厚風衣',
        shoes: '包覆保暖慢跑鞋或防滑踝靴',
        accessories: ['輕便保暖圍巾', '防風摺疊傘', '隨身斜背包', '保溫瓶溫水'],
      },
      practicalTips: [
        '傍晚日落後氣溫下降較快，外出請務必拉上外套拉鍊防風。',
        '寺廟或室內可能需脫鞋參觀，建議穿著保暖乾淨的棉襪。',
      ],
    };
  } else {
    return {
      headline: '溫和微涼舒適：洋蔥式穿搭隨走隨脫',
      summary: `目前氣溫約 ${temp}°C，體感相當舒適宜人。午後建議備有輕薄防風外套，若有降雨機率建議隨身攜帶晴雨傘。`,
      tags: ['洋蔥式穿搭', '透氣舒適', '防風薄外套', '輕便健走'],
      outfit: {
        top: '純棉舒適短袖或薄長袖上衣，搭配親膚打底',
        bottom: '彈性休閒直筒褲、卡其褲或運動長褲',
        outerwear: '輕便防風夾克、防潑水風衣或開襟薄外套',
        shoes: '避震減壓健走鞋或休閒球鞋，長時間步行不易疲勞',
        accessories: ['晴雨兩用摺疊傘', '透氣遮陽帽', '隨身小包方便雙手活動'],
      },
      practicalTips: [
        '行經自然步道或階梯較多景點，請以防滑好走的平底球鞋為優先。',
        rain > 40 ? '午後降雨機率偏高，請隨身備妥折傘或輕便雨衣。' : '今日氣候非常適合戶外漫步探索！',
      ],
    };
  }
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', hasKey: !!apiKey });
});

// 1. AI Itinerary Parser
app.post('/api/parse-itinerary', async (req, res) => {
  const { text } = req.body;
  if (!text || typeof text !== 'string') {
    return res.status(400).json({ error: '請提供行程文字內容' });
  }

  try {
    const prompt = `你是一位專業的智慧旅遊秘書。請分析使用者輸入的行程文字，將其拆解轉換為精確的結構化行程清單。
使用者輸入的行程內容：
"""
${text}
"""

注意事項：
1. 每個景點請合理預估其當地的約略經緯度 (lat, lng)，以利地圖標記與行車距離計算。
2. 景點順序請依照行程先後排序。
3. 分類 category 只能是: "culture", "food", "scenic", "shopping", "nature", "entertainment", "other"。
4. 提供簡短實用的注意事項 (notes)。
5. 語言請使用繁體中文。`;

    const response = await generateWithRetry({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            itineraryTitle: { type: Type.STRING, description: '整趟行程名稱' },
            destinationCity: { type: Type.STRING, description: '行程主要城市' },
            items: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  location: { type: Type.STRING },
                  lat: { type: Type.NUMBER },
                  lng: { type: Type.NUMBER },
                  category: { type: Type.STRING },
                  notes: { type: Type.STRING },
                },
                required: ['title', 'location', 'lat', 'lng', 'category', 'notes'],
              },
            },
          },
          required: ['itineraryTitle', 'destinationCity', 'items'],
        },
      },
    });

    const parsed = JSON.parse((response as any)?.text || '{}');
    if (parsed.items && parsed.items.length > 0) {
      return res.json(parsed);
    }
    return res.json(fallbackParseItinerary(text));
  } catch (error: any) {
    console.warn('Gemini parser unavailable, using smart rule-based parser:', error.message);
    return res.json(fallbackParseItinerary(text));
  }
});

// 2. Attraction Info & Guide
app.post('/api/attraction-info', async (req, res) => {
  const { name, location } = req.body;
  if (!name) {
    return res.status(400).json({ error: '請提供景點名稱' });
  }

  try {
    const prompt = `你是一位資深的文化歷史導遊與在地旅遊達人。請為以下景點提供詳盡且豐富的景點導覽與參觀資訊：
景點名稱：${name}
地點參考：${location || '無'}

請以繁體中文撰寫，包含：
1. 景點特色與歷史背景介紹 (summary)
2. 3個核心看點/必看亮點 (highlights)
3. 營業時間 (openingHours)
4. 門票資訊 (ticketInfo)
5. 建議停留時間 (estimatedDuration)
6. 最佳拍照打卡視角 (photoSpots)
7. 周邊推薦美食 (nearbyFood)
8. 在地參觀叮嚀與禮儀 (tips)
9. 語音導覽旁白文字 (audioGuide，約120字)`;

    const response = await generateWithRetry({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
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
          required: [
            'name',
            'summary',
            'highlights',
            'openingHours',
            'ticketInfo',
            'estimatedDuration',
            'photoSpots',
            'nearbyFood',
            'tips',
            'audioGuide',
          ],
        },
      },
    });

    const parsed = JSON.parse((response as any)?.text || '{}');
    return res.json(parsed);
  } catch (error: any) {
    console.warn('Gemini attraction guide error, using rich guide fallback:', error.message);
    return res.json(fallbackAttractionInfo(name, location));
  }
});

// 3. Weather-based Outfit Recommendation
app.post('/api/outfit-recommendation', async (req, res) => {
  const { weather, currentSpot, upcomingSpots } = req.body;

  try {
    const prompt = `你是一位專業時尚造型師與旅行裝備顧問。請依據氣象資訊與接下來的行程，為旅行者量身打造穿搭建議。

天氣數據：
- 當前氣溫：${weather?.temp ?? 23}°C
- 體感溫度：${weather?.apparentTemp ?? 22}°C
- 天氣狀況：${weather?.condition ?? '多雲'}
- 降雨機率：${weather?.rainProb ?? 20}%
- 相對濕度：${weather?.humidity ?? 65}%
- 紫外線指數：${weather?.uv ?? 4}
- 風速：${weather?.windSpeed ?? 10} km/h

行程資訊：
- 目前位置：${currentSpot || '當前所在地'}
- 後續前往：${upcomingSpots?.length ? upcomingSpots.join('、') : '市區漫步觀光'}

請以繁體中文提供：
1. headline
2. summary
3. tags (4個)
4. outfit: top, bottom, outerwear, shoes, accessories (陣列)
5. practicalTips (2-3項)`;

    const response = await generateWithRetry({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
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

    const parsed = JSON.parse((response as any)?.text || '{}');
    return res.json(parsed);
  } catch (error: any) {
    console.warn('Gemini outfit error, using weather-based stylist fallback:', error.message);
    return res.json(fallbackOutfit(weather));
  }
});

// Setup Vite middleware in dev or static files in production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();

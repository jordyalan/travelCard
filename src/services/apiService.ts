import { AttractionGuide, OutfitRecommendation, WeatherData } from '../types/itinerary';
import { getCuratedOrGeneratedGuide } from '../data/curatedAttractionGuides';

/**
 * 智慧解析行程文字（支援後端 AI 及 Vercel 純前端離線環境）
 */
export async function parseItineraryText(text: string) {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500);

    const res = await fetch('/api/parse-itinerary', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
      signal: controller.signal,
    }).finally(() => clearTimeout(timeoutId));

    if (res.ok) {
      const data = await res.json();
      if (data && Array.isArray(data.items) && data.items.length > 0) {
        return data;
      }
    }
  } catch (err) {
    console.warn('API /api/parse-itinerary unavailable (Vercel/Static mode), using client fallback parser.');
  }

  // 純前端解析後備機制（Vercel 部署無後端時亦可正常運作）
  const lines = text
    .split(/[\n,，;；。→\->]/)
    .map((s) => s.trim())
    .filter((s) => s.length > 1);

  const items = lines.slice(0, 10).map((line, idx) => {
    let time = `${String(8 + idx * 2).padStart(2, '0')}:00`;
    const timeMatch = line.match(/(\d{1,2})[:點](\d{0,2})/);
    if (timeMatch) {
      const hour = String(parseInt(timeMatch[1], 10)).padStart(2, '0');
      const min = timeMatch[2] ? String(parseInt(timeMatch[2], 10)).padStart(2, '0') : '00';
      time = `${hour}:${min}`;
    }

    const cleanTitle = line
      .replace(/早上|中午|下午|傍晚|晚上|\d{1,2}[:點]\d{0,2}[分度]?|集合|出發|去|到|參觀|吃/g, '')
      .trim();

    return {
      title: cleanTitle || `行程第 ${idx + 1} 站`,
      location: cleanTitle || '在地特色景點',
      lat: 24.6366 + (idx % 3) * 0.05,
      lng: 121.8048 + (idx % 3) * 0.04,
      time,
      durationMinutes: 60,
      category:
        cleanTitle.includes('吃') || cleanTitle.includes('午餐') || cleanTitle.includes('晚餐') || cleanTitle.includes('夜市')
          ? ('food' as const)
          : cleanTitle.includes('溪') || cleanTitle.includes('水') || cleanTitle.includes('湖') || cleanTitle.includes('海')
          ? ('nature' as const)
          : ('scenic' as const),
      notes: line,
    };
  });

  return {
    itineraryTitle: '自訂匯入行程',
    destinationCity: '台灣精選景點',
    items: items.length > 0 ? items : [
      {
        title: '宜蘭三奇美徑黃金稻浪',
        location: '宜蘭縣冬山鄉三奇村',
        lat: 24.6366,
        lng: 121.8048,
        time: '09:00',
        durationMinutes: 60,
        category: 'scenic' as const,
        notes: '漫步金黃稻浪，無電線桿純淨美景',
      },
    ],
  };
}

/**
 * 取得景點深度導覽介紹
 * - 優先比對完整預載的高品質景點導覽手冊
 * - 若有後端 AI 則嘗試取得動態補強
 * - 在 Vercel 或無後端環境下絕不拋出錯誤，保證 100% 成功載入
 */
export async function fetchAttractionGuide(
  name: string,
  location?: string,
  notes?: string
): Promise<AttractionGuide> {
  const fallback = getCuratedOrGeneratedGuide(name, location, notes);

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2500);

    const res = await fetch('/api/attraction-info', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, location }),
      signal: controller.signal,
    }).finally(() => clearTimeout(timeoutId));

    if (res.ok) {
      const data = await res.json();
      if (data && data.summary) {
        return data;
      }
    }
  } catch (e) {
    // 部署於 Vercel 純前端時 API 不存在或失敗，無縫回傳預載/生成的精美導覽
    console.info(`Using client-side curated guide for: ${name}`);
  }

  return fallback;
}

/**
 * 取得穿搭建議
 * - 支援後端 AI 與 Vercel 純前端依即時天氣自動運算
 */
export async function fetchOutfitRecommendation(
  weather: WeatherData,
  currentSpot?: string,
  upcomingSpots?: string[]
): Promise<OutfitRecommendation> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2500);

    const res = await fetch('/api/outfit-recommendation', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        weather: {
          temp: weather.temperature,
          apparentTemp: weather.apparentTemperature,
          condition: weather.condition,
          rainProb: weather.rainProbability,
          humidity: weather.humidity,
          uv: weather.uvIndex,
          windSpeed: weather.windSpeed,
        },
        currentSpot,
        upcomingSpots,
      }),
      signal: controller.signal,
    }).finally(() => clearTimeout(timeoutId));

    if (res.ok) {
      const data = await res.json();
      if (data && data.headline && data.outfit) {
        return data;
      }
    }
  } catch (e) {
    console.info('Using client-side outfit generator for current weather');
  }

  // 純前端天氣穿搭演算法（Vercel 部署無後端時亦能精準推薦）
  const temp = weather.temperature ?? 24;
  const rain = weather.rainProbability ?? 15;
  const uv = weather.uvIndex ?? 4;

  if (temp >= 28) {
    return {
      headline: '炎熱晴朗高溫：透氣涼感、嚴防紫外線防曬',
      summary: `目前氣溫約 ${temp}°C，戶外體感炎熱，紫外線指數 UV ${uv} 偏強。建議以輕薄透氣、吸濕排汗服飾為主，並做好全方位防曬遮陽與水分補給。`,
      tags: ['防曬透氣', '吸濕排汗', '遮陽抗UV', '隨時補水'],
      outfit: {
        top: '吸濕排汗短袖T恤、涼感透氣polo衫或淺色純棉短袖',
        bottom: '輕薄涼感運動短褲、透氣寬褲或九分休閒褲',
        outerwear: '抗UV涼感防曬薄外套（冷氣房或車內必備）',
        shoes: '透氣慢跑運動鞋或抓地力佳的包覆式涼鞋',
        accessories: ['抗UV偏光太陽眼鏡', '遮陽大圓帽或棒球帽', '晴雨兩用摺傘', '隨身保冷保溫水壺'],
      },
      practicalTips: [
        '戶外景點行走容易大量流汗，請隨時補充水分與電解質。',
        '進入遊覽車或室內商場時冷氣較強，隨身攜帶薄外套可避免室內外溫差著涼。',
        rain >= 30 ? '今日降雨機率達 30% 以上，隨身攜帶輕便雨具以備不時之需。' : '天候大致晴朗，享受熱情陽光！',
      ],
    };
  } else if (temp <= 18) {
    return {
      headline: '涼意微寒：防風保暖、洋蔥式多層次疊穿',
      summary: `氣溫約 ${temp}°C，體感偏涼且山區海濱風勢較大。建議採用洋蔥式穿法，內層保暖、外層防風，隨活動調節體溫。`,
      tags: ['防風保暖', '洋蔥式穿法', '保暖外套', '舒適好走'],
      outfit: {
        top: '長袖保暖上衣、純棉帽T或針織衫',
        bottom: '彈性休閒長褲、防風運動長褲或厚磅牛仔褲',
        outerwear: '防風保暖連帽夾克、輕量羽絨背心或防風軟殼外套',
        shoes: '舒適減震健走鞋或慢跑鞋搭配吸汗棉襪',
        accessories: ['防風輕便圍巾', '折疊晴雨傘', '雙肩背包方便收納外套'],
      },
      practicalTips: [
        '早晚與溪邊溫差較大，下車參觀時請記得穿妥外套防風。',
        '若有戲水或踏青行程，建議備有一套替換衣物與乾毛巾。',
      ],
    };
  } else {
    return {
      headline: '舒適微風怡人：洋蔥式隨走隨脫最自在',
      summary: `氣溫約 ${temp}°C，體感舒適宜人，非常適合戶外旅行踏青。建議內著舒適短袖或薄長袖，隨身攜帶一件薄外套因應車內冷氣與午後微風。`,
      tags: ['洋蔥式穿搭', '休閒舒適', '微風怡人', '透氣運動'],
      outfit: {
        top: '休閒純棉短袖T恤或透氣薄長袖襯衫',
        bottom: '休閒工裝短褲、棉質慢跑長褲或修身牛仔褲',
        outerwear: '輕便防風薄外套、連帽薄夾克或針織開襟衫',
        shoes: '舒適避震慢跑鞋或防滑休閒球鞋',
        accessories: ['抗UV太陽眼鏡', '晴雨兩用折傘', '防蚊液（戲水親水必備）'],
      },
      practicalTips: [
        '今日氣候非常適合戶外漫遊拍照，穿著亮色系服飾在金黃稻浪與碧綠溪水中拍照效果極佳！',
        '前往砂婆噹溪與白鮑溪等親水景點，請記得穿著防滑水鞋並留意腳下濕滑安全。',
      ],
    };
  }
}

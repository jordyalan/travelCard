import { ItineraryItem } from '../types/itinerary';

export interface DemoPlan {
  id: string;
  name: string;
  cityName: string;
  defaultLat: number;
  defaultLng: number;
  initialDate?: string;
  items: ItineraryItem[];
}

export function getCuratedDemoPlans(): DemoPlan[] {
  return [
    {
      id: 'yilan-hualien',
      name: '國慶連假宜蘭三奇黃金稻浪・花蓮砂婆噹溪・白鮑溪戲水二日遊',
      cityName: '宜蘭・花蓮',
      defaultLat: 25.0422,
      defaultLng: 121.5080,
      initialDate: '2026-10-09',
      items: [
        // 10月9日 Day 1
        {
          id: 'yh-1',
          title: '西門捷運站6號出口附近集合出發',
          location: '台北市萬華區中華路一段 (捷運西門站6號出口)',
          lat: 25.0422,
          lng: 121.5080,
          date: '2026-10-09',
          category: 'other',
          notes: '早上08:00西門捷運站6號出口集合出發，準備展開國慶連假宜花精彩二日遊。',
        },
        {
          id: 'yh-2',
          title: '宜蘭三奇美徑黃金稻浪',
          location: '宜蘭縣冬山鄉三奇村三奇農路',
          lat: 24.6366,
          lng: 121.8048,
          date: '2026-10-09',
          category: 'scenic',
          notes: '宜蘭版伯朗大道，稻子成熟季節黃金稻浪翻湧，登上高台遠眺無電線桿純淨田園風光。',
        },
        {
          id: 'yh-3',
          title: '漢本海洋驛站',
          location: '宜蘭縣南澳鄉和平溪出海口 (台9丁線旁海景休憩區)',
          lat: 24.3015,
          lng: 121.7588,
          date: '2026-10-09',
          category: 'scenic',
          notes: '面迎太平洋蔚藍海景與浪花，設有彩虹盪鞦韆與海風觀景台，拍照打卡絕美停駐點。',
        },
        {
          id: 'yh-4',
          title: '太魯閣大眾餐廳午餐',
          location: '花蓮縣秀林鄉富世村富世93號',
          lat: 24.1568,
          lng: 121.6214,
          date: '2026-10-09',
          category: 'food',
          notes: '品嚐原住民風味料理與花蓮在地特色合菜午餐，補足旅途活力。',
        },
        {
          id: 'yh-5',
          title: '砂婆噹溪玩水',
          location: '花蓮縣秀林鄉水源村砂婆噹溪水源地親水區',
          lat: 23.9877,
          lng: 121.5478,
          date: '2026-10-09',
          category: 'nature',
          notes: '清澈見底的天然溪水與峽谷秘境，水質冰涼消暑，戲水踏石請注意防滑安全。',
        },
        {
          id: 'yh-6',
          title: '花蓮將軍府神社 (將軍府1936園區)',
          location: '花蓮縣花蓮市中正路622巷6號',
          lat: 23.9822,
          lng: 121.6110,
          date: '2026-10-09',
          category: 'culture',
          notes: '日治時期高級將官檜木宿舍群與老樹古蹟，整修為文創日式園區，感受昭和時代懷舊風情。',
        },
        {
          id: 'yh-7',
          title: '非凡假期大飯店 (Check-in 入住)',
          location: '花蓮縣花蓮市國聯二路112號',
          lat: 23.9926,
          lng: 121.6022,
          date: '2026-10-09',
          category: 'other',
          notes: '抵達飯店辦理入住手續放置行李，稍作梳洗休息。',
        },
        {
          id: 'yh-8',
          title: '花蓮文化創意產業園區',
          location: '花蓮縣花蓮市中華路144號',
          lat: 23.9760,
          lng: 121.6045,
          date: '2026-10-09',
          category: 'culture',
          notes: '百年花蓮舊酒廠建築轉型的文創聚落，有戶外草坪、手作市集與在地設計選物店。',
        },
        {
          id: 'yh-9',
          title: '花蓮東大門夜市 (晚餐自理)',
          location: '花蓮縣花蓮市重慶路415號',
          lat: 23.9723,
          lng: 121.6118,
          date: '2026-10-09',
          category: 'food',
          notes: '花蓮最大夜市，推薦必吃林記燒番麥、強蛋餅、原住民烤竹筒飯與烤麻糬。',
        },

        // 10月10日 Day 2
        {
          id: 'yh-10',
          title: '非凡假期大飯店活力早餐',
          location: '花蓮縣花蓮市國聯二路112號 飯店餐廳',
          lat: 23.9926,
          lng: 121.6022,
          date: '2026-10-10',
          category: 'food',
          notes: '享用飯店豐富中西式自助早餐，補充整日滿滿遊玩體力。',
        },
        {
          id: 'yh-11',
          title: '非凡假期大飯店08:30退房出發',
          location: '花蓮縣花蓮市國聯二路112號 大廳門口',
          lat: 23.9926,
          lng: 121.6022,
          date: '2026-10-10',
          category: 'other',
          notes: '08:30準時退房上車集合出發，展開國慶第二日山水之旅。',
        },
        {
          id: 'yh-12',
          title: '雲山水夢幻湖',
          location: '花蓮縣壽豐鄉豐坪路二段2巷201弄18號',
          lat: 23.8328,
          lng: 121.5135,
          date: '2026-10-10',
          category: 'scenic',
          notes: '宛如歐洲仙境的蒂芬妮藍夢幻湖泊與翠綠落羽松森林，跳石步道必拍打卡熱點。',
        },
        {
          id: 'yh-13',
          title: '白鮑溪戲水區',
          location: '花蓮縣壽豐鄉池南村白鮑溪親水步道',
          lat: 23.8680,
          lng: 121.4925,
          date: '2026-10-10',
          category: 'nature',
          notes: '溪水豐沛清澈冰涼，盛產豐田玉與台灣墨玉，是親水泡腳與尋寶戲水的天然勝地。',
        },
        {
          id: 'yh-14',
          title: '桐花小廚午餐',
          location: '花蓮縣吉安鄉吉興路二段',
          lat: 23.9645,
          lng: 121.5670,
          date: '2026-10-10',
          category: 'food',
          notes: '精緻道地的客家私房菜料理，品嚐客家小炒、梅干扣肉與在地時蔬。',
        },
        {
          id: 'yh-15',
          title: '台泥DAKA園區',
          location: '花蓮縣秀林鄉和平村和平263號',
          lat: 24.3075,
          lng: 121.7505,
          date: '2026-10-10',
          category: 'scenic',
          notes: '大型太陽能和平之花音樂水舞、水泥生態循環工廠及特色星巴克與在地市集。',
        },
        {
          id: 'yh-16',
          title: '蘇澳服務區',
          location: '宜蘭縣蘇澳鎮蘇新路101號 (國道5號蘇澳端)',
          lat: 24.6050,
          lng: 121.8315,
          date: '2026-10-10',
          category: 'food',
          notes: '大船造型特色國道休息站，採買宜蘭在地名產伴手禮與品嚐小吃。',
        },
        {
          id: 'yh-17',
          title: '台北西門 (平安賦歸)',
          location: '台北市萬華區中華路一段 (捷運西門站)',
          lat: 25.0422,
          lng: 121.5080,
          date: '2026-10-10',
          category: 'other',
          notes: '平安抵達台北西門，結束豐富愉快的國慶二日宜花親水之旅。',
        },
      ],
    },
  ];
}

export const DEMO_ITINERARIES = getCuratedDemoPlans();

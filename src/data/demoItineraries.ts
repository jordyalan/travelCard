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
      id: 'guangfu-miaoli-nantou',
      name: '光復節連假南庄老街美食.格林奇幻森林攝影基地.逢甲夜市.忘憂森林二日遊即時行程表',
      cityName: '苗栗・台中・南投',
      defaultLat: 25.0422,
      defaultLng: 121.5080,
      initialDate: '2026-10-25',
      items: [
        // 10月25日 Day 1
        {
          id: 'gf-1',
          title: '西門捷運站6號出口附近集合出發',
          location: '台北市萬華區中華路一段 (捷運西門站6號出口)',
          lat: 25.0422,
          lng: 121.5080,
          date: '2026-10-25',
          category: 'other',
          notes: '早上08:00西門捷運站6號出口附近集合出發，展開光復節二日豐富精彩旅程。',
        },
        {
          id: 'gf-2',
          title: '神仙谷',
          location: '苗栗縣南庄鄉東河村鹿場 (苗21線神仙谷風景區)',
          lat: 24.5385,
          lng: 121.0375,
          date: '2026-10-25',
          category: 'scenic',
          notes: '電影《賽德克·巴萊》拍攝秘境，風美溪與鹿場溪匯流的雙瀑峽谷，漫步吊橋俯瞰壯麗瀑布與奇岩巨石。',
        },
        {
          id: 'gf-3',
          title: '南庄老街+午餐自理',
          location: '苗栗縣南庄鄉中正路 (南庄老街・桂花巷)',
          lat: 24.5995,
          lng: 120.9995,
          date: '2026-10-25',
          category: 'food',
          notes: '漫遊桂花巷、百年南庄老郵局與洗衫坑，午餐自理品嚐桂花冰鎮湯圓、丈母娘豆干、客家粄條與手作麻糬。',
        },
        {
          id: 'gf-4',
          title: '格林奇幻森林攝影基地',
          location: '苗栗縣通霄鎮苗44線 (通霄大湖交界攝影基地)',
          lat: 24.4752,
          lng: 120.7380,
          date: '2026-10-25',
          category: 'scenic',
          notes: '全台夢幻外拍打卡勝地，擁有白色水上教堂、哈比人魔戒石屋、法式城堡莊園與湖畔天鵝船，拍出百張奇幻美照。',
        },
        {
          id: 'gf-5',
          title: '雀客逢甲商旅',
          location: '台中市西屯區福星北路28號 (CHECK inn Select Taichung Fengjia)',
          lat: 24.1822,
          lng: 120.6478,
          date: '2026-10-25',
          category: 'other',
          notes: '抵達台中優質商旅辦理入住手續放置行李，鄰近逢甲商圈生活機能極佳，客房簡約時尚舒適。',
        },
        {
          id: 'gf-6',
          title: '逢甲夜市晚餐自理',
          location: '台中市西屯區文華路 (逢甲大學周邊商圈)',
          lat: 24.1795,
          lng: 120.6450,
          date: '2026-10-25',
          category: 'food',
          notes: '全台規模最大創意美食夜市，晚餐自理推薦明倫蛋餅、日船章魚小丸子、官芝霖大腸包小腸、一心素食臭豆腐與現炸地瓜球。',
        },

        // 10月26日 Day 2
        {
          id: 'gf-7',
          title: '早餐自理',
          location: '台中市西屯區逢甲商圈特色早午餐 / 商旅周邊',
          lat: 24.1822,
          lng: 120.6478,
          date: '2026-10-26',
          category: 'food',
          notes: '晨光自由探索享用逢甲在地特色早點或香醇咖啡，儲備今日滿滿森林芬多精活力。',
        },
        {
          id: 'gf-8',
          title: '雀客逢甲商旅08:30退房出發',
          location: '台中市西屯區福星北路28號 大廳門口',
          lat: 24.1822,
          lng: 120.6478,
          date: '2026-10-26',
          category: 'other',
          notes: '08:30準時退房集合上車出發，啟程前往南投鹿谷高山秘境。',
        },
        {
          id: 'gf-9',
          title: '竹林秘境',
          location: '南投縣鹿谷鄉愛鄉路 (長源圳生態步道・孟宗竹林秘境)',
          lat: 23.7095,
          lng: 120.7810,
          date: '2026-10-26',
          category: 'nature',
          notes: '宛如走進日本京都嵐山竹林小徑與電影《臥虎藏龍》場景，漫步翠綠高聳的孟宗竹林步道，大口呼吸滿滿竹香與森林芬多精。',
        },
        {
          id: 'gf-10',
          title: '妖怪村商圈+午餐自理',
          location: '南投縣鹿谷鄉內湖村興產路2-3號 (溪頭妖怪村主題商圈)',
          lat: 23.6738,
          lng: 120.7965,
          date: '2026-10-26',
          category: 'food',
          notes: '濃郁日式木造江戶風情鳥居、紅色大燈籠與逗趣妖怪裝置，午餐自理品嚐咬人貓麵包、枯麻黑心蛋、高山筍包與山產小吃。',
        },
        {
          id: 'gf-11',
          title: '忘憂森林',
          location: '南投縣竹山鎮溪山路3-25號 (杉林溪旁高山迷霧森林)',
          lat: 23.6492,
          lng: 120.7925,
          date: '2026-10-26',
          category: 'scenic',
          notes: '921地震後形成的高山堰塞湖，枯立杉木倒映在清澈水窪中，午後時常雲霧繚繞，宛如人間仙境般的迷霧夢幻奇景。',
        },
        {
          id: 'gf-12',
          title: '竹山紫南宮',
          location: '南投縣竹山鎮大公街40號',
          lat: 23.8178,
          lng: 120.7180,
          date: '2026-10-26',
          category: 'culture',
          notes: '全台香火最鼎盛的求發財金土地公廟，祈求平安順遂與發財金，參觀著名的七星級金筍造型藝術廁所與品嚐竹山特產番薯包。',
        },
        {
          id: 'gf-13',
          title: '台北西門',
          location: '台北市萬華區中華路一段 (捷運西門站)',
          lat: 25.0422,
          lng: 121.5080,
          date: '2026-10-26',
          category: 'other',
          notes: '平安返抵台北西門町，圓滿結束充實難忘的光復節二日南庄、台中、南投森活美食之旅。',
        },
      ],
    },
  ];
}

export const DEMO_ITINERARIES = getCuratedDemoPlans();

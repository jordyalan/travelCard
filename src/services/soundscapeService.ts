// Soundscape Audio Engine powered by Web Audio API
// Runs 100% offline and in-browser without external network audio downloads or CORS issues.

export type SoundscapeType =
  | 'river_stream'      // 砂婆噹溪、白鮑溪、雲山水夢幻湖
  | 'restaurant_dining' // 太魯閣大眾餐廳、桐花小廚、花蓮東大門夜市、飯店早餐、蘇澳服務區
  | 'field_wind'        // 宜蘭三奇黃金稻浪、田園微風
  | 'ocean_waves'       // 漢本海洋驛站
  | 'shrine_zen'        // 花蓮將軍府神社、花蓮文創園區
  | 'hotel_lounge'      // 非凡假期大飯店、台北西門
  | 'fountain_plaza'    // 台泥DAKA園區
  | 'departure_travel'; // 西門捷運站集合出發

export interface SoundscapeMeta {
  type: SoundscapeType;
  title: string;
  badge: string;
  description: string;
  emoji: string;
}

export const SOUNDSCAPE_CONFIGS: Record<SoundscapeType, SoundscapeMeta> = {
  river_stream: {
    type: 'river_stream',
    title: '清涼潺潺溪流與山澗水聲',
    badge: '天然水流與水滴浪花',
    description: '純淨溪流奔流、天然水花飛濺、水滴漣漪與峽谷山林微風',
    emoji: '🌊',
  },
  restaurant_dining: {
    type: 'restaurant_dining',
    title: '熱鬧餐廳餐盤與旅人談笑聲',
    badge: '餐盤刀叉與歡聚人聲',
    description: '瓷器餐盤輕碰、杯盤交錯、夜市料理滋滋香氣與溫馨歡笑人聲',
    emoji: '🍽️',
  },
  field_wind: {
    type: 'field_wind',
    title: '金黃稻浪沙沙聲與田園微風',
    badge: '稻穗隨風與鄉野鳥鳴',
    description: '微風拂過金黃稻穗沙沙聲、無電線桿純淨田野夏風與清脆鳥囀',
    emoji: '🌾',
  },
  ocean_waves: {
    type: 'ocean_waves',
    title: '太平洋浩瀚海浪拍岸聲',
    badge: '壯闊浪潮與太平洋海風',
    description: '太平洋澎湃浪潮起伏拍岸、海浪泡沫碎裂與海風呼嘯遠方海鷗',
    emoji: '🌊',
  },
  shrine_zen: {
    type: 'shrine_zen',
    title: '昭和日式神社銅風鈴與禪意古韻',
    badge: '清脆風鈴與檜木靜謐',
    description: '清脆和風銅風鈴隨風叮咚輕響、檜木老宅沉靜氛圍與庭院微風',
    emoji: '🎐',
  },
  hotel_lounge: {
    type: 'hotel_lounge',
    title: '飯店大廳溫馨舒緩放鬆旋律',
    badge: '舒緩沙發鋼琴環境音',
    description: '輕柔放鬆的沙發鋼琴和弦、卸下一身旅途疲勞的溫暖休憩時光',
    emoji: '☕',
  },
  fountain_plaza: {
    type: 'fountain_plaza',
    title: '和平之花音樂水舞與廣場微風',
    badge: '噴泉跳泉與律動水花',
    description: '音樂水舞噴泉水柱起伏水花、戶外廣場陽光微風與特色休憩氛圍',
    emoji: '⛲',
  },
  departure_travel: {
    type: 'departure_travel',
    title: '晨光出發旅程輕快律動',
    badge: '活力出發與期待旋律',
    description: '國慶連假整裝出發的晨光朝氣、同行夥伴歡喜期待的輕快旅途音律',
    emoji: '🎒',
  },
};

/**
 * 依景點名稱或備註自動推斷最符合的情境音效種類
 */
export function getSoundscapeMeta(attractionName: string, notes?: string): SoundscapeMeta {
  const name = (attractionName || '').trim();
  const noteText = (notes || '').trim();
  const full = `${name} ${noteText}`;

  if (
    full.includes('砂婆噹') ||
    full.includes('白鮑溪') ||
    full.includes('戲水') ||
    full.includes('玩水') ||
    full.includes('溪') ||
    full.includes('瀑布') ||
    full.includes('夢幻湖')
  ) {
    return SOUNDSCAPE_CONFIGS.river_stream;
  }

  if (
    full.includes('餐廳') ||
    full.includes('大眾餐廳') ||
    full.includes('桐花小廚') ||
    full.includes('午餐') ||
    full.includes('晚餐') ||
    full.includes('夜市') ||
    full.includes('東大門') ||
    full.includes('早餐') ||
    full.includes('蘇澳服務區') ||
    full.includes('美食') ||
    full.includes('小吃')
  ) {
    return SOUNDSCAPE_CONFIGS.restaurant_dining;
  }

  if (
    full.includes('三奇') ||
    full.includes('稻浪') ||
    full.includes('伯朗大道') ||
    full.includes('稻田') ||
    full.includes('農路')
  ) {
    return SOUNDSCAPE_CONFIGS.field_wind;
  }

  if (
    full.includes('漢本') ||
    full.includes('海洋') ||
    full.includes('海灘') ||
    full.includes('太平洋') ||
    full.includes('浪花')
  ) {
    return SOUNDSCAPE_CONFIGS.ocean_waves;
  }

  if (
    full.includes('將軍府') ||
    full.includes('神社') ||
    full.includes('文創') ||
    full.includes('文化創意') ||
    full.includes('檜木') ||
    full.includes('古蹟')
  ) {
    return SOUNDSCAPE_CONFIGS.shrine_zen;
  }

  if (full.includes('DAKA') || full.includes('台泥') || full.includes('水舞') || full.includes('和平之花')) {
    return SOUNDSCAPE_CONFIGS.fountain_plaza;
  }

  if (
    full.includes('出發') ||
    full.includes('集合') ||
    full.includes('捷運站') ||
    full.includes('啟程')
  ) {
    return SOUNDSCAPE_CONFIGS.departure_travel;
  }

  if (
    full.includes('飯店') ||
    full.includes('入住') ||
    full.includes('退房') ||
    full.includes('賦歸') ||
    full.includes('台北西門')
  ) {
    return SOUNDSCAPE_CONFIGS.hotel_lounge;
  }

  return SOUNDSCAPE_CONFIGS.field_wind;
}

class SoundscapeEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private isRunning: boolean = false;
  private currentType: SoundscapeType | null = null;
  private activeIntervals: number[] = [];
  private activeNodes: (AudioNode | AudioScheduledSourceNode)[] = [];

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.7, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public isPlaying(): boolean {
    return this.isRunning;
  }

  public getCurrentType(): SoundscapeType | null {
    return this.currentType;
  }

  public setVolume(vol: number) {
    if (this.masterGain && this.ctx) {
      const clamped = Math.max(0, Math.min(1, vol));
      this.masterGain.gain.setTargetAtTime(clamped, this.ctx.currentTime, 0.05);
    }
  }

  public stop() {
    if (!this.isRunning) return;
    this.isRunning = false;
    this.currentType = null;

    // 清理定時器
    this.activeIntervals.forEach((id) => window.clearInterval(id));
    this.activeIntervals = [];

    // 平滑淡出音量防止爆音
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(0, this.ctx.currentTime, 0.08);
    }

    setTimeout(() => {
      this.activeNodes.forEach((node) => {
        try {
          if ('stop' in node && typeof (node as any).stop === 'function') {
            (node as any).stop();
          }
          node.disconnect();
        } catch (e) {}
      });
      this.activeNodes = [];
    }, 150);
  }

  public play(type: SoundscapeType, volume: number = 0.7) {
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    if (this.isRunning) {
      this.stop();
    }

    this.isRunning = true;
    this.currentType = type;
    this.masterGain.gain.setValueAtTime(volume, this.ctx.currentTime);

    switch (type) {
      case 'river_stream':
        this.synthesizeRiverStream();
        break;
      case 'restaurant_dining':
        this.synthesizeRestaurantDining();
        break;
      case 'field_wind':
        this.synthesizeFieldWind();
        break;
      case 'ocean_waves':
        this.synthesizeOceanWaves();
        break;
      case 'shrine_zen':
        this.synthesizeShrineZen();
        break;
      case 'hotel_lounge':
        this.synthesizeHotelLounge();
        break;
      case 'fountain_plaza':
        this.synthesizeFountainPlaza();
        break;
      case 'departure_travel':
        this.synthesizeDepartureTravel();
        break;
      default:
        this.synthesizeRiverStream();
        break;
    }
  }

  /**
   * 建立雜音緩衝區（Pink/Brownian 濾波基礎）
   */
  private createNoiseBuffer(durationSeconds = 4): AudioBuffer {
    const ctx = this.ctx!;
    const sampleRate = ctx.sampleRate;
    const buffer = ctx.createBuffer(2, sampleRate * durationSeconds, sampleRate);
    for (let channel = 0; channel < 2; channel++) {
      const data = buffer.getChannelData(channel);
      let lastOut = 0.0;
      for (let i = 0; i < data.length; i++) {
        const white = Math.random() * 2 - 1;
        // 柔和低通平滑濾波
        lastOut = (lastOut + 0.02 * white) / 1.02;
        data[i] = lastOut * 3.5;
      }
    }
    return buffer;
  }

  /**
   * 1. 溪水流水音效：潺潺清泉 + 水珠水滴 + 山林輕鳥
   */
  private synthesizeRiverStream() {
    const ctx = this.ctx!;
    const buffer = this.createNoiseBuffer(5);

    const noiseSource = ctx.createBufferSource();
    noiseSource.buffer = buffer;
    noiseSource.loop = true;

    // 溪流流水頻段濾波
    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(650, ctx.currentTime);
    filter.Q.setValueAtTime(1.2, ctx.currentTime);

    // 水流慢速起伏
    const lfo = ctx.createOscillator();
    lfo.frequency.setValueAtTime(0.35, ctx.currentTime);
    const lfoGain = ctx.createGain();
    lfoGain.gain.setValueAtTime(220, ctx.currentTime);
    lfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);

    const streamGain = ctx.createGain();
    streamGain.gain.setValueAtTime(0.45, ctx.currentTime);

    noiseSource.connect(filter);
    filter.connect(streamGain);
    streamGain.connect(this.masterGain!);

    noiseSource.start();
    lfo.start();
    this.activeNodes.push(noiseSource, lfo, filter, streamGain);

    // 隨機清脆水珠與水波漣漪 (Water Bubble Droplets)
    const bubbleTimer = window.setInterval(() => {
      if (!this.isRunning) return;
      try {
        const osc = ctx.createOscillator();
        const g = ctx.createGain();
        const baseFreq = 480 + Math.random() * 600;
        osc.type = 'sine';
        osc.frequency.setValueAtTime(baseFreq, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(baseFreq * 0.45, ctx.currentTime + 0.09);

        g.gain.setValueAtTime(0.08 + Math.random() * 0.07, ctx.currentTime);
        g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.09);

        osc.connect(g);
        g.connect(this.masterGain!);
        osc.start();
        osc.stop(ctx.currentTime + 0.1);
      } catch (e) {}
    }, 280);

    this.activeIntervals.push(bubbleTimer);
  }

  /**
   * 2. 餐廳用餐音效：熱鬧餐盤刀叉瓷器輕碰 + 歡笑談話低語
   */
  private synthesizeRestaurantDining() {
    const ctx = this.ctx!;
    const buffer = this.createNoiseBuffer(5);

    // 餐廳人聲低語嗡嗡環境底噪
    const chatterSource = ctx.createBufferSource();
    chatterSource.buffer = buffer;
    chatterSource.loop = true;

    const chatterFilter = ctx.createBiquadFilter();
    chatterFilter.type = 'bandpass';
    chatterFilter.frequency.setValueAtTime(380, ctx.currentTime);
    chatterFilter.Q.setValueAtTime(2.0, ctx.currentTime);

    const chatterGain = ctx.createGain();
    chatterGain.gain.setValueAtTime(0.25, ctx.currentTime);

    chatterSource.connect(chatterFilter);
    chatterFilter.connect(chatterGain);
    chatterGain.connect(this.masterGain!);

    chatterSource.start();
    this.activeNodes.push(chatterSource, chatterFilter, chatterGain);

    // 定期發出逼真的餐盤、瓷器、杯盤刀叉輕敲聲音 (Ceramic Clinking)
    const clinkTimer = window.setInterval(() => {
      if (!this.isRunning) return;
      try {
        const clinkOsc = ctx.createOscillator();
        const clinkHarmonic = ctx.createOscillator();
        const clinkGain = ctx.createGain();

        const freqs = [2400, 3100, 3600, 4200, 4800, 5200];
        const chosenFreq = freqs[Math.floor(Math.random() * freqs.length)] + (Math.random() * 80 - 40);

        clinkOsc.type = 'sine';
        clinkOsc.frequency.setValueAtTime(chosenFreq, ctx.currentTime);

        clinkHarmonic.type = 'triangle';
        clinkHarmonic.frequency.setValueAtTime(chosenFreq * 1.58, ctx.currentTime);

        const now = ctx.currentTime;
        const dur = 0.06 + Math.random() * 0.08;
        clinkGain.gain.setValueAtTime(0.06 + Math.random() * 0.05, now);
        clinkGain.gain.exponentialRampToValueAtTime(0.0005, now + dur);

        clinkOsc.connect(clinkGain);
        clinkHarmonic.connect(clinkGain);
        clinkGain.connect(this.masterGain!);

        clinkOsc.start(now);
        clinkHarmonic.start(now);
        clinkOsc.stop(now + dur + 0.02);
        clinkHarmonic.stop(now + dur + 0.02);
      } catch (e) {}
    }, 950);

    this.activeIntervals.push(clinkTimer);
  }

  /**
   * 3. 稻浪微風音效：金色稻穗沙沙聲 + 田野鄉村微風 + 甜美鳥囀
   */
  private synthesizeFieldWind() {
    const ctx = this.ctx!;
    const buffer = this.createNoiseBuffer(5);

    const windSource = ctx.createBufferSource();
    windSource.buffer = buffer;
    windSource.loop = true;

    // 稻穗隨風摩擦沙沙聲濾波
    const windFilter = ctx.createBiquadFilter();
    windFilter.type = 'bandpass';
    windFilter.frequency.setValueAtTime(1400, ctx.currentTime);
    windFilter.Q.setValueAtTime(3.0, ctx.currentTime);

    // 微風慢速波動 LFO
    const windLfo = ctx.createOscillator();
    windLfo.frequency.setValueAtTime(0.25, ctx.currentTime);
    const windLfoGain = ctx.createGain();
    windLfoGain.gain.setValueAtTime(600, ctx.currentTime);
    windLfo.connect(windLfoGain);
    windLfoGain.connect(windFilter.frequency);

    const windGain = ctx.createGain();
    windGain.gain.setValueAtTime(0.35, ctx.currentTime);

    windSource.connect(windFilter);
    windFilter.connect(windGain);
    windGain.connect(this.masterGain!);

    windSource.start();
    windLfo.start();
    this.activeNodes.push(windSource, windLfo, windFilter, windGain);

    // 田野自然鳥鳴 (Birdsong Chirps)
    const birdTimer = window.setInterval(() => {
      if (!this.isRunning) return;
      if (Math.random() > 0.45) return;
      try {
        const birdOsc = ctx.createOscillator();
        const birdGain = ctx.createGain();
        const now = ctx.currentTime;
        const startF = 3200 + Math.random() * 800;

        birdOsc.type = 'sine';
        birdOsc.frequency.setValueAtTime(startF, now);
        birdOsc.frequency.exponentialRampToValueAtTime(startF * 1.3, now + 0.06);
        birdOsc.frequency.exponentialRampToValueAtTime(startF * 0.9, now + 0.14);

        birdGain.gain.setValueAtTime(0.04, now);
        birdGain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

        birdOsc.connect(birdGain);
        birdGain.connect(this.masterGain!);

        birdOsc.start(now);
        birdOsc.stop(now + 0.16);
      } catch (e) {}
    }, 2200);

    this.activeIntervals.push(birdTimer);
  }

  /**
   * 4. 太平洋海浪音效：浩瀚海浪起伏拍打礁岩碎石
   */
  private synthesizeOceanWaves() {
    const ctx = this.ctx!;
    const buffer = this.createNoiseBuffer(6);

    const oceanSource = ctx.createBufferSource();
    oceanSource.buffer = buffer;
    oceanSource.loop = true;

    // 海浪潮汐濾波
    const oceanFilter = ctx.createBiquadFilter();
    oceanFilter.type = 'lowpass';
    oceanFilter.frequency.setValueAtTime(450, ctx.currentTime);

    // 5秒緩慢海浪潮起潮落 LFO
    const oceanLfo = ctx.createOscillator();
    oceanLfo.frequency.setValueAtTime(0.18, ctx.currentTime);
    const oceanLfoGain = ctx.createGain();
    oceanLfoGain.gain.setValueAtTime(450, ctx.currentTime);
    oceanLfo.connect(oceanLfoGain);
    oceanLfoGain.connect(oceanFilter.frequency);

    const oceanGain = ctx.createGain();
    oceanGain.gain.setValueAtTime(0.5, ctx.currentTime);

    // 浪潮增益調變
    const gainLfo = ctx.createOscillator();
    gainLfo.frequency.setValueAtTime(0.18, ctx.currentTime);
    const gainLfoGain = ctx.createGain();
    gainLfoGain.gain.setValueAtTime(0.25, ctx.currentTime);
    gainLfo.connect(gainLfoGain);
    gainLfoGain.connect(oceanGain.gain);

    oceanSource.connect(oceanFilter);
    oceanFilter.connect(oceanGain);
    oceanGain.connect(this.masterGain!);

    oceanSource.start();
    oceanLfo.start();
    gainLfo.start();
    this.activeNodes.push(oceanSource, oceanLfo, gainLfo, oceanFilter, oceanGain);
  }

  /**
   * 5. 日式神社風鈴音效：清脆日式銅風鈴 + 檜木古宅悠揚空靈禪音
   */
  private synthesizeShrineZen() {
    const ctx = this.ctx!;

    // 輕柔神社庭院微風底音
    const buffer = this.createNoiseBuffer(4);
    const breezeSource = ctx.createBufferSource();
    breezeSource.buffer = buffer;
    breezeSource.loop = true;

    const breezeFilter = ctx.createBiquadFilter();
    breezeFilter.type = 'lowpass';
    breezeFilter.frequency.setValueAtTime(320, ctx.currentTime);

    const breezeGain = ctx.createGain();
    breezeGain.gain.setValueAtTime(0.12, ctx.currentTime);

    breezeSource.connect(breezeFilter);
    breezeFilter.connect(breezeGain);
    breezeGain.connect(this.masterGain!);
    breezeSource.start();
    this.activeNodes.push(breezeSource, breezeFilter, breezeGain);

    // 和風五聲音階銅風鈴 (Japanese Wind Chime Bell Tones)
    const bellPitches = [880, 1046.5, 1318.5, 1568, 1760, 2093]; // A5, C6, E6, G6, A6, C7
    const chimeTimer = window.setInterval(() => {
      if (!this.isRunning) return;
      try {
        const pitch = bellPitches[Math.floor(Math.random() * bellPitches.length)];
        const osc = ctx.createOscillator();
        const harmonic = ctx.createOscillator();
        const gain = ctx.createGain();
        const now = ctx.currentTime;

        osc.type = 'sine';
        osc.frequency.setValueAtTime(pitch, now);

        harmonic.type = 'triangle';
        harmonic.frequency.setValueAtTime(pitch * 2.76, now); // 金屬泛音

        const decay = 1.4 + Math.random() * 0.8;
        gain.gain.setValueAtTime(0.09, now);
        gain.gain.exponentialRampToValueAtTime(0.0005, now + decay);

        osc.connect(gain);
        harmonic.connect(gain);
        gain.connect(this.masterGain!);

        osc.start(now);
        harmonic.start(now);
        osc.stop(now + decay + 0.05);
        harmonic.stop(now + decay + 0.05);
      } catch (e) {}
    }, 1250);

    this.activeIntervals.push(chimeTimer);
  }

  /**
   * 6. 飯店休憩音效：溫暖舒緩 Lounge 鋼琴和弦環境音
   */
  private synthesizeHotelLounge() {
    const ctx = this.ctx!;
    const chords = [
      [261.63, 329.63, 392.0, 493.88], // Cmaj7
      [220.0, 261.63, 329.63, 392.0],  // Am7
      [174.61, 220.0, 261.63, 329.63], // Fmaj7
      [196.0, 246.94, 293.66, 349.23], // G7
    ];

    let chordIdx = 0;
    const loungeTimer = window.setInterval(() => {
      if (!this.isRunning) return;
      try {
        const chord = chords[chordIdx % chords.length];
        chordIdx++;
        chord.forEach((noteFreq, i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          const filter = ctx.createBiquadFilter();
          const now = ctx.currentTime + i * 0.12;

          osc.type = 'triangle';
          osc.frequency.setValueAtTime(noteFreq, now);

          filter.type = 'lowpass';
          filter.frequency.setValueAtTime(550, now);

          gain.gain.setValueAtTime(0, now);
          gain.gain.linearRampToValueAtTime(0.05, now + 0.3);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 2.2);

          osc.connect(filter);
          filter.connect(gain);
          gain.connect(this.masterGain!);

          osc.start(now);
          osc.stop(now + 2.3);
        });
      } catch (e) {}
    }, 2800);

    this.activeIntervals.push(loungeTimer);
  }

  /**
   * 7. 廣場水舞音效：音樂噴泉起伏水花 + 輕快水滴跳泉
   */
  private synthesizeFountainPlaza() {
    const ctx = this.ctx!;
    const buffer = this.createNoiseBuffer(5);

    // 水舞噴泉水花底噪
    const splashSource = ctx.createBufferSource();
    splashSource.buffer = buffer;
    splashSource.loop = true;

    const splashFilter = ctx.createBiquadFilter();
    splashFilter.type = 'bandpass';
    splashFilter.frequency.setValueAtTime(950, ctx.currentTime);
    splashFilter.Q.setValueAtTime(1.5, ctx.currentTime);

    const splashGain = ctx.createGain();
    splashGain.gain.setValueAtTime(0.38, ctx.currentTime);

    splashSource.connect(splashFilter);
    splashFilter.connect(splashGain);
    splashGain.connect(this.masterGain!);
    splashSource.start();
    this.activeNodes.push(splashSource, splashFilter, splashGain);

    // 隨機噴泉水柱起伏與輕巧樂音 (Musical Droplets)
    const tones = [523.25, 659.25, 783.99, 1046.5];
    const fountainTimer = window.setInterval(() => {
      if (!this.isRunning) return;
      try {
        const tone = tones[Math.floor(Math.random() * tones.length)];
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const now = ctx.currentTime;

        osc.type = 'sine';
        osc.frequency.setValueAtTime(tone, now);

        gain.gain.setValueAtTime(0.05, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

        osc.connect(gain);
        gain.connect(this.masterGain!);
        osc.start(now);
        osc.stop(now + 0.36);
      } catch (e) {}
    }, 600);

    this.activeIntervals.push(fountainTimer);
  }

  /**
   * 8. 出發啟程音效：輕快早晨木吉他/木琴音律 + 期待出發節奏
   */
  private synthesizeDepartureTravel() {
    const ctx = this.ctx!;
    const notes = [392.0, 440.0, 523.25, 587.33, 659.25, 783.99]; // G, A, C, D, E, G

    let noteIdx = 0;
    const travelTimer = window.setInterval(() => {
      if (!this.isRunning) return;
      try {
        const note = notes[noteIdx % notes.length];
        noteIdx++;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const now = ctx.currentTime;

        osc.type = 'sine';
        osc.frequency.setValueAtTime(note, now);

        gain.gain.setValueAtTime(0.06, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

        osc.connect(gain);
        gain.connect(this.masterGain!);
        osc.start(now);
        osc.stop(now + 0.48);
      } catch (e) {}
    }, 550);

    this.activeIntervals.push(travelTimer);
  }
}

export const soundscapeEngine = new SoundscapeEngine();

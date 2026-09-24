import { AttractionGuide, OutfitRecommendation, WeatherData } from '../types/itinerary';

export async function parseItineraryText(text: string) {
  const res = await fetch('/api/parse-itinerary', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text }),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || '解析行程失敗');
  }
  return res.json();
}

export async function fetchAttractionGuide(name: string, location?: string): Promise<AttractionGuide> {
  const res = await fetch('/api/attraction-info', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, location }),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || '取得景點介紹失敗');
  }
  return res.json();
}

export async function fetchOutfitRecommendation(
  weather: WeatherData,
  currentSpot?: string,
  upcomingSpots?: string[]
): Promise<OutfitRecommendation> {
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
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || '取得穿搭建議失敗');
  }
  return res.json();
}

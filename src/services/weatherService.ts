import { WeatherData } from '../types/itinerary';

// Convert WMO Weather Interpretation Codes (WW) into Chinese descriptions
export function getWeatherDescription(code: number): { condition: string; icon: string } {
  switch (code) {
    case 0:
      return { condition: '晴朗無雲', icon: 'sun' };
    case 1:
      return { condition: '晴時多雲', icon: 'sun-medium' };
    case 2:
      return { condition: '多雲', icon: 'cloud-sun' };
    case 3:
      return { condition: '陰天', icon: 'cloud' };
    case 45:
    case 48:
      return { condition: '起霧/薄霧', icon: 'cloud-fog' };
    case 51:
    case 53:
    case 55:
      return { condition: '毛毛細雨', icon: 'cloud-drizzle' };
    case 61:
    case 63:
      return { condition: '有小雨或陣雨', icon: 'cloud-rain' };
    case 65:
      return { condition: '大雨/豪雨', icon: 'cloud-rain-wind' };
    case 71:
    case 73:
    case 75:
      return { condition: '降雪', icon: 'snowflake' };
    case 80:
    case 81:
    case 82:
      return { condition: '局部短暫雷雨', icon: 'cloud-lightning' };
    case 95:
    case 96:
    case 99:
      return { condition: '雷陣雨伴隨強風', icon: 'cloud-lightning' };
    default:
      return { condition: '舒適多雲', icon: 'cloud-sun' };
  }
}

export async function fetchWeather(lat: number, lng: number): Promise<WeatherData> {
  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m&hourly=temperature_2m,precipitation_probability,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min,uv_index_max&timezone=auto&forecast_days=2`;

    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`Weather API error: ${res.statusText}`);
    }
    const data = await res.json();

    const current = data.current || {};
    const hourly = data.hourly || { time: [], temperature_2m: [], precipitation_probability: [], weather_code: [] };
    const daily = data.daily || { uv_index_max: [4] };

    const { condition } = getWeatherDescription(current.weather_code ?? 0);

    // Format hourly items (next 6-8 hours)
    const currentHourIndex = new Date().getHours();
    const formattedHourly = (hourly.time || [])
      .slice(currentHourIndex, currentHourIndex + 8)
      .map((t: string, idx: number) => {
        const fullIndex = currentHourIndex + idx;
        const timePart = t.includes('T') ? t.split('T')[1].slice(0, 5) : t;
        return {
          time: timePart,
          temp: Math.round(hourly.temperature_2m?.[fullIndex] ?? current.temperature_2m ?? 22),
          pop: Math.round(hourly.precipitation_probability?.[fullIndex] ?? 10),
          weatherCode: hourly.weather_code?.[fullIndex] ?? 0,
        };
      });

    return {
      temperature: Math.round(current.temperature_2m ?? 24),
      apparentTemperature: Math.round(current.apparent_temperature ?? 24),
      weatherCode: current.weather_code ?? 0,
      condition,
      rainProbability: Math.round(hourly.precipitation_probability?.[currentHourIndex] ?? (current.precipitation > 0 ? 80 : 15)),
      humidity: Math.round(current.relative_humidity_2m ?? 65),
      uvIndex: Math.round(daily.uv_index_max?.[0] ?? 5),
      windSpeed: Math.round(current.wind_speed_10m ?? 12),
      hourly: formattedHourly,
    };
  } catch (err) {
    console.warn('Fallback weather used due to:', err);
    // Reasonable fallback
    return {
      temperature: 24,
      apparentTemperature: 24,
      weatherCode: 1,
      condition: '晴時多雲',
      rainProbability: 20,
      humidity: 62,
      uvIndex: 5,
      windSpeed: 10,
      hourly: [
        { time: '10:00', temp: 24, pop: 10, weatherCode: 1 },
        { time: '12:00', temp: 27, pop: 20, weatherCode: 2 },
        { time: '14:00', temp: 28, pop: 25, weatherCode: 2 },
        { time: '16:00', temp: 26, pop: 30, weatherCode: 3 },
        { time: '18:00', temp: 23, pop: 15, weatherCode: 1 },
      ],
    };
  }
}

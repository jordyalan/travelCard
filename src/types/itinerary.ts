export type CategoryType = 
  | 'culture' 
  | 'food' 
  | 'scenic' 
  | 'shopping' 
  | 'nature' 
  | 'entertainment' 
  | 'other';

export interface ItineraryItem {
  id: string;
  title: string;
  location: string;
  lat: number;
  lng: number;
  time?: string; // Optional legacy or fallback
  durationMinutes?: number; // Cancelled/optional per user request
  category: CategoryType;
  notes?: string;
  completed?: boolean;
  distanceMeters?: number;
  estimatedDriveMinutes?: number;
  estimatedArrivalTime?: string;
}

export interface UserLocation {
  lat: number;
  lng: number;
  accuracy?: number;
  heading?: number | null;
  speed?: number | null;
  timestamp: number;
  isSimulated?: boolean;
  cityName?: string;
}

export interface AttractionGuide {
  name: string;
  summary: string;
  highlights: string[];
  openingHours: string;
  ticketInfo: string;
  estimatedDuration: string;
  photoSpots: string[];
  nearbyFood: string[];
  tips: string[];
  audioGuide: string;
}

export interface WeatherData {
  temperature: number;
  apparentTemperature: number;
  weatherCode: number;
  condition: string;
  rainProbability: number;
  humidity: number;
  uvIndex: number;
  windSpeed: number;
  hourly: Array<{
    time: string;
    temp: number;
    pop: number;
    weatherCode: number;
  }>;
}

export interface OutfitRecommendation {
  headline: string;
  summary: string;
  tags: string[];
  outfit: {
    top: string;
    bottom: string;
    outerwear: string;
    shoes: string;
    accessories: string[];
  };
  practicalTips: string[];
}

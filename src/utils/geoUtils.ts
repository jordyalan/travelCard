import { ItineraryItem } from '../types/itinerary';

/**
 * Calculate distance between two coordinates in meters using Haversine formula
 */
export function calculateDistanceMeters(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371e3; // Earth radius in meters
  const phi1 = (lat1 * Math.PI) / 180;
  const phi2 = (lat2 * Math.PI) / 180;
  const deltaPhi = ((lat2 - lat1) * Math.PI) / 180;
  const deltaLambda = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
    Math.cos(phi1) * Math.cos(phi2) * Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return Math.round(R * c);
}

/**
 * Format meters into readable distance string (e.g., 450 公尺 or 2.3 公里)
 */
export function formatDistance(meters?: number): string {
  if (meters === undefined || meters === null || isNaN(meters)) {
    return '--';
  }
  if (meters < 1000) {
    return `${Math.round(meters)} 公尺`;
  }
  return `${(meters / 1000).toFixed(1)} 公里`;
}

/**
 * Calculate driving time in minutes based on distance
 * Urban/suburban travel model (~30-40 km/h average including traffic buffer)
 */
export function calculateDrivingMinutes(meters?: number): number {
  if (!meters || meters <= 100) return 1;
  if (meters <= 500) return 2;
  if (meters <= 1000) return 3;
  // ~500m per min (30 km/h) + 2 min traffic/intersection lights buffer
  return Math.max(2, Math.round(meters / 500) + 2);
}

/**
 * Format an arrival clock time string (HH:mm) given minutes from now
 */
export function formatArrivalTime(minutesFromNow: number, baseDate = new Date()): string {
  const arrivalDate = new Date(baseDate.getTime() + minutesFromNow * 60 * 1000);
  const hours = String(arrivalDate.getHours()).padStart(2, '0');
  const minutes = String(arrivalDate.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
}

/**
 * Estimate travel time string for display (e.g., "行車約 8 分鐘")
 */
export function estimateTravelTime(meters?: number): string {
  if (meters === undefined || meters === null || isNaN(meters)) {
    return '--';
  }
  const driveMins = calculateDrivingMinutes(meters);
  return `行車約 ${driveMins} 分鐘`;
}

/**
 * Compute sequential arrival times and driving durations dynamically from current GPS
 */
export function computeDynamicSchedule(
  items: ItineraryItem[],
  userLat: number,
  userLng: number,
  baseDate = new Date()
): ItineraryItem[] {
  let cumulativeMinutes = 0;
  let previousLat = userLat;
  let previousLng = userLng;
  let isFirstUncompleted = true;

  return items.map((item) => {
    // Direct distance from user's current GPS location
    const distanceFromUser = calculateDistanceMeters(userLat, userLng, item.lat, item.lng);

    if (item.completed) {
      return {
        ...item,
        distanceMeters: distanceFromUser,
        estimatedDriveMinutes: 0,
        estimatedArrivalTime: '已造訪',
      };
    }

    if (isFirstUncompleted) {
      // First uncompleted stop: travel directly from user's current GPS
      const driveMins = calculateDrivingMinutes(distanceFromUser);
      cumulativeMinutes += driveMins;
      isFirstUncompleted = false;
      previousLat = item.lat;
      previousLng = item.lng;

      return {
        ...item,
        distanceMeters: distanceFromUser,
        estimatedDriveMinutes: driveMins,
        estimatedArrivalTime: formatArrivalTime(cumulativeMinutes, baseDate),
      };
    } else {
      // Subsequent stop: travel from previous stop
      const legDistance = calculateDistanceMeters(previousLat, previousLng, item.lat, item.lng);
      const legDriveMins = calculateDrivingMinutes(legDistance);
      cumulativeMinutes += legDriveMins;
      previousLat = item.lat;
      previousLng = item.lng;

      return {
        ...item,
        distanceMeters: distanceFromUser,
        estimatedDriveMinutes: legDriveMins,
        estimatedArrivalTime: formatArrivalTime(cumulativeMinutes, baseDate),
      };
    }
  });
}

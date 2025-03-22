import { WeatherDataSeries } from "../state/WeatherData.state";

// Types for API responses
export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface WeatherApiResponse {
  product: string;
  init: string;
  dataseries: WeatherDataSeries[];
}

/**
 * Gets the current geolocation coordinates from the browser
 * @returns Promise with the latitude and longitude coordinates
 */
export const getCoordinates = (): Promise<Coordinates> => {
  return new Promise<Coordinates>((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        resolve({ latitude, longitude });
      },
      (error) => {
        reject(error);
      }
    );
  });
};

/**
 * Fetches weather data from the 7timer API
 * @param coordinates - The latitude and longitude coordinates
 * @param product - The product type ('civil' or 'civillight')
 * @returns Promise with the weather data
 */
export const fetchWeatherData = async (
  coordinates: Coordinates,
  product: "civil" | "civillight"
): Promise<WeatherApiResponse> => {
  const { latitude, longitude } = coordinates;
  const url = `http://www.7timer.info/bin/api.pl?lon=${longitude}&lat=${latitude}&product=${product}&output=json`;
  
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch ${product} weather data: ${response.statusText}`);
  }
  
  return await response.json();
};

/**
 * Fetches all weather data needed for the application
 * @returns Promise with both civil and civillight weather data
 */
export const fetchAllWeatherData = async (): Promise<{
  civilData: WeatherApiResponse;
  civilLightData: WeatherApiResponse;
}> => {
  try {
    // Get coordinates first
    const coordinates = await getCoordinates();
    
    // Fetch both sets of weather data in parallel
    const [civilData, civilLightData] = await Promise.all([
      fetchWeatherData(coordinates, "civil"),
      fetchWeatherData(coordinates, "civillight")
    ]);
    
    return {
      civilData,
      civilLightData
    };
  } catch (error) {
    console.error("Error fetching weather data:", error);
    throw error;
  }
};


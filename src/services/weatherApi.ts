import { WeatherDataSeries } from '../state/WeatherData.state';

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
 * Detects if the browser is Microsoft Edge
 */
const isEdge = (): boolean => {
  return /Edg/i.test(navigator.userAgent);
};

/**
 * Detects if the operating system is macOS
 */
const isMacOS = (): boolean => {
  return (
    /Mac|iPhone|iPad|iPod/.test(navigator.platform) ||
    /MacIntel/.test(navigator.platform) ||
    (navigator.platform === 'unknown' && /Mac/.test(navigator.userAgent))
  );
};

/**
 * Checks if the current browser/OS combination has known geolocation issues
 */
const hasKnownGeolocationIssues = (): {
  hasIssues: boolean;
  reason: string;
} => {
  const browserIsEdge = isEdge();
  const osIsMacOS = isMacOS();

  // Edge on macOS has documented geolocation API issues
  if (browserIsEdge && osIsMacOS) {
    return {
      hasIssues: true,
      reason:
        'Microsoft Edge on macOS has known issues with the geolocation API',
    };
  }

  // Add other known problematic combinations here if discovered
  // Example: Safari on iOS in private mode, etc.

  return {
    hasIssues: false,
    reason: '',
  };
};

/**
 * Gets the current geolocation coordinates from the browser with Edge-specific handling
 * @returns Promise with the latitude and longitude coordinates
 */
export const getCoordinates = (): Promise<Coordinates> => {
  return new Promise<Coordinates>((resolve, reject) => {
    // Check if geolocation is supported
    if (!navigator.geolocation) {
      console.error('Geolocation is not supported by this browser');
      reject(new Error('Geolocation is not supported by this browser'));
      return;
    }

    console.log('Attempting to get geolocation...');
    const browserIsEdge = isEdge();
    console.log('Browser is Edge:', browserIsEdge);

    // Check permissions first (if supported)
    if (navigator.permissions) {
      navigator.permissions
        .query({ name: 'geolocation' })
        .then((result) => {
          console.log('Geolocation permission state:', result.state);
        })
        .catch((err) => {
          console.log('Could not check geolocation permission:', err);
        });
    }

    let watchId: number | null = null;
    let resolved = false;
    let attempts = 0;
    const maxAttempts = browserIsEdge ? 3 : 1;

    const cleanup = () => {
      if (watchId !== null) {
        navigator.geolocation.clearWatch(watchId);
        watchId = null;
      }
    };

    const handleSuccess = (position: GeolocationPosition) => {
      if (resolved) return;
      resolved = true;
      cleanup();

      const { latitude, longitude } = position.coords;
      console.log('Successfully got coordinates:', { latitude, longitude });
      resolve({ latitude, longitude });
    };

    const handleError = (error: GeolocationPositionError, method: string) => {
      if (resolved) return;

      console.error(`Geolocation error (${method}):`, error);
      console.error('Error code:', error.code);
      console.error('Error message:', error.message);

      attempts++;

      // For Edge, try multiple approaches
      if (browserIsEdge && attempts < maxAttempts) {
        console.log(
          `Edge attempt ${attempts} failed, trying different approach...`
        );

        // Try different combinations for Edge
        if (attempts === 1 && method === 'getCurrentPosition') {
          // Second attempt: try watchPosition with very loose settings
          console.log('Edge: Trying watchPosition with loose settings...');
          watchId = navigator.geolocation.watchPosition(
            handleSuccess,
            (watchError) => handleError(watchError, 'watchPosition-loose'),
            {
              enableHighAccuracy: false,
              timeout: 30000, // Very long timeout
              maximumAge: 3600000, // Accept 1-hour-old location
            }
          );

          setTimeout(() => {
            if (!resolved && attempts === 1) {
              attempts++;
              cleanup();
              tryLastResort();
            }
          }, 30000);
          return;
        } else if (attempts === 2) {
          cleanup();
          tryLastResort();
          return;
        }
      }

      resolved = true;
      cleanup();
      finalError(error);
    };

    const tryLastResort = () => {
      if (resolved) return;

      console.log('Edge: Trying last resort with minimal settings...');

      // Last resort: minimal settings, short timeout
      navigator.geolocation.getCurrentPosition(
        handleSuccess,
        (error) => {
          resolved = true;
          finalError(error);
        },
        {
          enableHighAccuracy: false,
          timeout: 5000, // Very short timeout
          maximumAge: 86400000, // Accept 24-hour-old location
        }
      );
    };

    const finalError = (error: GeolocationPositionError) => {
      // Handle different geolocation errors
      switch (error.code) {
        case error.PERMISSION_DENIED:
          reject(new Error('Location access denied by user'));
          break;
        case error.POSITION_UNAVAILABLE:
          reject(
            new Error(
              'Location information is unavailable - this is a known Edge on macOS issue'
            )
          );
          break;
        case error.TIMEOUT:
          reject(new Error('Location request timed out'));
          break;
        default:
          reject(
            new Error(
              `An unknown error occurred while retrieving location: ${error.message}`
            )
          );
          break;
      }
    };

    // Primary attempt with getCurrentPosition
    navigator.geolocation.getCurrentPosition(
      handleSuccess,
      (error) => handleError(error, 'getCurrentPosition'),
      {
        enableHighAccuracy: !browserIsEdge, // Disable high accuracy for Edge
        timeout: browserIsEdge ? 20000 : 10000, // Longer timeout for Edge
        maximumAge: 300000,
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
  product: 'civil' | 'civillight'
): Promise<WeatherApiResponse> => {
  const { latitude, longitude } = coordinates;
  const url = `https://www.7timer.info/bin/api.pl?lon=${longitude}&lat=${latitude}&product=${product}&output=json`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(
      `Failed to fetch ${product} weather data: ${response.statusText}`
    );
  }

  return await response.json();
};

/**
 * Gets location from IP address as a fallback
 * @returns Promise with approximate coordinates based on IP
 */
const getLocationFromIP = async (): Promise<Coordinates> => {
  try {
    // Try ipapi.co first
    const response = await fetch('https://ipapi.co/json/');

    if (response.ok) {
      const data = await response.json();
      if (data.latitude && data.longitude && !data.error) {
        console.log('Successfully obtained location from IP:', {
          latitude: data.latitude,
          longitude: data.longitude,
        });
        return {
          latitude: data.latitude,
          longitude: data.longitude,
        };
      }
    }
  } catch (error) {
    console.warn('IP geolocation service failed:', error);
  }

  // If IP geolocation fails, throw error so fallback coordinates are used
  throw new Error('IP-based geolocation failed');
};

/**
 * Gets the current geolocation coordinates from the browser with fallback
 * @returns Promise with coordinates and fallback information
 */
export const getCoordinatesWithFallback = async (): Promise<{
  coordinates: Coordinates;
  isFromFallback: boolean;
  method: string;
  reason?: string;
}> => {
  const knownIssues = hasKnownGeolocationIssues();

  // For browser/OS combinations with known geolocation issues,
  // skip browser geolocation and go directly to IP-based geolocation
  if (knownIssues.hasIssues) {
    console.log(
      `Known geolocation issue detected: ${knownIssues.reason}. Using IP-based geolocation.`
    );

    try {
      const coordinates = await getLocationFromIP();
      return {
        coordinates,
        isFromFallback: true,
        method: 'ip-geolocation',
        reason: knownIssues.reason,
      };
    } catch (ipError) {
      console.warn(
        'IP-based geolocation failed for known problematic browser/OS:',
        ipError
      );

      // Final fallback to Copenhagen coordinates
      console.log(
        'Using Copenhagen coordinates as final fallback for known problematic browser/OS'
      );
      return {
        coordinates: {
          latitude: 55.7167,
          longitude: 12.4381,
        },
        isFromFallback: true,
        method: 'hardcoded-fallback',
        reason: `${knownIssues.reason}. IP geolocation also failed.`,
      };
    }
  }

  // For all other browser/OS combinations, try browser geolocation first
  try {
    const coordinates = await getCoordinates();
    return {
      coordinates,
      isFromFallback: false,
      method: 'browser-geolocation',
    };
  } catch (browserError) {
    console.warn('Browser geolocation failed:', browserError);

    // Check if it's a permission denied error
    const isPermissionDenied =
      browserError instanceof Error &&
      browserError.message.includes('Location access denied by user');

    const fallbackReason = isPermissionDenied
      ? 'Location access was denied. Using approximate location based on your IP address instead.'
      : 'Browser geolocation failed. Using approximate location based on your IP address instead.';

    // Try IP-based location as fallback
    try {
      console.log('Trying IP-based geolocation as fallback...');
      const coordinates = await getLocationFromIP();
      return {
        coordinates,
        isFromFallback: true,
        method: 'ip-geolocation',
        reason: fallbackReason,
      };
    } catch (ipError) {
      console.warn('IP-based geolocation also failed:', ipError);
    }

    // Final fallback to Copenhagen coordinates
    const finalReason = isPermissionDenied
      ? 'Location access was denied and IP-based location failed. Using Copenhagen, Denmark as default location.'
      : 'All geolocation methods failed. Using Copenhagen, Denmark as default location.';

    console.warn(
      'All geolocation methods failed. Using Copenhagen coordinates as final fallback.'
    );
    return {
      coordinates: {
        latitude: 55.7167,
        longitude: 12.4381,
      },
      isFromFallback: true,
      method: 'hardcoded-fallback',
      reason: finalReason,
    };
  }
};

/**
 * Fetches all weather data needed for the application
 * @returns Promise with both civil and civillight weather data plus location info
 */
export const fetchAllWeatherData = async (): Promise<{
  civilData: WeatherApiResponse;
  civilLightData: WeatherApiResponse;
  coordinates: Coordinates;
  isFromFallback: boolean;
  method: string;
  reason?: string;
}> => {
  try {
    // Get coordinates first (with fallback info)
    const locationData = await getCoordinatesWithFallback();
    const { coordinates } = locationData;

    // Fetch both sets of weather data in parallel
    const [civilData, civilLightData] = await Promise.all([
      fetchWeatherData(coordinates, 'civil'),
      fetchWeatherData(coordinates, 'civillight'),
    ]);

    return {
      civilData,
      civilLightData,
      coordinates: locationData.coordinates,
      isFromFallback: locationData.isFromFallback,
      method: locationData.method,
      reason: locationData.reason,
    };
  } catch (error) {
    console.error('Error fetching weather data:', error);
    throw error;
  }
};

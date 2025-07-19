import React, { useState, useEffect } from 'react';
import { useSharedWeatherDataState } from '../state/WeatherData.state';

export const GeolocationDebug: React.FC = () => {
  const {
    coordinates: appCoordinates,
    isUsingFallbackLocation,
    fallbackReason,
  } = useSharedWeatherDataState();

  const [status, setStatus] = useState<string>('Checking...');
  const [coordinates, setCoordinates] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [permissionState, setPermissionState] = useState<string>('Unknown');
  const [methods, setMethods] = useState<string[]>([]);

  const isEdge = (): boolean => {
    return /Edg/i.test(navigator.userAgent);
  };

  const testGeolocation = () => {
    setStatus('Testing geolocation...');
    setError(null);
    setCoordinates(null);
    setMethods([]);

    const browserIsEdge = isEdge();
    console.log('Testing - Browser is Edge:', browserIsEdge);

    // Check if geolocation is supported
    if (!navigator.geolocation) {
      setStatus('Not supported');
      setError('Geolocation is not supported by this browser');
      return;
    }

    // Check permissions if supported
    if (navigator.permissions) {
      navigator.permissions
        .query({ name: 'geolocation' })
        .then((result) => {
          setPermissionState(result.state);
          console.log('Permission state:', result.state);
        })
        .catch((err) => {
          setPermissionState('Could not check');
          console.log('Could not check permission:', err);
        });
    }

    let watchId: number | null = null;
    let resolved = false;

    const cleanup = () => {
      if (watchId !== null) {
        navigator.geolocation.clearWatch(watchId);
        watchId = null;
      }
    };

    const handleSuccess = (position: GeolocationPosition, method: string) => {
      if (resolved) return;
      resolved = true;
      cleanup();

      const { latitude, longitude } = position.coords;
      setCoordinates({ latitude, longitude });
      setStatus(`Success via ${method}!`);
      setMethods((prev) => [...prev, `${method} - SUCCESS`]);
      console.log('Got coordinates via', method, { latitude, longitude });
    };

    const handleError = (error: GeolocationPositionError, method: string) => {
      if (resolved) return;

      console.error(`Geolocation error (${method}):`, error);
      setMethods((prev) => [
        ...prev,
        `${method} - FAILED (code ${error.code})`,
      ]);

      // For Edge, try watchPosition if getCurrentPosition fails
      if (
        browserIsEdge &&
        method === 'getCurrentPosition' &&
        error.code === 2
      ) {
        console.log('Edge getCurrentPosition failed, trying watchPosition...');
        setStatus('Trying Edge workaround with watchPosition...');

        watchId = navigator.geolocation.watchPosition(
          (pos) => handleSuccess(pos, 'watchPosition'),
          (watchError) => handleError(watchError, 'watchPosition'),
          {
            enableHighAccuracy: false,
            timeout: 15000,
            maximumAge: 600000,
          }
        );

        // Cleanup after timeout
        setTimeout(() => {
          if (!resolved) {
            resolved = true;
            cleanup();
            finalError(error);
          }
        }, 15000);
        return;
      }

      resolved = true;
      cleanup();
      finalError(error);
    };

    const finalError = (error: GeolocationPositionError) => {
      setStatus('Failed');

      switch (error.code) {
        case error.PERMISSION_DENIED:
          setError(`Permission denied: ${error.message}`);
          break;
        case error.POSITION_UNAVAILABLE:
          setError(`Position unavailable: ${error.message}`);
          break;
        case error.TIMEOUT:
          setError(`Timeout: ${error.message}`);
          break;
        default:
          setError(`Unknown error (${error.code}): ${error.message}`);
          break;
      }
    };

    // Test getCurrentPosition
    setMethods(['Testing getCurrentPosition...']);
    navigator.geolocation.getCurrentPosition(
      (pos) => handleSuccess(pos, 'getCurrentPosition'),
      (error) => handleError(error, 'getCurrentPosition'),
      {
        enableHighAccuracy: !browserIsEdge, // Disable high accuracy for Edge
        timeout: browserIsEdge ? 15000 : 10000,
        maximumAge: 300000,
      }
    );
  };

  useEffect(() => {
    testGeolocation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6 shadow-sm">
      <h3 className="text-lg font-semibold mb-3 text-gray-800 flex items-center">
        <span className="mr-2">🔍</span>
        Geolocation Debug Panel
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
        <div>
          <p>
            <strong className="text-gray-700">Status:</strong>{' '}
            <span
              className={
                status.includes('Success')
                  ? 'text-green-600'
                  : status.includes('Failed')
                  ? 'text-red-600'
                  : 'text-yellow-600'
              }
            >
              {status}
            </span>
          </p>
          <p>
            <strong className="text-gray-700">Permission:</strong>{' '}
            <span
              className={
                permissionState === 'granted'
                  ? 'text-green-600'
                  : permissionState === 'denied'
                  ? 'text-red-600'
                  : 'text-yellow-600'
              }
            >
              {permissionState}
            </span>
          </p>
          <p>
            <strong className="text-gray-700">Is Edge:</strong>{' '}
            {isEdge() ? '✅ Yes' : '❌ No'}
          </p>
          <p>
            <strong className="text-gray-700">Protocol:</strong>{' '}
            {window.location.protocol}
          </p>
        </div>

        <div>
          {coordinates && (
            <div>
              <p>
                <strong className="text-gray-700">Coordinates:</strong>
              </p>
              <p className="text-xs text-gray-600">
                Lat: {coordinates.latitude.toFixed(6)}
              </p>
              <p className="text-xs text-gray-600">
                Lng: {coordinates.longitude.toFixed(6)}
              </p>
            </div>
          )}

          {error && (
            <div className="text-red-600">
              <p>
                <strong>Error:</strong>
              </p>
              <p className="text-xs break-words">{error}</p>
            </div>
          )}
        </div>
      </div>

      {/* Current App Location Status */}
      {appCoordinates && (
        <div className="mt-4 pt-3 border-t border-gray-200">
          <p>
            <strong className="text-gray-700">Current App Location:</strong>
          </p>
          <div className="mt-2 text-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <div>
                <p className="text-xs text-gray-600">
                  <strong>Coordinates:</strong>{' '}
                  {appCoordinates.latitude.toFixed(4)},{' '}
                  {appCoordinates.longitude.toFixed(4)}
                </p>
                <p className="text-xs">
                  <strong>Method:</strong>{' '}
                  <span
                    className={
                      isUsingFallbackLocation
                        ? 'text-orange-600'
                        : 'text-green-600'
                    }
                  >
                    {isUsingFallbackLocation ? 'IP/Fallback' : 'Browser GPS'}
                    {isUsingFallbackLocation ? ' 🔄' : ' 📍'}
                  </span>
                </p>
              </div>
              <div>
                {fallbackReason && (
                  <p className="text-xs text-blue-700 bg-blue-50 p-2 rounded">
                    <strong>Reason:</strong> {fallbackReason}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {methods.length > 0 && (
        <div className="mt-3 pt-3 border-t border-gray-200">
          <p>
            <strong className="text-gray-700">Methods Attempted:</strong>
          </p>
          <div className="flex flex-wrap gap-1 mt-1">
            {methods.map((method, index) => (
              <span
                key={index}
                className={`px-2 py-1 rounded text-xs ${
                  method.includes('SUCCESS')
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}
              >
                {method
                  .replace(' - SUCCESS', ' ✅')
                  .replace(' - FAILED', ' ❌')}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="mt-4 flex justify-between items-center">
        <button
          onClick={testGeolocation}
          className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600 transition-colors"
        >
          🔄 Test Again
        </button>
        <p className="text-xs text-gray-500">
          Browser: {navigator.userAgent.split(' ').slice(-2).join(' ')}
        </p>
      </div>
    </div>
  );
};

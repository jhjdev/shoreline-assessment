import React, { useState, useEffect } from 'react';

export const GeolocationDebug: React.FC = () => {
  const [status, setStatus] = useState<string>('Checking...');
  const [coordinates, setCoordinates] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [permissionState, setPermissionState] = useState<string>('Unknown');

  const testGeolocation = () => {
    setStatus('Testing geolocation...');
    setError(null);
    setCoordinates(null);

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

    // Test getCurrentPosition
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setCoordinates({ latitude, longitude });
        setStatus('Success!');
        console.log('Got coordinates:', { latitude, longitude });
      },
      (error) => {
        console.error('Geolocation error:', error);
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
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000,
      }
    );
  };

  useEffect(() => {
    testGeolocation();
  }, []);

  return (
    <div className="bg-yellow-100 border border-yellow-300 rounded-lg p-4 mb-6">
      <h3 className="text-lg font-semibold mb-2">Geolocation Debug</h3>
      <div className="space-y-2">
        <p>
          <strong>Status:</strong> {status}
        </p>
        <p>
          <strong>Permission State:</strong> {permissionState}
        </p>
        <p>
          <strong>Browser:</strong> {navigator.userAgent}
        </p>
        <p>
          <strong>Protocol:</strong> {window.location.protocol}
        </p>
        <p>
          <strong>Host:</strong> {window.location.host}
        </p>

        {coordinates && (
          <div>
            <p>
              <strong>Coordinates:</strong>
            </p>
            <p>Latitude: {coordinates.latitude}</p>
            <p>Longitude: {coordinates.longitude}</p>
          </div>
        )}

        {error && (
          <div className="text-red-600">
            <p>
              <strong>Error:</strong> {error}
            </p>
          </div>
        )}

        <button
          onClick={testGeolocation}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Test Again
        </button>
      </div>
    </div>
  );
};

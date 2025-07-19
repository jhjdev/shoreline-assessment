import React, { useState, useEffect } from 'react';

interface LocationNotificationProps {
  coordinates: { latitude: number; longitude: number };
  isFromFallback: boolean;
  reason?: string;
}

export const LocationNotification: React.FC<LocationNotificationProps> = ({
  coordinates,
  isFromFallback,
  reason,
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isFromFallback) {
      setIsVisible(true);
      // Auto-hide after 12 seconds to allow reading the longer message
      const timer = setTimeout(() => setIsVisible(false), 12000);
      return () => clearTimeout(timer);
    }
  }, [isFromFallback]);

  if (!isVisible || !isFromFallback) {
    return null;
  }

  const locationName =
    coordinates.latitude === 55.7167 && coordinates.longitude === 12.4381
      ? 'Copenhagen, Denmark'
      : `${coordinates.latitude.toFixed(4)}, ${coordinates.longitude.toFixed(
          4
        )}`;

  // Use the provided reason or fall back to a generic message
  const displayMessage =
    reason || 'Using approximate location based on your IP address.';

  // Check if this is an Edge on macOS issue to provide more specific messaging
  const isEdgeMacOSIssue = reason?.includes('Microsoft Edge on macOS');

  const getDisplayMessage = () => {
    if (isEdgeMacOSIssue) {
      return (
        <>
          <span className="font-medium">Microsoft Edge on macOS</span> has known
          issues with precise location detection.
          <br />
          <span className="text-blue-600">
            We&apos;re using your IP address instead
          </span>{' '}
          to provide an approximate location for weather data.
        </>
      );
    }
    return displayMessage;
  };

  const accuracyNote =
    isEdgeMacOSIssue || reason?.includes('IP address')
      ? 'IP-based location is less accurate than GPS but sufficient for weather forecasts.'
      : null;

  return (
    <div className="fixed top-4 right-4 bg-blue-100 border border-blue-300 rounded-lg p-4 max-w-sm shadow-lg z-50">
      <div className="flex justify-between items-start">
        <div>
          <h4 className="text-sm font-semibold text-blue-800 mb-1">
            Location Notice
          </h4>
          <p className="text-sm text-blue-700 mb-2">{getDisplayMessage()}</p>
          <p className="text-xs text-blue-600">
            <strong>Location:</strong> {locationName}
          </p>
          {accuracyNote && (
            <p className="text-xs text-blue-500 mt-1 italic">{accuracyNote}</p>
          )}
        </div>
        <button
          onClick={() => setIsVisible(false)}
          className="text-blue-500 hover:text-blue-700 ml-2"
          aria-label="Close notification"
        >
          ×
        </button>
      </div>
    </div>
  );
};

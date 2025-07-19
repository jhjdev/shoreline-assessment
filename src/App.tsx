import Router from './routes/Routes';
import { BrowserRouter } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import './App.css';
import { useSharedWeatherDataState } from './state/WeatherData.state';
import { useEffect } from 'react';
import { SpinnerComponent } from './components/Spinner';
import { fetchAllWeatherData } from './services/weatherApi';
import { LocationNotification } from './components/LocationNotification';
import { GeolocationDebug } from './components/GeolocationDebugNew';

function App() {
  const {
    setInit,
    setData,
    setSevenDaysInit,
    setSevenDaysData,
    loading,
    setLoading,
    setError,
    error,
    coordinates,
    isUsingFallbackLocation,
    fallbackReason,
    setCoordinates,
    setIsUsingFallbackLocation,
    setFallbackReason,
    debugMode,
  } = useSharedWeatherDataState();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const weatherData = await fetchAllWeatherData();

        setData(weatherData.civilData?.dataseries || null);
        setInit(weatherData.civilData?.init || null);
        setSevenDaysData(weatherData.civilLightData?.dataseries || null);
        setSevenDaysInit(weatherData.civilLightData?.init || null);
        setCoordinates(weatherData.coordinates);
        setIsUsingFallbackLocation(weatherData.isFromFallback);
        setFallbackReason(weatherData.reason);
        setLoading(false);
      } catch (err: unknown) {
        console.error('Error fetching weather data:', err);
        const errorMessage =
          err instanceof Error ? err.message : 'Failed to fetch weather data';
        setError(new Error(errorMessage));
        setLoading(false);
      }
    };

    fetchData();
  }, [
    setData,
    setError,
    setInit,
    setLoading,
    setSevenDaysData,
    setSevenDaysInit,
    setCoordinates,
    setIsUsingFallbackLocation,
    setFallbackReason,
  ]);

  if (loading) {
    return <SpinnerComponent size={105} />;
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
        <p className="text-gray-700 mb-4">{error.message}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <main className="flex flex-col h-screen w-screen">
        {coordinates && (
          <LocationNotification
            coordinates={coordinates}
            isFromFallback={isUsingFallbackLocation}
            reason={fallbackReason}
          />
        )}
        <div className="flex flex-1 overflow-hidden">
          <Sidebar />
          <div className="flex flex-1">
            {/* <div className="flex bg-gray-300 h-16 p-4">Header</div> */}
            <div className="flex flex-1 overflow-y-auto px-4">
              <div className="w-full">
                {debugMode && <GeolocationDebug />}
                <Router />
              </div>
            </div>
          </div>
        </div>
      </main>
    </BrowserRouter>
  );
}

export default App;

import { useSharedWeatherDataState } from "../state/WeatherData.state";

export default function WeatherNow() {
  const { data, init } = useSharedWeatherDataState();

  if (!data || !init) {
    return <div>No weather data available</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Current Weather</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {data.slice(0, 1).map((weather) => (
          <div
            key={weather.timepoint}
            className="bg-white rounded-lg shadow p-6"
          >
            <h2 className="text-xl font-semibold mb-4">
              Temperature: {weather.temp2m}°C
            </h2>
            <div className="space-y-2">
              <p>Cloud Cover: {weather.cloudcover}%</p>
              <p>Humidity: {weather.rh2m}%</p>
              <p>
                Precipitation: {weather.prec_amount}mm ({weather.prec_type})
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

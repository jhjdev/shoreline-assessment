import { useSharedWeatherDataState } from "../state/WeatherData.state";

export default function SevenDayForecast() {
  const { sevenDaysData, sevenDaysInit } = useSharedWeatherDataState();

  if (!sevenDaysData || !sevenDaysInit) {
    return <div>No forecast data available</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">7-Day Forecast</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {sevenDaysData.map((weather) => (
          <div
            key={weather.timepoint}
            className="bg-white rounded-lg shadow p-6"
          >
            <h2 className="text-xl font-semibold mb-4">
              Day {Math.floor(weather.timepoint / 24)}
            </h2>
            <div className="space-y-2">
              <p>Temperature: {weather.temp2m}°C</p>
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

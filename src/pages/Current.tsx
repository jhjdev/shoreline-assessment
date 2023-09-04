import { useSharedWeatherDataState } from "../state/WeatherData.state";
import { newCalculatedDate } from "../hooks/dateParser";

const CurrentWeather = () => {
  const { data, init, error } = useSharedWeatherDataState();
  // Only map the current day and disaply the weather info during the day.
  const currentDay = data.slice(0, 8);

  return (
    <>
      <div className="container max-w-full mt-2">
        <div className="grid grid-cols-1 gap-3 justify-evenly m-2">
          <h2 className="text-2xl text-blue-900 dark:text-white">
            24 Hour Weather Forecast:
          </h2>
        </div>
        {error ? (
          <div className="grid grid-cols-4 gap-4 justify-evenly m-2">
            <p>Error fetching weather data:</p>) : {data.length === 0} ? (
            <p>No weather data at the moment</p>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-3 justify-evenly m-3">
            {currentDay.map((x, index) => (
              <div className="rounded-lg" key={index}>
                <div className="justify-center center-items">
                  <div className="max-w-md rounded-3xl p-px bg-gradient-to-b from-blue-300 to-pink-300">
                    <div className="rounded-[calc(1.5rem-1px)] p-10 bg-white">
                      <div className="flex gap-4 items-center">
                        <p>
                          <span className="text-slate-950 dark:text-slate-950">
                            Time:
                          </span>
                          <span className="text-red-700">
                            {newCalculatedDate(init, x?.timepoint)}
                          </span>
                          <br />
                          <span className="text-slate-950 dark:text-slate-950">
                            Cloudcover:
                          </span>
                          <span className="text-red-700">{x?.cloudcover}</span>
                          <br />
                          <span className="text-slate-950 dark:text-slate-950">
                            Lifted Index:
                          </span>
                          <span className="text-red-700">
                            {x?.lifted_index}
                          </span>
                          <br />
                          <span className="text-slate-950 dark:text-slate-950">
                            Precipitation Amount:
                          </span>
                          <span className="text-red-700">{x?.prec_amount}</span>
                          <br />
                          <span className="text-slate-950 dark:text-slate-950">
                            2m Temperature:
                          </span>
                          <span className="text-red-900">{x?.temp2m}</span>
                          <br />
                          <span className="text-slate-950 dark:text-slate-950">
                            2m Relative Humidity:
                          </span>
                          <span className="text-red-900">{x?.rh2m}</span>
                          <br />
                          <span className="text-slate-950 dark:text-slate-950">
                            10m Wind Direction:
                          </span>
                          <span className="text-red-900">
                            {x?.wind10m.direction}
                          </span>
                          <br />
                          <span className="text-slate-950 dark:text-slate-950">
                            10m Wind Speed:
                          </span>
                          <span className="text-red-900">
                            {x?.wind10m.speed}
                          </span>
                          <br />
                          <span className="text-slate-950 dark:text-slate-950">
                            Weather Type:
                          </span>
                          <span className="text-red-900">{x.weather}</span>
                          <br />
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default CurrentWeather;

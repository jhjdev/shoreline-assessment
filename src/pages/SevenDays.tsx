import { parseSevenDaysDate } from '../hooks/dateParser';
import { useSharedWeatherDataState } from '../state/WeatherData.state';

const SevenDaysForecast = () => {
  const { sevenDaysData, error } = useSharedWeatherDataState();

  // In the API, init gives you an inital date, and timepoint
  // gives you the next 3 hours.
  // I did manage to write what I think is the beginning of a
  // suitable date parser so that I could in theory use just
  // CIVIL instead of CIVILLIGHT for the 7 days forecast.
  // But CIVILLIGHT has much much better data for the 7 day
  // forecast than CIVIL does.

  return (
    <>
      <div className="container max-w-full mt-2">
        <div className="grid grid-cols-1 gap-4 justify-evenly m-2">
          <h2 className="text-2xl text-blue-900 dark:text-white">
            7 Day Weather Forecast:
          </h2>
        </div>
        {error ? (
          <div className="grid grid-cols-4 gap-4 justify-evenly m-2">
            <p>Error fetching weather data:</p>
          </div>
        ) : !sevenDaysData || sevenDaysData.length === 0 ? (
          <div className="grid grid-cols-4 gap-4 justify-evenly m-2">
            <p>No weather data at the moment</p>
          </div>
        ) : (
          <div className="grid grid-cols-4 gap-4 justify-evenly m-2">
            {sevenDaysData.map((x, index) => (
              <div className="rounded-lg" key={index}>
                <div className="justify-center center-items">
                  <div className="max-w-md rounded-3xl p-px bg-gradient-to-b from-blue-300 to-pink-300">
                    <div className="rounded-[calc(1.5rem-1px)] p-10 bg-white">
                      <div className="flex gap-4 items-center">
                        <p>
                          <span className="text-slate-950 dark:text-slate-950">
                            Date:
                          </span>
                          <br />
                          <span className="text-red-700">
                            {parseSevenDaysDate(x?.date)}
                          </span>
                          <br />
                          <span className="text-slate-950 dark:text-slate-950">
                            Highest Temperature:
                          </span>
                          <span className="text-red-900">
                            {typeof x?.temp2m === 'object'
                              ? x?.temp2m.max
                              : x?.temp2m}
                            ˚
                          </span>
                          <br />
                          <span className="text-slate-950 dark:text-slate-950">
                            Lowest Temperature:
                          </span>
                          <span className="text-red-900">
                            {typeof x?.temp2m === 'object'
                              ? x?.temp2m.min
                              : 'N/A'}
                            ˚
                          </span>
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

export default SevenDaysForecast;

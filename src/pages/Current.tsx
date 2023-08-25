import { useEffect, useState } from "react";

const CurrentWeather = () => {
  const [lat, setLat] = useState<number | []>();
  const [long, setLong] = useState<number | []>();
  const [error, setError] = useState();
  const [data, setData] = useState<any[]>([]);
  const [init, setInit] = useState(new Date());

  // I don't normally use any when I am typing out my code.
  // But this was the quickest way to get everything to display.
  // Normally I'd use interfaces and unkown, but that was
  // throwing errors I didn't have time to look at in further detail.

  // The states could probably be initated by a simple state management tool
  // such as useContext or useBetween, since each component is only showing
  // a different variation of the same data.

  useEffect(() => {
    const fetchData = async () => {
      navigator.geolocation.getCurrentPosition(function (position) {
        setLat(position.coords.latitude);
        setLong(position.coords.longitude);

        console.log("Latitude is:", lat);
        console.log("Longitude is:", long);
      });

      const url =
        "https://www.7timer.info/bin/civil.php?lon=" +
        long +
        "&lat=" +
        lat +
        "&ac=0&unit=metric&output=json&tzshift=0";

      try {
        const response = await fetch(url);
        const json = await response.json();
        console.log("Weather:", json?.dataseries);
        setData(json?.dataseries);
        setInit(json?.init);
      } catch (error: any) {
        console.log("error", error);
        setError(error);
      }
    };
    fetchData();
  }, [lat, long]);

  // Only map the current day and disaply the weather info during the day.
  const currentDay = data.slice(0, 6);

  // This would usually be a Card component that could be re-used.
  return (
    <>
      <div className="container max-w-full mt-4">
        <div className="grid grid-cols-1 gap-6 mb-10 lg:grid-cols-3"></div>
        <div className="grid grid-cols-1 gap-4 justify-evenly m-2">
          <h2 className="text-2xl text-blue-900 dark:text-white">
            Today's forecast:
          </h2>
        </div>
        {error ? (
          <div className="grid grid-cols-4 gap-4 justify-evenly m-2">
            <p>Error fetching weather data:</p>) : {data.length === 0} ? (
            <p>No weather data at the moment</p>
          </div>
        ) : (
          <div className="grid grid-cols-4 gap-4 justify-evenly m-2">
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
                            {init + x?.timepoint}
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
                            {x?.wind10mDirection}
                          </span>
                          <br />
                          <span className="text-slate-950 dark:text-slate-950">
                            10m Wind Speed:
                          </span>
                          <span className="text-red-900">
                            {x?.wind10mSpeed}
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

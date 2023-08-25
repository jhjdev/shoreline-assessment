import { useEffect, useState } from "react";

const SevenDaysForecast = () => {
  const [lat, setLat] = useState<number | []>();
  const [long, setLong] = useState<number | []>();
  const [error, setError] = useState();
  const [data, setData] = useState<any[]>([]);
  const [init, setInit] = useState(new Date());

  useEffect(() => {
    const fetchData = async () => {
      navigator.geolocation.getCurrentPosition(function (position) {
        setLat(position.coords.latitude);
        setLong(position.coords.longitude);
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
        setData(json?.dataseries);
        setInit(json?.init);
      } catch (error: any) {
        setError(error);
      }
    };
    fetchData();
  }, [lat, long]);

  // In the API, init gives you an inital date, and timepoint
  // gives you the next 3 hours. Due to lack of time, I didn't
  // have time to find a suitable sultion to format the date from the string
  // and then add a method that would add the timepoints to give an exact
  // timestamp for each card.
  // This would also have allowed me to calculate each time point into individual day
  // and get the highest and the lowest temp.

  return (
    <>
      <div className="container max-w-full mt-4">
        <div className="grid grid-cols-1 gap-6 mb-10 lg:grid-cols-3"></div>
        <div className="grid grid-cols-1 gap-4 justify-evenly m-2">
          <h2 className="text-2xl text-blue-900 dark:text-white">
            7 Day forecast:
          </h2>
        </div>
        {error ? (
          <div className="grid grid-cols-4 gap-4 justify-evenly m-2">
            <p>Error fetching weather data:</p>) : {data.length === 0} ? (
            <p>No weather data at the moment</p>
          </div>
        ) : (
          <div className="grid grid-cols-4 gap-4 justify-evenly m-2">
            {data.map((x, index) => (
              <div className="rounded-lg" key={index}>
                <div className="justify-center center-items">
                  <div className="max-w-md rounded-3xl p-px bg-gradient-to-b from-blue-300 to-pink-300">
                    <div className="rounded-[calc(1.5rem-1px)] p-10 bg-white">
                      <div className="flex gap-4 items-center">
                        <p>
                          <span className="text-slate-950 dark:text-slate-950">
                            Time:
                          </span>
                          <span className="text-red-700">{x?.timepoint}</span>
                          <br />
                          <span className="text-slate-950 dark:text-slate-950">
                            Temp:
                          </span>
                          <span className="text-red-900">{x?.temp2m}</span>
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

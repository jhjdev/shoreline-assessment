import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const FiveDaysForecast = () => {
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
        setData(json?.dataseries);
        setInit(json?.init);
      } catch (error: any) {
        setError(error);
      }
    };
    fetchData();
  }, [lat, long]);

  const fiveDaysData = data.slice(0, 30);

  const chartData = fiveDaysData.map((item) => {
    return [
      {
        name: init + item?.timepoint,
        uv: item?.temp2m,
        pv: item?.temp2m,
        amt: item?.temp2m,
      },
    ];
  });

  console.log("chart data:", chartData);

  // Trying to use line chart from recharts, but
  // I'm having trouble getting the exact data to show up
  // in the application.
  // Unfortunately, I haven't worked with rechart much before
  // or data visualiation in React or React Native
  // (E.g. charting libraries)

  return (
    <>
      <div className="container max-w-full mt-4">
        <div className="w-full grid gap-6 mb-6">
          <div className="w-7/12 px-4 py-5 bg-white border-cyan-700 border-2 shadow-cyan-700/50 rounded-lg shadow flex-col mx-auto">
            <div className="space-y-12">
              <div className="tw-border-solid border-b-2 border-cyan-700 shadow-cyan-700/50 pb-12">
                <h2 className="text-base font-semibold leading-7 text-gray-900">
                  Five Days Forecast:
                </h2>
                <p className="mt-1 text-sm leading-6 text-gray-600">
                  Forecast for the next five days <br />
                  <br />
                </p>
                <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                  <div className="sm:col-span-4">
                    <LineChart
                      width={600}
                      height={300}
                      data={chartData}
                      margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
                    >
                      <Line type="monotone" dataKey="uv" stroke="#8884d8" />
                      <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                    </LineChart>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default FiveDaysForecast;

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
import { useSharedWeatherDataState } from "../state/WeatherData.state";
import { useDateParser } from "../hooks/dateParser";

interface DataSeries {
  timepoint: number;
  // Other properties in the data object
}

const FiveDaysForecast = () => {
  const { data, init } = useSharedWeatherDataState();
  const dataseries: DataSeries[] = [...data];

  const formattedDate = useDateParser(init, dataseries);

  const chartData = data.slice(0, 30).map((x) => {
    return [
      {
        name: formattedDate,
        temprature: x?.temp2m,
      },
    ];
  });

  const bars = chartData
    .reduce((acc, itm) => acc.concat(itm), [])
    .filter((i, x, s) => s.indexOf(i) === x);

  console.log(...bars);

  // Rechart renders the text on the axis a bit funky.
  // Would need much more time to look into it in more
  // detail.
  // But it seems to render the correct data.
  // Would need to figure out how to customize the
  // tooltip at some point so that it displays data
  // that is actually meaningful.

  return (
    <>
      <div className="container max-w-full mt-4">
        <div className="w-full grid gap-6 mb-6">
          <div className="w-full px-4 py-5 bg-white border-cyan-700 border-2 shadow-cyan-700/50 rounded-lg shadow flex-col mx-auto">
            <div className="space-y-12">
              <div className="tw-border-solid border-b-2 border-cyan-700 shadow-cyan-700/50 pb-12">
                <h2 className="text-base font-semibold leading-7 text-gray-900">
                  Five Days Weather Forecast:
                </h2>
                <p className="mt-1 text-sm leading-6 text-gray-600">
                  Forecast for the next five days <br />
                  <br />
                </p>
                <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-1">
                  <ResponsiveContainer width="100%" height={500}>
                    <LineChart
                      data={bars}
                      height={500}
                      margin={{
                        top: 10,
                        right: 30,
                        left: 0,
                        bottom: 0,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                      <YAxis tick={{ fontSize: 12 }} />
                      <Tooltip />
                      <Line
                        connectNulls
                        type="monotone"
                        dataKey="temprature"
                        stroke="#8884d8"
                        fill="#8884d8"
                      />
                    </LineChart>
                  </ResponsiveContainer>
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

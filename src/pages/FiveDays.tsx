import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { useSharedWeatherDataState } from '../state/WeatherData.state';
import { useDateParser } from '../hooks/dateParser';

interface DataSeries {
  timepoint: number;
  // Other properties in the data object
}

export default function FiveDays() {
  const { data, init, loading } = useSharedWeatherDataState();

  // Always call hooks at the top level
  const dataseries: DataSeries[] = data ? [...data] : [];
  const formattedDate = useDateParser(init || '', dataseries);

  if (!data) {
    return <p>No data available</p>;
  }

  console.log('formattedDate', formattedDate);
  const chartData = data.slice(0, 30).map((x, index) => {
    // Handle temperature which can be either a number or an object with min/max
    let temperature;
    if (typeof x?.temp2m === 'number') {
      temperature = x?.temp2m;
    } else if (x?.temp2m && typeof x?.temp2m === 'object') {
      // If it's an object, we'll use the max value or calculate an average
      if (x?.temp2m.max !== undefined) {
        temperature = x?.temp2m.max;
      } else if (x?.temp2m.min !== undefined && x?.temp2m.max !== undefined) {
        const avg = (x?.temp2m.min + x?.temp2m.max) / 2;
        temperature = parseFloat(avg.toFixed(1));
      } else {
        temperature = null;
      }
    } else {
      temperature = null;
    }

    return [
      {
        name: formattedDate[index] || 'No Date Available',
        Temperature: temperature,
      },
    ];
  });

  const bars = chartData
    .reduce((acc, itm) => acc.concat(itm), [])
    .filter((i, x, s) => s.indexOf(i) === x);

  console.log(...bars);

  // Custom tooltip component for formatting temperature with °C
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const temperature = payload[0].value;
      return (
        <div className="custom-tooltip bg-white p-3 border border-gray-300 rounded shadow-md">
          <p className="font-semibold text-gray-700">{`Date: ${label}`}</p>
          <p className="text-cyan-600">
            {`Temperature: ${
              temperature !== null ? `${temperature}°C` : 'N/A'
            }`}
          </p>
        </div>
      );
    }
    return null;
  };

  // Rechart renders the text on the axis a bit funky.
  // Would need much more time to look into it in more
  // detail.
  // But it seems to render the correct data.
  // Would need to figure out how to customize the
  // tooltip at some point so that it displays data
  // that is actually meaningful.

  if (loading) {
    return <p>Loading...</p>;
  }

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
                      <YAxis
                        tick={{ fontSize: 12 }}
                        label={{
                          value: 'Temperature (°C)',
                          angle: -90,
                          position: 'insideLeft',
                          style: { textAnchor: 'middle' },
                        }}
                      />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend />
                      <Line
                        connectNulls
                        type="monotone"
                        dataKey="Temperature"
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
}

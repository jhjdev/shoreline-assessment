import Router from "./routes/Routes";
import { BrowserRouter } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import "./App.css";
import { useSharedWeatherDataState } from "./state/WeatherData.state";
import { useEffect } from "react";

function App() {
  const {
    lat,
    setLat,
    long,
    setLong,
    setInit,
    setData,
    setSevenDaysInit,
    setSevenDaysData,
    setError,
  } = useSharedWeatherDataState();

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(function (position) {
      setLat(position.coords.latitude);
      setLong(position.coords.longitude);

      // console.log("Latitude is:", lat);
      // console.log("Longitude is:", long);
    });
    const fetchAllData = async () => {
      const url =
        "http://www.7timer.info/bin/api.pl?lon=" +
        long +
        "&lat=" +
        lat +
        "&product=civil&output=json";

      try {
        const response = await fetch(url);
        const json = await response.json();
        // console.log("Weather:", json?.dataseries);
        setData(json?.dataseries);
        setInit(json?.init);
      } catch (error: any) {
        console.log("error", error);
        setError(error);
      }
    };
    const fetcSevenDaysData = async () => {
      const url =
        "http://www.7timer.info/bin/api.pl?lon=" +
        long +
        "&lat=" +
        lat +
        "&product=civillight&output=json";

      try {
        const response = await fetch(url);
        const json = await response.json();
        // console.log("Weather:", json?.dataseries);
        setSevenDaysData(json?.dataseries);
        setSevenDaysInit(json?.init);
      } catch (error: any) {
        console.log("error", error);
        setError(error);
      }
    };
    fetchAllData();
    fetcSevenDaysData();
  }, [lat, long]);

  return (
    <BrowserRouter>
      <main className="flex flex-col h-screen w-screen">
        <div className="flex flex-1 overflow-hidden">
          <Sidebar />
          <div className="flex flex-1">
            {/* <div className="flex bg-gray-300 h-16 p-4">Header</div> */}
            <div className="flex flex-1 overflow-y-auto px-4">
              <Router />
            </div>
          </div>
        </div>
      </main>
    </BrowserRouter>
  );
}

export default App;

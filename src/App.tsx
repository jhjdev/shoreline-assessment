import Router from "./routes/Routes";
import { BrowserRouter } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import "./App.css";
import { useSharedWeatherDataState } from "./state/WeatherData.state";
import { useEffect } from "react";
import { SpinnerComponent } from "./components/Spinner";
import { fetchAllWeatherData } from "./services/weatherApi";

function App() {
  const {
    setInit,
    setData,
    setSevenDaysInit,
    setSevenDaysData,
    loading,
    setLoading,
    setError,
  } = useSharedWeatherDataState();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { civilData, civilLightData } = await fetchAllWeatherData();
        
        setData(civilData?.dataseries || null);
        setInit(civilData?.init || null);
        setSevenDaysData(civilLightData?.dataseries || null);
        setSevenDaysInit(civilLightData?.init || null);
        setLoading(false);
      } catch (err: unknown) {
        console.log("error", err);
        setError(new Error("Something went wrong"));
        setLoading(false);
      }
    };

    fetchData();
  }, [10000]);

  if (loading) {
    return <SpinnerComponent size={105} />;
  }

  //  if (Error) {
  //    return <p>Error: {(Error as unknown as Error).message}</p>;
  //  }

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

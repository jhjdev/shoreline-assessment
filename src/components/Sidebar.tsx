import { Link } from "react-router-dom";
import { ViteLogo } from "../assets/svg/ViteLogo";
import { ReactLogo } from "../assets/svg/ReactLogo";
import { SettingsIcon } from "../assets/svg/SettingsIcon";
import { SevenDaysForecastIcon } from "../assets/svg/SevenDaysForecastIcon";
import { CurrentWeatherIcon } from "../assets/svg/CurrentWeatherIcon";
import { FiveDaysForecastIcon } from "../assets/svg/FiveDaysForecastIcon";

const Sidebar = () => {
  return (
    <>
      <aside className="flex flex-col p-3 bg-gray-800 shadow w-60">
        <div className="space-y-3">
          <div className="flex items-center">
            <h2 className="text-xl font-bold text-white pl-2">Shoreline App</h2>
          </div>
          <div className="h-12 w-40 grid grid-cols-3 items-normal pt-3 pl-2 pb-0">
            <div>
              <a href="https://vitejs.dev" target="_blank">
                <ViteLogo />
              </a>
            </div>
            <div>
              <a href="https://react.dev" target="_blank">
                <ReactLogo />
              </a>
            </div>
          </div>
          <div className="flex-1">
            <ul className="pt-2 pb-4 space-y-1 text-sm">
              <li className="rounded-sm">
                <Link
                  to="/"
                  className="flex items-center p-2 space-x-3 rounded-md"
                >
                  <CurrentWeatherIcon />

                  <span className="text-gray-100">Current Weather</span>
                </Link>
              </li>
              <li className="rounded-sm">
                <Link
                  to="/next-seven-days"
                  className="flex items-center p-2 space-x-3 rounded-md"
                >
                  <SevenDaysForecastIcon />
                  <span className="text-gray-100">Next 7 days</span>
                </Link>
              </li>
              <li className="rounded-sm">
                <Link
                  to="/next-five-days"
                  className="flex items-center p-2 space-x-3 rounded-md"
                >
                  <FiveDaysForecastIcon />
                  <span className="text-gray-100">5 Days Forecast</span>
                </Link>
              </li>
              <li className="rounded-sm">
                <a
                  href="/settings"
                  className="flex items-center p-2 space-x-3 rounded-md"
                >
                  <SettingsIcon />
                  <span className="text-gray-100">Settings</span>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;

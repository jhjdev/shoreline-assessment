import { Link, useLocation } from 'react-router-dom';
import { ViteLogo } from '../assets/svg/ViteLogo';
import { ReactLogo } from '../assets/svg/ReactLogo';
import { DebugIcon } from '../assets/svg/DebugIcon';
import { SevenDaysForecastIcon } from '../assets/svg/SevenDaysForecastIcon';
import { CurrentWeatherIcon } from '../assets/svg/CurrentWeatherIcon';
import { FiveDaysForecastIcon } from '../assets/svg/FiveDaysForecastIcon';
import { ToggleSwitch } from './ToggleSwitch';
import { useSharedWeatherDataState } from '../state/WeatherData.state';

const Sidebar = () => {
  const location = useLocation();
  const { debugMode, setDebugMode } = useSharedWeatherDataState();
  const isActive = (path: string) => location.pathname === path;

  return (
    <aside className="w-60 bg-gray-800 p-4 min-h-screen">
      <h2 className="text-xl text-white mb-6 text-center uppercase">
        Shoreline App
      </h2>

      <div className="flex justify-center space-x-4 mb-8">
        <a
          href="https://vitejs.dev"
          target="_blank"
          rel="noreferrer"
          className="hover:opacity-80 transition-opacity"
        >
          <ViteLogo />
        </a>
        <a
          href="https://react.dev"
          target="_blank"
          rel="noreferrer"
          className="hover:opacity-80 transition-opacity"
        >
          <ReactLogo />
        </a>
      </div>

      <nav className="space-y-2">
        <Link
          to="/"
          className={`flex items-center p-2 rounded-lg transition-colors ${
            isActive('/')
              ? 'bg-gray-700 text-white'
              : 'text-gray-300 hover:bg-gray-700 hover:text-white'
          }`}
        >
          <CurrentWeatherIcon />
          <span className="ml-3">Current Weather</span>
        </Link>

        <Link
          to="/next-seven-days"
          className={`flex items-center p-2 rounded-lg transition-colors ${
            isActive('/next-seven-days')
              ? 'bg-gray-700 text-white'
              : 'text-gray-300 hover:bg-gray-700 hover:text-white'
          }`}
        >
          <SevenDaysForecastIcon />
          <span className="ml-3">Next 7 days</span>
        </Link>

        <Link
          to="/next-five-days"
          className={`flex items-center p-2 rounded-lg transition-colors ${
            isActive('/next-five-days')
              ? 'bg-gray-700 text-white'
              : 'text-gray-300 hover:bg-gray-700 hover:text-white'
          }`}
        >
          <FiveDaysForecastIcon />
          <span className="ml-3">5 Days Forecast</span>
        </Link>

        <div className="flex items-center p-2 rounded-lg text-gray-300 hover:bg-gray-700 hover:text-white transition-colors">
          <DebugIcon />
          <span className="ml-3 flex-1">Debug Mode</span>
          <ToggleSwitch
            enabled={debugMode}
            onChange={setDebugMode}
            size="small"
          />
        </div>
      </nav>
    </aside>
  );
};

export default Sidebar;

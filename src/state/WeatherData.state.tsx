import { useState } from "react";
import { useBetween } from "use-between";

type AllWeatherData = {
  timepoint: number;
  cloudcover: number;
  lifted_index: number;
  prec_type: string;
  prec_amount: number;
  temp2m: number;
  rh2m: string;
  wind10m: {
    direction: string;
    speed: number;
  };
  weather: string;
};

type SevenDaysData = {
  date: number;
  weather: string;
  temp2m: {
    max: number;
    min: number;
  };
  wind10m_max: number;
};

// Simple state management tool. I only need set
// the states in App.tsx, and then I can share them
// between all componenets.

const useWeatherDataState = () => {
  const [init, setInit] = useState<string>("");
  const [data, setData] = useState<AllWeatherData[]>([]);
  const [sevenDaysInit, setSevenDaysInit] = useState<string>("");
  const [sevenDaysData, setSevenDaysData] = useState<SevenDaysData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);
  return {
    init,
    setInit,
    data,
    setData,
    sevenDaysInit,
    setSevenDaysInit,
    sevenDaysData,
    setSevenDaysData,
    loading,
    setLoading,
    error,
    setError,
  };
};

export const useSharedWeatherDataState = () => useBetween(useWeatherDataState);

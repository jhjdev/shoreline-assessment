import { create } from 'zustand';

export interface WeatherDataSeries {
  timepoint: number;
  date: number;
  cloudcover: number;
  seeing: number;
  transparency: number;
  lifted_index: number;
  rh2m: number;
  temp2m:
    | number
    | {
        max: number;
        min: number;
      };
  prec_type: string;
  prec_amount: number;
  wind10m: {
    direction: string;
    speed: number;
  };
  weather: string;
}

interface WeatherState {
  data: WeatherDataSeries[] | null;
  init: string | null;
  sevenDaysData: WeatherDataSeries[] | null;
  sevenDaysInit: string | null;
  loading: boolean;
  error: Error | null;
  setData: (data: WeatherDataSeries[] | null) => void;
  setInit: (init: string | null) => void;
  setSevenDaysData: (data: WeatherDataSeries[] | null) => void;
  setSevenDaysInit: (init: string | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: Error | null) => void;
}

export const useSharedWeatherDataState = create<WeatherState>((set) => ({
  data: null,
  init: null,
  sevenDaysData: null,
  sevenDaysInit: null,
  loading: true,
  error: null,
  setData: (data) => set({ data }),
  setInit: (init) => set({ init }),
  setSevenDaysData: (data) => set({ sevenDaysData: data }),
  setSevenDaysInit: (init) => set({ sevenDaysInit: init }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
}));

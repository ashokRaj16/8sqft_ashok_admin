import { create } from 'zustand';

interface Location {
  latitude: number;
  longitude: number;
  placeName: string; // Add placeName to store the location name
}

interface WeatherData {
  temperature: number;
  description: string;
}

interface Store {
  location: Location | null;
  setLocation: (latitude: number, longitude: number, placeName: string) => void; // Updated to include placeName
  weatherData: WeatherData | null;
  setWeatherData: (data: WeatherData) => void;
  error: string | null;
  setError: (error: string) => void;
}

export const useStore = create<Store>((set) => ({
  location: null,
  setLocation: (latitude: number, longitude: number, placeName: string) => 
    set((state) => ({
      ...state,
      location: { latitude, longitude, placeName },
    })),
  weatherData: null,
  setWeatherData: (data: WeatherData) =>
    set((state) => ({
      ...state,
      weatherData: data,
    })),
  error: null,
  setError: (error: string) =>
    set((state) => ({
      ...state,
      error,
    })),
}));

import { generateTripWeather } from "@/actions/generate";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatDate, formatWeatherName, getWeatherIcon } from "@/lib/utils";

import { unstable_cache } from "next/cache";
import WeatherCurrent from "./WeatherCurrent";
import WeatherForecast from "./WeatherForecast";
import WeatherClient from "./WeatherClient";

// Mock weather data - in a real app, this would come from a weather API
const mockWeatherData = {
  current: {
    temp: 22,
    feels_like: 23,
    humidity: 65,
    wind_speed: 12,
    condition: "partly-cloudy",
    description: "Partly cloudy",
  },
  daily: [
    {
      date: "2023-07-15",
      temp_max: 24,
      temp_min: 18,
      condition: "sunny",
      description: "Sunny",
      precipitation: 0,
    },
    {
      date: "2023-07-16",
      temp_max: 26,
      temp_min: 19,
      condition: "partly-cloudy",
      description: "Partly cloudy",
      precipitation: 10,
    },
    {
      date: "2023-07-17",
      temp_max: 23,
      temp_min: 17,
      condition: "rainy",
      description: "Light rain",
      precipitation: 60,
    },
    {
      date: "2023-07-18",
      temp_max: 21,
      temp_min: 16,
      condition: "rainy",
      description: "Heavy rain",
      precipitation: 80,
    },
    {
      date: "2023-07-19",
      temp_max: 22,
      temp_min: 17,
      condition: "partly-cloudy",
      description: "Partly cloudy",
      precipitation: 20,
    },
    {
      date: "2023-07-20",
      temp_max: 25,
      temp_min: 18,
      condition: "sunny",
      description: "Sunny",
      precipitation: 0,
    },
    {
      date: "2023-07-21",
      temp_max: 27,
      temp_min: 20,
      condition: "sunny",
      description: "Sunny",
      precipitation: 0,
    },
  ],
};

export default async function Weather({ trip }) {
  // const cachedGenerateTripWeather = unstable_cache(
  //   async (trip) => generateTripWeather(trip),
  //   ["trip-weather"], // cache key, can include trip.id if needed
  //   { revalidate: 60 * 60 } // cache for 1 hour
  // );

  // const generatedTripWeather = await cachedGenerateTripWeather(trip);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-bold ">Weather Forecast</h3>
      </div>

      {mockWeatherData ? (
        <Tabs defaultValue="current" className="w-full">
          <TabsList className="mb-6 w-full">
            <TabsTrigger value="current">Current</TabsTrigger>
            <TabsTrigger value="forecast">Forecast</TabsTrigger>
            <TabsTrigger value="trip">Trip Weather</TabsTrigger>
          </TabsList>

          <WeatherClient trip={trip} mockWeatherData={mockWeatherData} />
        </Tabs>
      ) : (
        <div className="flex flex-col items-center justify-center h-full">
          <p className="text-lg font-semibold">Weather data not available</p>
          <p className="text-sm text-gray-500">
            Please check your internet connection or try again later.
          </p>
        </div>
      )}
    </div>
  );
}

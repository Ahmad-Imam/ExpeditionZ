"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Cloud,
  CloudRain,
  CloudSun,
  Snowflake,
  Sun,
  Thermometer,
  Umbrella,
  Wind,
} from "lucide-react";
import { useEffect, useState } from "react";

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

export default function WeatherForecast({ trip }) {
  const [activeTab, setActiveTab] = useState("current");
  const [isLoading, setIsLoading] = useState(true);

  // Simulate API loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const getWeatherIcon = (condition, size = 24) => {
    switch (condition) {
      case "sunny":
        return <Sun size={size} className="text-yellow-500" />;
      case "partly-cloudy":
        return <CloudSun size={size} className="text-blue-400" />;
      case "cloudy":
        return <Cloud size={size} className="text-gray-400" />;
      case "rainy":
        return <CloudRain size={size} className="text-blue-600" />;
      case "snowy":
        return <Snowflake size={size} className="text-blue-200" />;
      case "windy":
        return <Wind size={size} className="text-gray-500" />;
      default:
        return <Sun size={size} className="text-yellow-500" />;
    }
  };

  const formatDate = (dateString) => {
    const options = {
      weekday: "short",
      month: "short",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  // Filter forecast to only show days within the trip dates
  const tripStartDate = new Date(trip.startDate);
  const tripEndDate = new Date(trip.endDate);

  const filteredForecast = mockWeatherData.daily.filter((day) => {
    const forecastDate = new Date(day.date);
    return forecastDate >= tripStartDate && forecastDate <= tripEndDate;
  });

  // If no days in the trip match our forecast, show the full forecast
  const forecastToShow =
    filteredForecast.length > 0 ? filteredForecast : mockWeatherData.daily;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-bold text-purple-900">Weather Forecast</h3>
        <div className="text-sm text-gray-600">
          Weather for {trip.destination}
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-pulse text-purple-600">
            Loading weather data...
          </div>
        </div>
      ) : (
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="current">Current</TabsTrigger>
            <TabsTrigger value="forecast">Forecast</TabsTrigger>
            <TabsTrigger value="trip">Trip Weather</TabsTrigger>
          </TabsList>

          <TabsContent value="current">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center justify-between">
                  <span>Current Weather</span>
                  {getWeatherIcon(mockWeatherData.current.condition, 32)}
                </CardTitle>
                <CardDescription>
                  {mockWeatherData.current.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="flex flex-col items-center p-4 bg-gray-50 rounded-lg">
                    <Thermometer className="h-6 w-6 text-red-500 mb-2" />
                    <div className="text-2xl font-bold">
                      {mockWeatherData.current.temp}°C
                    </div>
                    <div className="text-xs text-gray-500">Temperature</div>
                  </div>
                  <div className="flex flex-col items-center p-4 bg-gray-50 rounded-lg">
                    <Thermometer className="h-6 w-6 text-orange-500 mb-2" />
                    <div className="text-2xl font-bold">
                      {mockWeatherData.current.feels_like}°C
                    </div>
                    <div className="text-xs text-gray-500">Feels Like</div>
                  </div>
                  <div className="flex flex-col items-center p-4 bg-gray-50 rounded-lg">
                    <Umbrella className="h-6 w-6 text-blue-500 mb-2" />
                    <div className="text-2xl font-bold">
                      {mockWeatherData.current.humidity}%
                    </div>
                    <div className="text-xs text-gray-500">Humidity</div>
                  </div>
                  <div className="flex flex-col items-center p-4 bg-gray-50 rounded-lg">
                    <Wind className="h-6 w-6 text-gray-500 mb-2" />
                    <div className="text-2xl font-bold">
                      {mockWeatherData.current.wind_speed} km/h
                    </div>
                    <div className="text-xs text-gray-500">Wind Speed</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="forecast">
            <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
              {mockWeatherData.daily.map((day, index) => (
                <Card key={index} className="h-full">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">
                      {formatDate(day.date)}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-col items-center">
                    {getWeatherIcon(day.condition, 32)}
                    <div className="mt-2 text-sm">{day.description}</div>
                    <div className="mt-2 flex items-center gap-1">
                      <span className="font-bold">{day.temp_max}°</span>
                      <span className="text-gray-500">{day.temp_min}°</span>
                    </div>
                    <div className="mt-1 text-xs text-gray-500">
                      {day.precipitation > 0
                        ? `${day.precipitation}% rain`
                        : "No rain"}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="trip">
            <div className="mb-4">
              <h4 className="text-lg font-medium text-purple-900">
                Weather during your trip ({trip.startDate} to {trip.endDate})
              </h4>
              <p className="text-sm text-gray-600">
                {forecastToShow === mockWeatherData.daily
                  ? "Your trip is outside our forecast range. Showing general forecast for the destination."
                  : `Showing weather forecast for your trip dates.`}
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {forecastToShow.slice(0, 5).map((day, index) => (
                <Card key={index} className="h-full">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">
                      {formatDate(day.date)}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-col items-center">
                    {getWeatherIcon(day.condition, 32)}
                    <div className="mt-2 text-sm">{day.description}</div>
                    <div className="mt-2 flex items-center gap-1">
                      <span className="font-bold">{day.temp_max}°</span>
                      <span className="text-gray-500">{day.temp_min}°</span>
                    </div>
                    <div className="mt-1 text-xs text-gray-500">
                      {day.precipitation > 0
                        ? `${day.precipitation}% rain`
                        : "No rain"}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}

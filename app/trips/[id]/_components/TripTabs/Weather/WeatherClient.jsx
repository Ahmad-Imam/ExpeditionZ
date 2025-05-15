"use client";

import React, { useEffect, useState } from "react";

import { TabsContent } from "@/components/ui/tabs";
import WeatherCurrent from "./WeatherCurrent";
import WeatherForecast from "./WeatherForecast";
import WeatherTrip from "./WeatherTrip";
import { formatDate } from "@/lib/utils";
import { toast } from "sonner";
import Loading from "./loading";
export default function WeatherClient({ trip }) {
  const [loading, setLoading] = useState(false);

  const [weatherData, setWeatherData] = useState(null);

  useEffect(() => {
    const fetchWeatherData = async (trip) => {
      try {
        setLoading(true);
        const response = await fetch(`/api/weather`, {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ trip }),
        });
        const data = await response.json();

        setWeatherData(data);
      } catch (error) {
        toast.error("Error fetching weather data. Please try again later.");
        console.error("Error fetching weather data:", error);
      } finally {
        setLoading(false);
      }
    };
    const newTrip = {
      destination: trip.destination,
      startDate: trip.startDate,
    };

    fetchWeatherData(newTrip);
  }, []);

  if (loading || !weatherData) {
    return <Loading />;
  }

  return (
    <div>
      <TabsContent value="current">
        <WeatherCurrent
          destination={trip?.destination}
          weatherData={weatherData}
        />
      </TabsContent>

      <TabsContent value="forecast">
        <WeatherForecast weatherData={weatherData} />
      </TabsContent>

      <TabsContent value="trip">
        <div className="mb-4">
          <h4 className="text-lg font-medium ">
            Weather in your trip ({formatDate(trip.startDate)} to{" "}
            {formatDate(trip.endDate)})
          </h4>
          <p className="text-sm ">
            Showing weather forecast for your trip dates.
          </p>
        </div>

        {loading ? (
          <div>
            <p className="text-sm text-gray-500">Loading...</p>
          </div>
        ) : (
          <WeatherTrip weatherData={weatherData} />
        )}
      </TabsContent>
    </div>
  );
}

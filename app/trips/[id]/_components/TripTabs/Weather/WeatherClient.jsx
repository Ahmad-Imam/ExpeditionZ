"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useAutumn, useCustomer } from "autumn-js/next";
import { TabsContent } from "@/components/ui/tabs";
import WeatherCurrent from "./WeatherCurrent";
import WeatherForecast from "./WeatherForecast";
import WeatherTrip from "./WeatherTrip";
import { formatDate } from "@/lib/utils";
export default function WeatherClient({ trip }) {
  const [loading, setLoading] = useState(false);

  const [weatherData, setWeatherData] = useState(null);

  // const { attach, check, track } = useAutumn();
  // const { customer, error } = useCustomer();

  // const [proUser, setProUser] = useState(false);

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
        console.log("Weather data:", data);
        setWeatherData(data);
      } catch (error) {
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

  // useEffect(() => {
  //   async function checkProUser(customer) {
  //     if (!customer) return;
  //     const { data } = await check({ featureId: "weather-update" });
  //     console.log("Check pro user:", data);
  //     if (data.allowed) {
  //       setProUser(true);
  //     } else {
  //       setProUser(false);
  //     }
  //   }

  //   checkProUser(customer);
  // }, [customer]);

  // if (loading || !weatherData) {
  //   return <Loading />;
  // }

  // async function handleClickPro() {
  //   attach({ productId: "weather" });
  // }

  // async function handleClickFeature() {
  //   let { data } = await check({ featureId: "weather-update" });
  //   console.log(data.allowed);

  //   if (data.allowed) {
  //     await track({ featureId: "weather-update" });
  //   } else {
  //     alert("No access");
  //   }
  // }

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

        <WeatherTrip weatherData={weatherData} />
      </TabsContent>

      {/* <Button onClick={handleClickPro}>Upgrade to Pro</Button>
      <Button onClick={handleClickFeature}>Test</Button> */}
    </div>
  );
}

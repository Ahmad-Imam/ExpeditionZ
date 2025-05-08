"use client";
import Loading from "@/app/loading";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatWeatherName, getWeatherIcon } from "@/lib/utils";
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

import React, { Suspense, useEffect, useState } from "react";

export default function WeatherCurrent({ destination, weatherData }) {
  return (
    <div>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center justify-between">
            <span className="text-xl">
              Current Weather: {destination.toUpperCase()}
            </span>
            {getWeatherIcon(weatherData?.current?.condition, 32)}
          </CardTitle>
          <CardDescription className={"text-lg font-semibold"}>
            {formatWeatherName(weatherData?.current?.condition)}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 ">
            <div className="flex flex-col items-center p-4 bg-accent rounded-lg">
              <Thermometer className="h-6 w-6 text-red-500 mb-2" />
              <div className="text-2xl font-bold">
                {weatherData?.current?.temp}°C
              </div>
              <div className="text-md">Temperature</div>
            </div>
            <div className="flex flex-col items-center p-4 bg-accent rounded-lg">
              <Thermometer className="h-6 w-6 text-orange-500 mb-2" />
              <div className="text-2xl font-bold">
                {weatherData?.current?.feels_like}°C
              </div>
              <div className="text-md ">Feels Like</div>
            </div>
            <div className="flex flex-col items-center p-4 bg-accent rounded-lg">
              <Umbrella className="h-6 w-6 text-blue-500 mb-2" />
              <div className="text-2xl font-bold">
                {weatherData?.current?.humidity}%
              </div>
              <div className="text-md ">Humidity</div>
            </div>
            <div className="flex flex-col items-center p-4 bg-accent rounded-lg">
              <Wind className="h-6 w-6 text-lime-500 mb-2" />
              <div className="text-2xl font-bold">
                {weatherData?.current?.wind_speed} km/h
              </div>
              <div className="text-md ">Wind Speed</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

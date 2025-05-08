"use client";
import React, { useEffect, useState } from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatDate, formatWeatherName, getWeatherIcon } from "@/lib/utils";
import Loading from "./loading";

export default function WeatherForecast({ weatherData }) {
  return (
    <div>
      {" "}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {weatherData?.daily?.slice(0, 5).map((day, index) => (
          <Card key={index} className="h-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                {formatDate(day?.date)}
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
              {getWeatherIcon(day.condition, 32)}
              <div className="mt-2 text-sm">
                {formatWeatherName(day?.condition)}
              </div>
              <div className="mt-2 flex items-center gap-1">
                <span className="font-bold">{day?.temp_max}°</span>
                <span className="">{day?.temp_min}°</span>
              </div>
              <div className="mt-1 text-sm ">
                {day?.precipitation > 0
                  ? `${day?.precipitation}% rain`
                  : "No rain"}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

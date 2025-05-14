"use client";
import React, { useEffect, useState } from "react";
import InfoHeader from "./InfoHeader";
import InfoTabs from "./InfoTabs";
import Loading from "@/app/loading";

export default function InfoClient({ trip }) {
  const [loading, setLoading] = useState(false);

  const [locationData, setLocationData] = useState(null);

  useEffect(() => {
    const fetchLocationInfo = async (trip) => {
      try {
        setLoading(true);
        const response = await fetch(`/api/info`, {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ trip }),
        });
        const data = await response.json();

        setLocationData(data);
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

    fetchLocationInfo(newTrip);
  }, []);

  if (loading || !locationData) {
    return <Loading />;
  }

  return (
    <div>
      <InfoHeader destinationData={locationData} trip={trip} />
      <InfoTabs destinationData={locationData} trip={trip} />
    </div>
  );
}

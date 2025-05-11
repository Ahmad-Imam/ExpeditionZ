"use client";
import React, { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css";

export default function AddLocationMap({ onSelect }) {
  const mapContainerRef = useRef();
  const mapRef = useRef();

  useEffect(() => {
    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: process.env.NEXT_PUBLIC_MAPBOX_STYLE_URL,
      center: [-79.4512, 43.6568],
      zoom: 13,
    });

    const geocoder = new MapboxGeocoder({
      accessToken: mapboxgl.accessToken,

      marker: {
        color: "red",
      },

      mapboxgl: mapboxgl,
    });

    mapRef.current.addControl(geocoder);

    geocoder.on("result", (e) => {
      onSelect({
        address: e.result.place_name,
        lng: e.result.center[0],
        lat: e.result.center[1],
      });
    });

    return () => mapRef.current.remove();
  }, []);

  return (
    <div className="absolute w-full h-full rounded-md">
      <div
        ref={mapContainerRef}
        id="map"
        style={{ height: "100%", width: "100%" }}
        className="rounded-md w-full h-full"
      ></div>
    </div>
  );
}

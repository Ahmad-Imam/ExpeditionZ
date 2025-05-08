"use client";
import React, { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css";

export default function AddLocationMap({ onSelect }) {
  const mapContainerRef = useRef();
  const mapRef = useRef();
  const [item, setItem] = useState(null);
  // console.log(item);
  useEffect(() => {
    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [-79.4512, 43.6568],
      zoom: 13,
    });

    const geocoder = new MapboxGeocoder({
      accessToken: mapboxgl.accessToken,

      marker: {
        color: "orange",
      },
      mapboxgl: mapboxgl,
    });

    mapRef.current.addControl(geocoder);

    // Listen for the result event
    geocoder.on("result", (e) => {
      // e.result.place_name is the input value (address)
      // e.result.center is [lng, lat]
      // setItem({
      //   name: e.result.place_name,
      //   lng: e.result.center[0],
      //   lat: e.result.center[1],
      // });

      onSelect({
        address: e.result.place_name,
        lng: e.result.center[0],
        lat: e.result.center[1],
      });

      // You can also access more info from e.result if needed
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

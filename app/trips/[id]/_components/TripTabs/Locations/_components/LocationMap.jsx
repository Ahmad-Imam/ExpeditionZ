import { useRef, useEffect } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

export default function LocationMap({ locations = [], selectedLocation }) {
  const mapRef = useRef();
  const mapContainerRef = useRef();
  const markersRef = useRef(new Map());
  const popupsRef = useRef(new Map());

  useEffect(() => {
    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [-74.5, 40], // Default center
      zoom: 8,
    });

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
      }
    };
  }, []);

  useEffect(() => {
    if (!mapRef.current || !locations.length) return;

    markersRef.current.forEach((marker) => marker.remove());
    popupsRef.current.forEach((popup) => popup.remove());
    markersRef.current.clear();
    popupsRef.current.clear();

    locations.forEach((location) => {
      const lng = location.lng || location.longitude;
      const lat = location.lat || location.latitude;

      if (typeof lng === "number" && typeof lat === "number") {
        const popup = new mapboxgl.Popup({
          closeButton: true,
          closeOnClick: false,

          maxWidth: "200px",
        }).setHTML(`
          <div class="p-4">
            <h3 class="font-bold text-sm mb-1">${location.name}</h3>
            <p class="text-xs ">${location.address}</p>
          </div>
        `);

        popupsRef.current.set(location.id, popup);

        const marker = new mapboxgl.Marker({
          color: "#666666",
        })
          .setLngLat([lng, lat])
          .setPopup(popup)
          .addTo(mapRef.current);

        marker.getElement().addEventListener("click", () => {
          popupsRef.current.forEach((p, id) => {
            if (id !== location.id) p.remove();
          });
        });

        markersRef.current.set(location.id, marker);
      }
    });
  }, [locations]);

  useEffect(() => {
    if (!mapRef.current || !selectedLocation) return;

    const lng = selectedLocation.lng || selectedLocation.longitude;
    const lat = selectedLocation.lat || selectedLocation.latitude;

    if (typeof lng === "number" && typeof lat === "number") {
      popupsRef.current.forEach((popup) => popup.remove());

      const selectedPopup = popupsRef.current.get(selectedLocation.id);
      if (selectedPopup) {
        selectedPopup.addTo(mapRef.current);
      }

      mapRef.current.flyTo({
        center: [lng, lat],
        essential: true,
        zoom: 12,
        duration: 1500,
      });
    }
  }, [selectedLocation]);

  // ...existing imports and code...

  return (
    <div className="absolute inset-0 w-full">
      <div ref={mapContainerRef} className="w-full h-full" />
    </div>
  );
}

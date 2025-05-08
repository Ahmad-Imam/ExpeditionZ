"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Edit, MapPin, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import LocationMap from "./LocationMap";
import AddLocation from "./AddLocation";

export default function LocationClient({ trip }) {
  //   console.log(trip?.locations);
  const locationCategories = [
    { value: "attraction", label: "Attraction" },
    { value: "restaurant", label: "Restaurant" },
    { value: "accommodation", label: "Accommodation" },
    { value: "shopping", label: "Shopping" },
    { value: "transportation", label: "Transportation" },
    { value: "other", label: "Other" },
  ];

  const getCategoryLabel = (value) => {
    return (
      locationCategories.find((cat) => cat.value === value)?.label || value
    );
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case "attraction":
        return "bg-purple-100 text-purple-800";
      case "restaurant":
        return "bg-red-100 text-red-800";
      case "accommodation":
        return "bg-blue-100 text-blue-800";
      case "shopping":
        return "bg-green-100 text-green-800";
      case "transportation":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const [selectedLocation, setSelectedLocation] = useState(null);
  console.log(selectedLocation);

  return (
    <div className="flex flex-col justify-between gap-4 ">
      <div>
        <AddLocation trip={trip} />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-[600px]">
        <div className="lg:col-span-2 bg-blue-500 rounded-lg relative overflow-hidden w-full">
          {trip.locations.length === 0 ? (
            <div className="text-center p-6">
              <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No locations added</h3>
              <p className="text-gray-600 mb-4">
                Add locations to see them on the map
              </p>
            </div>
          ) : (
            <LocationMap
              selectedLocation={selectedLocation}
              locations={trip?.locations}
            />
          )}
        </div>

        <div className="space-y-4 max-h-[600px] pb-6  pr-2 overflow-y-auto hide-scrollbar">
          {trip.locations.length === 0 ? (
            <Card>
              <CardContent className="p-6 text-center text-gray-500">
                No locations added yet
              </CardContent>
            </Card>
          ) : (
            trip.locations.map((location) => (
              <Card
                key={location.id}
                onClick={() => setSelectedLocation(location)}
                className={`cursor-pointer `}
              >
                <CardHeader className="pb-2">
                  <div className="flex justify-between">
                    <CardTitle className="text-lg">{location.name}</CardTitle>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setEditingLocation(location);
                          setIsEditingLocation(true);
                        }}
                      >
                        <Edit className="h-4 w-4 text-gray-500" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        //   onClick={() => handleDeleteLocation(location.id)}
                      >
                        <Trash2 className="h-4 w-4 text-gray-500" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="text-sm text-gray-600">
                      {location.address}
                    </div>
                    <div className="flex items-center">
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(
                          location.category
                        )}`}
                      >
                        {getCategoryLabel(location.category)}
                      </span>
                    </div>
                    {location.notes && (
                      <div className="text-sm text-gray-700 mt-2">
                        {location.notes}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

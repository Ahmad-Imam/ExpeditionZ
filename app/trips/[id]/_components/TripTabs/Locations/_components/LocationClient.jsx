"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Edit, Loader2, MapPin, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import LocationMap from "./LocationMap";
import AddLocation from "./AddLocation";
import { toast } from "sonner";
import { deleteLocationAction } from "@/actions/location";

export default function LocationClient({ trip, loggedUser }) {
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

  const [loading, setLoading] = useState(false);

  async function handleDeleteLocation(locationId) {
    try {
      setLoading(true);

      const deletedLocation = await deleteLocationAction(locationId);

      toast.success("Location deleted successfully");
    } catch (error) {
      toast.error("Error deleting location: " + error.message);
    } finally {
      setLoading(false);
    }
  }

  const filetedLocations = trip?.locations?.sort(
    (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
  );

  return (
    <div className="flex flex-col justify-between gap-6 ">
      <div className="flex justify-end">
        {loggedUser && <AddLocation trip={trip} />}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-[600px] relative">
        <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-background to-transparent pointer-events-none" />

        <div className="lg:col-span-2  rounded-lg relative overflow-hidden w-full">
          {trip.locations.length === 0 ? (
            <div className="text-center p-6 border rounded-lg">
              <MapPin className="h-12 w-12  mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No locations added</h3>
              <p className=" mb-4">Add locations to see them on the map</p>
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
            filetedLocations.map((location) => (
              <Card
                key={location.id}
                onClick={() => setSelectedLocation(location)}
                className={`cursor-pointer ${
                  selectedLocation?.id === location?.id
                    ? "bg-card-foreground/10"
                    : ""
                }`}
              >
                <CardHeader className="">
                  <div className="flex justify-between">
                    <CardTitle className="text-lg">{location.name}</CardTitle>
                    {loggedUser && (
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteLocation(location.id);
                          }}
                          disabled={loading}
                        >
                          {loading ? (
                            <Loader2 className="animate-spin">...</Loader2>
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent className={""}>
                  <div className="space-y-2">
                    <div className="text-md ">{location.address}</div>
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
                      <div className="text-sm  mt-2">{location.notes}</div>
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

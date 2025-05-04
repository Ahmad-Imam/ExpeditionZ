"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Edit, MapPin, Plus, Trash2 } from "lucide-react";
import { useState } from "react";

export default function LocationsMap({ trip, setTrip }) {
  const [newLocation, setNewLocation] = useState({
    name: "",
    address: "",
    notes: "",
    category: "attraction",
  });

  const [isAddingLocation, setIsAddingLocation] = useState(false);
  const [editingLocation, setEditingLocation] = useState(null);

  const [isEditingLocation, setIsEditingLocation] = useState(false);

  const handleAddLocation = () => {
    if (!newLocation.name || !newLocation.address) return;

    const location = {
      id: Date.now().toString(),
      name: newLocation.name,
      address: newLocation.address,
      notes: newLocation.notes || "",
      category: newLocation.category || "attraction",
      createdAt: new Date().toISOString(),
    };

    setTrip({
      ...trip,
      locations: [...trip.locations, location],
    });

    setNewLocation({
      name: "",
      address: "",
      notes: "",
      category: "attraction",
    });

    setIsAddingLocation(false);
  };

  const handleEditLocation = () => {
    if (!editingLocation || !editingLocation.name || !editingLocation.address)
      return;

    setTrip({
      ...trip,
      locations: trip.locations.map((location) =>
        location.id === editingLocation.id ? editingLocation : location
      ),
    });

    setEditingLocation(null);
    setIsEditingLocation(false);
  };

  const handleDeleteLocation = (id) => {
    setTrip({
      ...trip,
      locations: trip.locations.filter((location) => location.id !== id),
    });
  };

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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-bold text-purple-900">
          Must-See Locations
        </h3>

        <Dialog open={isAddingLocation} onOpenChange={setIsAddingLocation}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Location
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Location</DialogTitle>
              <DialogDescription>
                Add a must-see location to your trip.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Location Name</Label>
                <Input
                  id="name"
                  placeholder="Eiffel Tower"
                  value={newLocation.name}
                  onChange={(e) =>
                    setNewLocation({ ...newLocation, name: e.target.value })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  placeholder="Champ de Mars, 5 Avenue Anatole France, 75007 Paris"
                  value={newLocation.address}
                  onChange={(e) =>
                    setNewLocation({ ...newLocation, address: e.target.value })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="category">Category</Label>
                <select
                  id="category"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={newLocation.category}
                  onChange={(e) =>
                    setNewLocation({ ...newLocation, category: e.target.value })
                  }
                >
                  {locationCategories.map((category) => (
                    <option key={category.value} value={category.value}>
                      {category.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="notes">Notes (Optional)</Label>
                <Textarea
                  id="notes"
                  placeholder="Opening hours, ticket information, etc."
                  value={newLocation.notes}
                  onChange={(e) =>
                    setNewLocation({ ...newLocation, notes: e.target.value })
                  }
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsAddingLocation(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleAddLocation}>Add Location</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={isEditingLocation} onOpenChange={setIsEditingLocation}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Location</DialogTitle>
              <DialogDescription>
                Update the details of this location.
              </DialogDescription>
            </DialogHeader>
            {editingLocation && (
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-name">Location Name</Label>
                  <Input
                    id="edit-name"
                    placeholder="Eiffel Tower"
                    value={editingLocation.name}
                    onChange={(e) =>
                      setEditingLocation({
                        ...editingLocation,
                        name: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-address">Address</Label>
                  <Input
                    id="edit-address"
                    placeholder="Champ de Mars, 5 Avenue Anatole France, 75007 Paris"
                    value={editingLocation.address}
                    onChange={(e) =>
                      setEditingLocation({
                        ...editingLocation,
                        address: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-category">Category</Label>
                  <select
                    id="edit-category"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={editingLocation.category}
                    onChange={(e) =>
                      setEditingLocation({
                        ...editingLocation,
                        category: e.target.value,
                      })
                    }
                  >
                    {locationCategories.map((category) => (
                      <option key={category.value} value={category.value}>
                        {category.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-notes">Notes (Optional)</Label>
                  <Textarea
                    id="edit-notes"
                    placeholder="Opening hours, ticket information, etc."
                    value={editingLocation.notes}
                    onChange={(e) =>
                      setEditingLocation({
                        ...editingLocation,
                        notes: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
            )}
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsEditingLocation(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleEditLocation}>Save Changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-gray-100 rounded-lg min-h-[400px] flex items-center justify-center">
          {trip.locations.length === 0 ? (
            <div className="text-center p-6">
              <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No locations added</h3>
              <p className="text-gray-600 mb-4">
                Add locations to see them on the map
              </p>
              <Button onClick={() => setIsAddingLocation(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add First Location
              </Button>
            </div>
          ) : (
            <div className="w-full h-full p-4 flex items-center justify-center">
              <div className="text-2xl text-gray-500">Map</div>
              <div className="sr-only">
                Map showing {trip.locations.length} locations:{" "}
                {trip.locations.map((loc) => loc.name).join(", ")}
              </div>
            </div>
          )}
        </div>

        <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
          {trip.locations.length === 0 ? (
            <Card>
              <CardContent className="p-6 text-center text-gray-500">
                No locations added yet
              </CardContent>
            </Card>
          ) : (
            trip.locations.map((location) => (
              <Card key={location.id}>
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
                        onClick={() => handleDeleteLocation(location.id)}
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

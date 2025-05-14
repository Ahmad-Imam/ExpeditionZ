"use client";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
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
import { Loader2, LoaderCircle, Plus } from "lucide-react";
import AddLocationMap from "./AddLocationMap";
import useFetch from "@/hooks/useFetch";
import { addLocationAction } from "@/actions/location";
import { toast } from "sonner";

export default function AddLocation({ trip }) {
  const [isAddingLocation, setIsAddingLocation] = React.useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
    watch,
  } = useForm({
    defaultValues: {
      name: "",
      address: "",
      notes: "",
      category: "attraction",
    },
  });

  const {
    data: locationData,
    error: locationError,
    fn: addLocationFn,
    loading: locationLoading,
  } = useFetch(addLocationAction);

  const locationCategories = [
    { value: "attraction", label: "Attraction" },
    { value: "restaurant", label: "Restaurant" },
    { value: "accommodation", label: "Accommodation" },
    { value: "shopping", label: "Shopping" },
    { value: "transportation", label: "Transportation" },
    { value: "other", label: "Other" },
  ];

  const onSubmit = async (data) => {
    const newData = {
      ...data,
      tripId: trip.id,
    };
    await addLocationFn(newData);
  };

  useEffect(() => {
    if (locationData && !locationLoading) {
      toast.success("Location added successfully!");
      setIsAddingLocation(false);
      reset();
    }
    if (locationError && !locationLoading) {
      toast.error("Error adding location: " + locationError.message);
    }
  }, [locationData, locationError, locationLoading]);

  function handleMapSelect({ address, lng, lat }) {
    setValue("address", address);
    setValue("lng", lng);
    setValue("lat", lat);
  }

  return (
    <div>
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
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  placeholder="Location name"
                  {...register("name", { required: "Name is required" })}
                />
                {errors.name && (
                  <span className="text-red-500 text-xs">
                    {errors.name.message}
                  </span>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="category">Category</Label>
                <select
                  id="category"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  {...register("category", { required: true })}
                >
                  {locationCategories.map((category) => (
                    <option key={category.value} value={category.value}>
                      {category.label}
                    </option>
                  ))}
                </select>
                {errors.category && (
                  <span className="text-red-500 text-xs">
                    Category is required
                  </span>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="notes">Notes (Optional)</Label>
                <Textarea
                  id="notes"
                  placeholder="Opening hours, ticket information, etc."
                  {...register("notes")}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="address">Address (from map)</Label>
                <Input
                  id="address"
                  placeholder="Select a location on the map"
                  {...register("address", { required: "Address is required" })}
                  readOnly
                  hidden
                />
                {errors.address && (
                  <span className="text-red-500 text-xs">
                    {errors.address.message}
                  </span>
                )}
              </div>
            </div>
            <div className="relative min-h-[200px] w-full rounded-md overflow-hidden my-4">
              <AddLocationMap onSelect={handleMapSelect} />
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                type="button"
                onClick={() => setIsAddingLocation(false)}
              >
                Cancel
              </Button>
              {locationLoading ? (
                <Button type="submit" disabled>
                  <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                  Adding...
                </Button>
              ) : (
                <Button type="submit" disabled={locationLoading}>
                  Add Location
                </Button>
              )}
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

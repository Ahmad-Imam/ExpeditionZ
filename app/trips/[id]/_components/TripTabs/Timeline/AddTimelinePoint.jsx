"use client";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus } from "lucide-react";
import useFetch from "@/hooks/useFetch";
import { createTimelinePointAction } from "@/actions/timeline";
import { toast } from "sonner";

export default function AddTimelinePoint({ trip }) {
  const [isAddingPoint, setIsAddingPoint] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: "",
      description: "",
      date: "",
      time: "",
    },
  });

  const {
    data: newTimelinePoint,
    error: newTimelinePointError,
    fn: createTimelinePointFn,
    loading: isCreatingTimelinePoint,
  } = useFetch(createTimelinePointAction);

  async function onSubmit(data) {
    const newData = {
      ...data,
      tripId: trip.id,
    };
    console.log(newData);

    // await createTimelinePointFn(newData);
    setIsAddingPoint(false);
  }

  useEffect(() => {
    if (newTimelinePoint && !isCreatingTimelinePoint) {
      console.log("New timeline point created:", newTimelinePoint);
      toast.success("Timeline point created successfully!");
      reset();
    }
    if (newTimelinePointError) {
      console.error("Error creating timeline point:", newTimelinePointError);
      toast.error(
        "Error creating timeline point: " + newTimelinePointError.message
      );
    }
  }, [newTimelinePoint, newTimelinePointError, isCreatingTimelinePoint]);

  return (
    <div>
      <Dialog open={isAddingPoint} onOpenChange={setIsAddingPoint}>
        <DialogTrigger asChild>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Timeline Point
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Timeline Point</DialogTitle>
            <DialogDescription>
              Add a new point to your trip timeline.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  placeholder="Flight to Paris"
                  {...register("title", { required: "Title is required" })}
                />
                {errors.title && (
                  <p className="text-red-600 text-sm">{errors.title.message}</p>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description (Optional)</Label>
                <Textarea
                  id="description"
                  placeholder="Flight details, terminal information, etc."
                  {...register("description")}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  {...register("date", { required: "Date is required" })}
                />
                {errors.date && (
                  <p className="text-red-600 text-sm">{errors.date.message}</p>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="time">Time (Optional)</Label>
                <Input id="time" type="time" {...register("time")} />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                type="button"
                onClick={() => setIsAddingPoint(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isCreatingTimelinePoint}>
                {isCreatingTimelinePoint ? "Adding..." : "Add Point"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

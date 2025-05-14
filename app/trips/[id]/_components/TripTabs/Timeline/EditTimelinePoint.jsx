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
import { Edit } from "lucide-react";
import useFetch from "@/hooks/useFetch";
import { updateTimelinePointAction } from "@/actions/timeline";
import { toast } from "sonner";

export default function EditTimelinePoint({ trip, timelinePoint }) {
  const [isEditingPoint, setIsEditingPoint] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: timelinePoint.title,
      description: timelinePoint.description || "",
      date: new Date(timelinePoint.date).toISOString().slice(0, 10),
      time: timelinePoint.time || "",
    },
  });

  const {
    data: updatedTimelinePoint,
    error: updateTimelinePointError,
    fn: updateTimelinePointFn,
    loading: isUpdatingTimelinePoint,
  } = useFetch(updateTimelinePointAction);

  async function onSubmit(data) {
    const updatedData = {
      ...data,
      id: timelinePoint.id,
      tripId: trip.id,
    };

    await updateTimelinePointFn(updatedData);
    setIsEditingPoint(false);
  }

  useEffect(() => {
    if (updatedTimelinePoint && !isUpdatingTimelinePoint) {
      toast.success("Timeline point updated successfully!");
      reset();
    }
    if (updateTimelinePointError) {
      console.error("Error updating timeline point:", updateTimelinePointError);
      toast.error(
        "Error updating timeline point: " + updateTimelinePointError.message
      );
    }
  }, [updatedTimelinePoint, updateTimelinePointError, isUpdatingTimelinePoint]);

  return (
    <div>
      <Dialog open={isEditingPoint} onOpenChange={setIsEditingPoint}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm">
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Timeline Point</DialogTitle>
            <DialogDescription>
              Update the details of your timeline point.
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
                onClick={() => setIsEditingPoint(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isUpdatingTimelinePoint}>
                {isUpdatingTimelinePoint ? "Updating..." : "Update Point"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

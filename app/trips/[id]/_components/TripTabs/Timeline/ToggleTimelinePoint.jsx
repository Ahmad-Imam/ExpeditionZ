"use client";
import { toggleTimelinePointAction } from "@/actions/timeline";
import { Button } from "@/components/ui/button";
import { LoaderIcon, CheckCircle, Circle } from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";

export default function ToggleTimelinePoint({ timelinePoint, trip }) {
  const [loading, setLoading] = useState(false);

  async function handleToggleTimelinePoint(timelinePoint) {
    setLoading(true);

    try {
      await toggleTimelinePointAction({
        data: { id: timelinePoint?.id, tripId: trip.id },
        newVal: !timelinePoint?.completed,
      });

      toast.success(
        `Timeline point marked as ${
          timelinePoint?.completed ? "incomplete" : "completed"
        }`
      );
    } catch (error) {
      console.error("Error toggling timeline point:", error);
      toast.error("Error toggling timeline point: " + error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <Button
        variant="ghost"
        size="icon"
        className="w-full flex items-center justify-center p-2"
        onClick={() => handleToggleTimelinePoint(timelinePoint)}
        disabled={loading}
      >
        {loading ? (
          <LoaderIcon className="h-4 w-4 animate-spin" />
        ) : timelinePoint?.completed ? (
          <div className="flex items-center space-x-2">
            <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
            Mark Incomplete
          </div>
        ) : (
          <div className="flex items-center space-x-2">
            <Circle className="h-4 w-4 text-gray-600 mr-2" />
            Mark Complete
          </div>
        )}
      </Button>
    </div>
  );
}

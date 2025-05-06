"use client";
import { deleteTimelinePointAction } from "@/actions/timeline";
import { Button } from "@/components/ui/button";
import { LoaderIcon, Trash2 } from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";

export default function DeleteTimelinePoint({ timelinePoint, trip }) {
  const [loading, setLoading] = useState(false);

  async function handleDeleteTimelinePoint(timelinePoint) {
    setLoading(true);
    console.log("Delete timeline point with ID:", timelinePoint?.id);
    try {
      await deleteTimelinePointAction({
        id: timelinePoint?.id,
        tripId: trip.id,
      });
      console.log("Timeline point deleted successfully");
      toast.success("Timeline point deleted successfully");
    } catch (error) {
      console.error("Error deleting timeline point:", error);
      toast.error("Error deleting timeline point: " + error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <Button
        variant={"destructive"}
        onClick={() => handleDeleteTimelinePoint(timelinePoint)}
        disabled={loading}
      >
        {loading ? (
          <LoaderIcon className="h-4 w-4 animate-spin" />
        ) : (
          <>
            <Trash2 className="h-4 w-4 " />
            Delete
          </>
        )}
      </Button>
    </div>
  );
}

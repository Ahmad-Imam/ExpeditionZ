"use client";
import { deletePollAction } from "@/actions/poll";
import { Button } from "@/components/ui/button";
import { LoaderIcon, Trash2 } from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";

export default function DeletePoll({ poll }) {
  const [loading, setLoading] = useState(false);

  async function handleDeletePoll(poll) {
    try {
      setLoading(true);
      await deletePollAction(poll);
      toast.success("Poll deleted successfully");
    } catch (error) {
      console.error("Error deleting poll:", error);
      toast.error("Failed to delete poll. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => handleDeletePoll(poll)}
        title="Delete poll"
        disabled={loading}
      >
        {loading ? (
          <LoaderIcon className="h-4 w-4 animate-spin " />
        ) : (
          <div className="flex items-center gap-2 justify-center">
            <Trash2 className="h-4 w-4 " />
          </div>
        )}
      </Button>
    </div>
  );
}

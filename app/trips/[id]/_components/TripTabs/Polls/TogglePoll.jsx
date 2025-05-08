"use client";
import { togglePollAction } from "@/actions/poll";
import { Button } from "@/components/ui/button";
import { Check, LoaderIcon, Repeat, X } from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";

export default function TogglePoll({ poll }) {
  const [loading, setLoading] = useState(false);

  async function handleTogglePoll(poll) {
    try {
      setLoading(true);

      await togglePollAction(poll);
      toast.success(
        poll.isActive ? "Poll ended successfully" : "Poll reopened successfully"
      );
    } catch (error) {
      console.error("Error toggling poll:", error);
      toast.error("Failed to change poll. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="">
      {poll.isActive ? (
        <Button
          variant="ghost"
          size="icon"
          onClick={() => handleTogglePoll(poll)}
          title="End poll"
          disabled={loading}
        >
          {loading ? (
            <LoaderIcon className="h-4 w-4 animate-spin " />
          ) : (
            <div>
              <X className="h-4 w-4 " />
            </div>
          )}
        </Button>
      ) : (
        <Button
          variant="ghost"
          size="icon"
          onClick={() => handleTogglePoll(poll)}
          title="Reopen poll"
          disabled={loading}
        >
          {loading ? (
            <LoaderIcon className="h-4 w-4 animate-spin " />
          ) : (
            <div className="flex items-center gap-2 justify-center">
              <Repeat className="h-4 w-4 " />
            </div>
          )}
        </Button>
      )}
    </div>
  );
}

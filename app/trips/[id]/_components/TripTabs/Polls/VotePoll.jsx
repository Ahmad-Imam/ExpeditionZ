"use client";
import { toggleVotePollAction, votePollAction } from "@/actions/poll";
import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import { toast } from "sonner";

export default function VotePoll({ trip, poll, option, loggedMember }) {
  const [loading, setLoading] = useState(false);

  const getUserVote = (poll) => {
    return poll.options.find((option) =>
      option.votes.some((vote) => vote.memberId === loggedMember?.id)
    );
  };

  const userVote = getUserVote(poll);

  async function handleVote(pollId, optionId) {
    try {
      setLoading(true);
      await toggleVotePollAction(pollId, optionId);
      toast.success("Vote updated successfully!");
    } catch (error) {
      console.error("Error voting:", error);
      toast.error("Error updating vote. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <Button
        key={option.id}
        variant={userVote?.id === option.id ? "default" : "outline"}
        size=""
        onClick={() => handleVote(poll.id, option.id)}
        className="justify-center w-full text-center"
      >
        {loading ? (
          <div className="animate-spin h-4 w-4 border-2 border-t-transparent rounded-full"></div>
        ) : (
          option.text
        )}
      </Button>
    </div>
  );
}

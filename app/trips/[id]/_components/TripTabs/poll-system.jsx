"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { Check, Plus, Trash2, Vote, X } from "lucide-react";
import { useState } from "react";

export default function PollSystem({ trip, setTrip }) {
  const [newPoll, setNewPoll] = useState({
    question: "",
    options: [
      { id: "1", text: "", votes: [] },
      { id: "2", text: "", votes: [] },
    ],
  });
  const [isAddingPoll, setIsAddingPoll] = useState(false);

  const handleAddPoll = () => {
    if (!newPoll.question || newPoll.options?.some((opt) => !opt.text)) return;

    const poll = {
      id: Date.now().toString(),
      question: newPoll.question,
      options: newPoll.options,
      createdAt: new Date().toISOString(),
      isActive: true,
    };

    setTrip({
      ...trip,
      polls: [...trip.polls, poll],
    });

    setNewPoll({
      question: "",
      options: [
        { id: "1", text: "", votes: [] },
        { id: "2", text: "", votes: [] },
      ],
    });

    setIsAddingPoll(false);
  };

  const handleAddOption = () => {
    if (!newPoll.options) return;

    setNewPoll({
      ...newPoll,
      options: [
        ...newPoll.options,
        { id: (newPoll.options.length + 1).toString(), text: "", votes: [] },
      ],
    });
  };

  const handleRemoveOption = (index) => {
    if (!newPoll.options || newPoll.options.length <= 2) return;

    setNewPoll({
      ...newPoll,
      options: newPoll.options.filter((_, i) => i !== index),
    });
  };

  const handleOptionChange = (index, value) => {
    if (!newPoll.options) return;

    const updatedOptions = [...newPoll.options];
    updatedOptions[index] = { ...updatedOptions[index], text: value };

    setNewPoll({
      ...newPoll,
      options: updatedOptions,
    });
  };

  const handleVote = (pollId, optionId) => {
    const userId = trip.members[0].id; // In a real app, this would be the current user's ID

    setTrip({
      ...trip,
      polls: trip.polls.map((poll) => {
        if (poll.id !== pollId) return poll;

        // Remove user's vote from any other option in this poll
        const updatedOptions = poll.options.map((option) => {
          if (option.id === optionId) {
            // Add vote to this option if not already voted
            return option.votes.includes(userId)
              ? option // Already voted for this option
              : { ...option, votes: [...option.votes, userId] };
          } else {
            // Remove vote from other options
            return {
              ...option,
              votes: option.votes.filter((id) => id !== userId),
            };
          }
        });

        return { ...poll, options: updatedOptions };
      }),
    });
  };

  const handleEndPoll = (pollId) => {
    setTrip({
      ...trip,
      polls: trip.polls.map((poll) =>
        poll.id === pollId ? { ...poll, isActive: false } : poll
      ),
    });
  };

  const handleReopenPoll = (pollId) => {
    setTrip({
      ...trip,
      polls: trip.polls.map((poll) =>
        poll.id === pollId ? { ...poll, isActive: true } : poll
      ),
    });
  };

  const handleDeletePoll = (pollId) => {
    setTrip({
      ...trip,
      polls: trip.polls.filter((poll) => poll.id !== pollId),
    });
  };

  const getWinningOption = (poll) => {
    if (poll.options.length === 0) return null;

    return poll.options.reduce((prev, current) =>
      current.votes.length > prev.votes.length ? current : prev
    );
  };

  const hasUserVoted = (poll) => {
    const userId = trip.members[0].id; // In a real app, this would be the current user's ID
    return poll.options.some((option) => option.votes.includes(userId));
  };

  const getUserVote = (poll) => {
    const userId = trip.members[0].id; // In a real app, this would be the current user's ID
    return poll.options.find((option) => option.votes.includes(userId));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-bold text-purple-900">Group Polls</h3>

        <Dialog open={isAddingPoll} onOpenChange={setIsAddingPoll}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Poll
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Poll</DialogTitle>
              <DialogDescription>
                Create a poll for your group to vote on.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="question">Question</Label>
                <Input
                  id="question"
                  placeholder="Where should we eat dinner tonight?"
                  value={newPoll.question}
                  onChange={(e) =>
                    setNewPoll({ ...newPoll, question: e.target.value })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label>Options</Label>
                <div className="space-y-2">
                  {newPoll.options?.map((option, index) => (
                    <div key={option.id} className="flex gap-2">
                      <Input
                        placeholder={`Option ${index + 1}`}
                        value={option.text}
                        onChange={(e) =>
                          handleOptionChange(index, e.target.value)
                        }
                      />
                      {newPoll.options && newPoll.options.length > 2 && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveOption(index)}
                        >
                          <Trash2 className="h-4 w-4 text-gray-500" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleAddOption}
                  className="mt-2"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Option
                </Button>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddingPoll(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleAddPoll}
                disabled={
                  !newPoll.question || newPoll.options?.some((opt) => !opt.text)
                }
              >
                Create Poll
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {trip.polls.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border">
          <div className="bg-purple-100 inline-block p-4 rounded-full mb-4">
            <Vote className="h-8 w-8 text-purple-600" />
          </div>
          <h3 className="text-xl font-semibold mb-2">No polls created yet</h3>
          <p className="text-gray-600 mb-6">
            Create polls to help your group make decisions
          </p>
          <Button onClick={() => setIsAddingPoll(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create First Poll
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {trip.polls.map((poll) => {
            const totalVotes = poll.options.reduce(
              (sum, option) => sum + option.votes.length,
              0
            );
            const winningOption = getWinningOption(poll);
            const userVote = getUserVote(poll);

            return (
              <Card
                key={poll.id}
                className={!poll.isActive ? "opacity-70" : ""}
              >
                <CardHeader className="pb-2">
                  <div className="flex justify-between">
                    <CardTitle className="text-lg">{poll.question}</CardTitle>
                    <div className="flex gap-1">
                      {poll.isActive ? (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEndPoll(poll.id)}
                          title="End poll"
                        >
                          <X className="h-4 w-4 text-gray-500" />
                        </Button>
                      ) : (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleReopenPoll(poll.id)}
                          title="Reopen poll"
                        >
                          <Check className="h-4 w-4 text-gray-500" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeletePoll(poll.id)}
                        title="Delete poll"
                      >
                        <Trash2 className="h-4 w-4 text-gray-500" />
                      </Button>
                    </div>
                  </div>
                  <div className="text-sm text-gray-600 flex items-center gap-2">
                    {poll.isActive ? (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        Closed
                      </span>
                    )}
                    <span>{totalVotes} votes</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {poll.options.map((option) => {
                      const percentage =
                        totalVotes > 0
                          ? Math.round((option.votes.length / totalVotes) * 100)
                          : 0;

                      const isWinning =
                        !poll.isActive &&
                        winningOption?.id === option.id &&
                        totalVotes > 0;
                      const isUserVote = userVote?.id === option.id;

                      return (
                        <div key={option.id} className="space-y-1">
                          <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                              <span
                                className={`font-medium ${
                                  isUserVote ? "text-purple-700" : ""
                                }`}
                              >
                                {option.text}
                              </span>
                              {isWinning && (
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                  Winner
                                </span>
                              )}
                              {isUserVote && poll.isActive && (
                                <span className="text-xs text-purple-600">
                                  Your vote
                                </span>
                              )}
                            </div>
                            <span className="text-sm font-medium">
                              {percentage}%
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full ${
                                isWinning ? "bg-purple-600" : "bg-purple-400"
                              }`}
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                          <div className="text-xs text-gray-500">
                            {option.votes.length} vote
                            {option.votes.length !== 1 ? "s" : ""}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
                {poll.isActive && (
                  <CardFooter className="flex-col items-stretch gap-2 pt-2">
                    <div className="text-sm font-medium mb-1">
                      Cast your vote:
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {poll.options.map((option) => (
                        <Button
                          key={option.id}
                          variant={
                            userVote?.id === option.id ? "default" : "outline"
                          }
                          size="sm"
                          onClick={() => handleVote(poll.id, option.id)}
                          className="justify-start"
                        >
                          {option.text}
                        </Button>
                      ))}
                    </div>
                  </CardFooter>
                )}
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

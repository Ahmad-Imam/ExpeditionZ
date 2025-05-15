import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Vote } from "lucide-react";

import AddPoll from "./AddPoll";
import TogglePoll from "./TogglePoll";
import DeletePoll from "./DeletePoll";
import VotePoll from "./VotePoll";
import { getLoggedUser } from "@/actions/user";
import { getLoggedTripMember } from "@/actions/trip";

export default async function PollSystem({ trip, loggedUser }) {
  const loggedMember = await getLoggedTripMember(trip.id);

  const getWinningOption = (poll) => {
    if (poll?.options.length === 0) return null;

    return poll?.options.reduce((prev, current) =>
      current.votes.length > prev.votes.length ? current : prev
    );
  };

  const getUserVote = (poll) => {
    return poll.options.find((option) =>
      option.votes.some((vote) => vote.memberId === loggedMember?.id)
    );
  };

  const filteredPolls = trip?.polls?.sort(
    (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-bold ">Group Polls</h3>

        {loggedUser && <AddPoll trip={trip} />}
      </div>

      {trip.polls?.length === 0 ? (
        <div className="text-center py-12  rounded-lg border">
          <div className=" inline-block p-4 rounded-full mb-4">
            <Vote className="h-8 w-8 " />
          </div>
          <h3 className="text-xl font-semibold mb-2">No polls created yet</h3>
          <p className=" mb-6">
            Create polls to help your group make decisions
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredPolls.map((poll) => {
            const totalVotes = poll.options?.reduce(
              (sum, option) => sum + option.votes.length,
              0
            );
            const winningOption = getWinningOption(poll);
            const userVote = getUserVote(poll);

            return (
              <Card
                key={poll.id}
                className={!poll.isActive ? "opacity-90" : ""}
              >
                <CardHeader className="pb-2">
                  <div className="flex justify-between">
                    <CardTitle className="text-lg">{poll.question}</CardTitle>
                    {loggedUser && (
                      <div className="flex justify-between items-center gap-2">
                        <TogglePoll poll={poll} />
                        <DeletePoll poll={poll} />
                      </div>
                    )}
                  </div>
                  <div className="text-md  flex items-center gap-2">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-sm font-medium bg-primary">
                      {poll.isActive ? "Active" : "Closed"}
                    </span>

                    <span className="text-secondary font-bold">
                      {totalVotes} votes
                    </span>
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
                                  isUserVote ? "" : ""
                                }`}
                              >
                                {option.text}
                              </span>
                              {isWinning && (
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-md font-bold  ">
                                  (Winner)
                                </span>
                              )}
                              {isUserVote && poll.isActive && (
                                <span className="text-sm ">(Your vote)</span>
                              )}
                            </div>
                            <span className="text-sm font-medium">
                              {percentage}%
                            </span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-2">
                            <div
                              className={`h-2 rounded-full ${
                                isWinning ? "bg-primary" : ""
                              }`}
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                          <div className="text-md ">
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
                    <div className="grid grid-cols-2 gap-6">
                      {poll.options.map((option) => (
                        <VotePoll
                          key={option.id}
                          trip={trip}
                          poll={poll}
                          option={option}
                          loggedMember={loggedMember}
                        />
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

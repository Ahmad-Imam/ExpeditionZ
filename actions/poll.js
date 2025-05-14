"use server";

import { db } from "@/lib/prisma";
import { getLoggedUser } from "./user";
import { revalidatePath } from "next/cache";

export async function createPollAction(data) {
  const loggedUser = await getLoggedUser();
  if (!loggedUser) throw new Error("User not logged in");

  const { tripId, question, options } = data;

  if (!tripId) throw new Error("Trip ID is required");
  if (!question) throw new Error("Question is required");
  if (!options || options.length < 2)
    throw new Error("At least two options are required");

  const poll = await db.poll.create({
    data: {
      tripId,
      question,
      options: {
        create: options.map((option) => ({
          text: option.text,
          votes: {
            create: [],
          },
        })),
      },
    },
  });

  revalidatePath(`/trips/${tripId}`);
  return poll;
}

export async function togglePollAction(poll) {
  const loggedUser = await getLoggedUser();
  if (!loggedUser) throw new Error("User not logged in");

  const { id, isActive } = poll;

  if (!id) throw new Error("Poll ID is required");
  if (isActive === undefined) throw new Error("Poll status is required");

  const updatedPoll = await db.poll.update({
    where: { id: id },
    data: { isActive: !isActive },
  });

  revalidatePath(`/trips/${poll.tripId}`);
  return updatedPoll;
}

export async function deletePollAction(poll) {
  const loggedUser = await getLoggedUser();
  if (!loggedUser) throw new Error("User not logged in");

  const { id } = poll;

  if (!id) throw new Error("Poll ID is required");

  const deletedPoll = await db.poll.delete({
    where: { id: id },
  });

  revalidatePath(`/trips/${poll.tripId}`);
  return deletedPoll;
}

export async function votePollAction(pollId, optionId) {
  const loggedUser = await getLoggedUser();
  if (!loggedUser) throw new Error("User not logged in");

  if (!pollId) throw new Error("Poll ID is required");
  if (!optionId) throw new Error("Option ID is required");

  const poll = await db.poll.findUnique({ where: { id: pollId } });
  if (!poll) throw new Error("Poll not found");

  const member = await db.member.findFirst({
    where: { userId: loggedUser.id, tripId: poll.tripId },
  });
  if (!member) throw new Error("Member not found for this trip");

  const alreadyVoted = await db.pollVote.findFirst({
    where: {
      memberId: member.id,
      option: { pollId },
    },
  });
  if (alreadyVoted) throw new Error("Already voted in this poll");

  await db.pollVote.create({
    data: {
      memberId: member.id,
      optionId,
    },
  });

  const updatedPoll = await db.poll.findUnique({
    where: { id: pollId },
    include: { options: { include: { votes: true } } },
  });

  revalidatePath(`/trips/${poll.tripId}`);
  return updatedPoll;
}

export async function unvotePollAction(pollId, optionId) {
  const loggedUser = await getLoggedUser();
  if (!loggedUser) throw new Error("User not logged in");

  if (!pollId) throw new Error("Poll ID is required");
  if (!optionId) throw new Error("Option ID is required");

  const poll = await db.poll.findUnique({ where: { id: pollId } });
  if (!poll) throw new Error("Poll not found");

  const member = await db.member.findFirst({
    where: { userId: loggedUser.id, tripId: poll.tripId },
  });
  if (!member) throw new Error("Member not found for this trip");

  const deletedPoll = await db.pollVote.deleteMany({
    where: {
      memberId: member.id,
      optionId,
    },
  });

  revalidatePath(`/trips/${poll.tripId}`);
  return deletedPoll;
}

export async function toggleVotePollAction(pollId, optionId) {
  const loggedUser = await getLoggedUser();
  if (!loggedUser) throw new Error("User not logged in");

  if (!pollId) throw new Error("Poll ID is required");
  if (!optionId) throw new Error("Option ID is required");

  const poll = await db.poll.findUnique({ where: { id: pollId } });
  if (!poll) throw new Error("Poll not found");

  const member = await db.member.findFirst({
    where: { userId: loggedUser.id, tripId: poll.tripId },
  });
  if (!member) throw new Error("Member not found for this trip");

  const existingVote = await db.pollVote.findFirst({
    where: {
      memberId: member.id,
      optionId,
    },
  });

  if (existingVote) {
    await db.pollVote.delete({
      where: { id: existingVote.id },
    });
  } else {
    await db.pollVote.deleteMany({
      where: {
        memberId: member.id,
        option: { pollId },
      },
    });

    await db.pollVote.create({
      data: {
        memberId: member.id,
        optionId,
      },
    });
  }

  const updatedPoll = await db.poll.findUnique({
    where: { id: pollId },
    include: { options: { include: { votes: true } } },
  });

  revalidatePath(`/trips/${poll.tripId}`);
  return updatedPoll;
}

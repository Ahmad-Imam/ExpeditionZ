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

  console.log("Poll created:", poll);
  revalidatePath(`/trips/${tripId}`);
  return poll;
}

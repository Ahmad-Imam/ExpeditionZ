"use server";

import { db } from "@/lib/prisma";
import { getLoggedUser } from "./user";
import { revalidatePath } from "next/cache";
import { getLoggedTripMember } from "./trip";

export async function createTimelinePointAction(data) {
  const loggedTripMember = await getLoggedTripMember(data?.tripId);
  if (!loggedTripMember)
    throw new Error("Unauthorized. You need to be a member of this trip.");

  const { tripId, date } = data;

  if (!tripId) throw new Error("Trip ID is required");

  const timelinePoint = await db.timelinePoint.create({
    data: {
      ...data,
      date: new Date(date),
    },
  });

  revalidatePath(`/trips/${tripId}`);
  return timelinePoint;
}

export async function updateTimelinePointAction(data) {
  const loggedTripMember = await getLoggedTripMember(data?.tripId);
  if (!loggedTripMember)
    throw new Error("Unauthorized. You need to be a member of this trip.");

  const { tripId, id } = data;

  if (!tripId) throw new Error("Trip ID is required");
  if (!id) throw new Error("Timeline point ID is required");

  const timelinePoint = await db.timelinePoint.update({
    where: {
      id,
    },
    data: {
      ...data,
      date: new Date(data.date),
    },
  });

  revalidatePath(`/trips/${tripId}`);
  return timelinePoint;
}

export async function deleteTimelinePointAction(data) {
  const loggedTripMember = await getLoggedTripMember(data?.tripId);
  if (!loggedTripMember)
    throw new Error("Unauthorized. You need to be a member of this trip.");

  const { tripId, id } = data;

  if (!tripId) throw new Error("Trip ID is required");
  if (!id) throw new Error("Timeline point ID is required");

  const timelinePoint = await db.timelinePoint.delete({
    where: {
      id,
    },
  });

  revalidatePath(`/trips/${tripId}`);
  return timelinePoint;
}

export async function toggleTimelinePointAction({ data, newVal }) {
  const loggedTripMember = await getLoggedTripMember(data?.tripId);
  if (!loggedTripMember)
    throw new Error("Unauthorized. You need to be a member of this trip.");

  const { tripId, id } = data;

  if (!tripId) throw new Error("Trip ID is required");
  if (!id) throw new Error("Timeline point ID is required");

  const timelinePoint = await db.timelinePoint.update({
    where: {
      id,
    },
    data: {
      completed: newVal,
    },
  });

  revalidatePath(`/trips/${tripId}`);
  return timelinePoint;
}

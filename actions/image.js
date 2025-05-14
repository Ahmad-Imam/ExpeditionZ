"use server";

import { db } from "@/lib/prisma";
import { getLoggedTripMember } from "./trip";
import { revalidatePath } from "next/cache";

export async function addImageToTrip({ tripId, imageObj }) {
  const loggedTripMember = await getLoggedTripMember(tripId);
  if (!loggedTripMember) throw new Error("Unauthorized");

  const trip = await db.trip.update({
    where: {
      id: tripId,
    },
    data: {
      images: {
        push: imageObj,
      },
    },
  });
  revalidatePath(`/trips/${trip.id}`);
  return trip;
}

export async function deleteImageFromTrip({ trip, fileId }) {
  const loggedTripMember = await getLoggedTripMember(trip?.id);
  if (!loggedTripMember) throw new Error("Unauthorized");

  const updatedTrip = await db.trip.update({
    where: {
      id: trip.id,
    },
    data: {
      images: {
        set: trip.images.filter((image) => image.fileId !== fileId),
      },
    },
  });

  revalidatePath(`/trips/${trip.id}`);
  return updatedTrip;
}

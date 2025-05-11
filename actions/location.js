"use server";

import { db } from "@/lib/prisma";
import { getLoggedUser } from "./user";
import { revalidatePath } from "next/cache";

export async function addLocationAction(data) {
  const loggedUser = await getLoggedUser();

  if (!loggedUser) throw new Error("Unauthorized");

  const newLocation = await db.location.create({
    data: {
      ...data,
    },
  });

  revalidatePath("/trips/" + data.tripId);

  return newLocation;
}

export async function deleteLocationAction(locationId) {
  const loggedUser = await getLoggedUser();

  if (!loggedUser) throw new Error("Unauthorized");

  const deletedLocation = await db.location.delete({
    where: {
      id: locationId,
    },
  });

  revalidatePath("/trips/" + deletedLocation.tripId);

  return deletedLocation;
}

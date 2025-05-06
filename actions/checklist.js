"use server";

//action to create a checklist item

import { db } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getLoggedUser } from "./user";

export async function createCheckListItemAction(data) {
  const loggedUser = await getLoggedUser();
  if (!loggedUser) throw new Error("Unauthorized");

  const { tripId, title, category, assignedTo } = data;

  if (!tripId) throw new Error("Trip ID is required");

  const checklistItem = await db.checklistItem.create({
    data: {
      tripId,
      title,
      category,
      assignedToId: assignedTo,
    },
  });
  console.log("Checklist item created:", checklistItem);
  revalidatePath(`/trips/${tripId}`);
  return checklistItem;
}

export async function editCheckListItemAction(data) {
  const loggedUser = await getLoggedUser();
  if (!loggedUser) throw new Error("Unauthorized");

  const { id, title, category, assignedTo, completed } = data;

  if (!id) throw new Error("Checklist item ID is required");

  const checklistItem = await db.checklistItem.update({
    where: { id },
    data: {
      title,
      category,
      assignedToId: assignedTo,
      completed,
    },
  });
  console.log("Checklist item updated:", checklistItem);
  revalidatePath(`/trips/${checklistItem.tripId}`);
  return checklistItem;
}

export async function deleteCheckListItemAction(data) {
  const loggedUser = await getLoggedUser();
  if (!loggedUser) throw new Error("Unauthorized");

  const { id } = data;

  if (!id) throw new Error("Checklist item ID is required");

  const checklistItem = await db.checklistItem.delete({
    where: { id },
  });
  revalidatePath(`/trips/${checklistItem.tripId}`);
  return checklistItem;
}

export async function toggleCheckListItemAction(itemId, val) {
  const loggedUser = await getLoggedUser();
  if (!loggedUser) throw new Error("Unauthorized");

  if (!itemId) throw new Error("Checklist item ID is required");

  const checklistItem = await db.checklistItem.update({
    where: { id: itemId },
    data: {
      completed: val,
    },
  });

  revalidatePath(`/trips/${checklistItem.tripId}`);
  return checklistItem;
}

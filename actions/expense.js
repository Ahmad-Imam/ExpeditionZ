"use server";
import { db } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

import { getLoggedTripMember } from "./trip";

export async function createExpenseAction(data) {
  const loggedTripMember = await getLoggedTripMember(data?.tripId);
  if (!loggedTripMember)
    throw new Error("Unauthorized. You need to be a member of this trip.");

  const { tripId, title, amount, paidBy, splitWith, category, date } = data;

  if (!tripId) throw new Error("Trip ID is required");

  const expense = await db.expense.create({
    data: {
      tripId,
      title,
      amount: Number(amount),
      category,
      date: new Date(date),
      paidById: paidBy,
      expenseMembers: {
        create: splitWith.map((memberId) => ({
          member: { connect: { id: memberId } },
        })),
      },
    },
    include: {
      expenseMembers: true,
    },
  });

  revalidatePath(`/trips/${tripId}`);
  return expense;
}

export async function updateExpenseAction(data) {
  const { id, tripId, title, amount, category, date, paidBy, splitWith } = data;
  const loggedTripMember = await getLoggedTripMember(data?.tripId);
  if (!loggedTripMember)
    throw new Error("Unauthorized. You need to be a member of this trip.");

  const existing = await db.expense.findUnique({
    where: { id },
    select: { tripId: true },
  });
  if (!existing || existing.tripId !== tripId) {
    throw new Error("Expense not found or access denied");
  }

  const existingEM = await db.expenseMember.findMany({
    where: { expenseId: id },
    select: { id: true, memberId: true },
  });
  const existingMemberIds = existingEM.map((em) => em.memberId);

  const toRemove = existingEM
    .filter((em) => !splitWith.includes(em.memberId))
    .map((em) => em.id);
  const toAdd = splitWith.filter((mid) => !existingMemberIds.includes(mid));

  const expense = await db.expense.update({
    where: { id },
    data: {
      title,
      amount: Number(amount),
      category,
      date: new Date(date),
      paidById: paidBy,
      expenseMembers: {
        deleteMany: toRemove.length ? { id: { in: toRemove } } : undefined,
        create: toAdd.map((memberId) => ({
          member: { connect: { id: memberId } },
        })),
      },
    },
    include: {
      expenseMembers: true,
    },
  });

  revalidatePath(`/trips/${tripId}`);
  return expense;
}

export async function repayExpenseAction({ expenseMember, hasRepaid, tripId }) {
  const loggedTripMember = await getLoggedTripMember(tripId);
  if (!loggedTripMember)
    throw new Error("Unauthorized. You need to be a member of this trip.");

  const { expenseId, id } = expenseMember;

  const existing = await db.expense.findUnique({
    where: { id: expenseId },
    select: { tripId: true },
  });
  if (!existing) throw new Error("Expense not found");

  const updated = await db.expenseMember.update({
    where: { id: id },
    data: {
      hasRepaid: hasRepaid,
    },
  });

  revalidatePath(`/trips/${existing.tripId}`);
  return updated;
}

export async function deleteExpenseAction({ id, tripId }) {
  const loggedTripMember = await getLoggedTripMember(tripId);
  if (!loggedTripMember)
    throw new Error("Unauthorized. You need to be a member of this trip.");

  const existing = await db.expense.findUnique({
    where: { id },
    select: { tripId: true },
  });
  if (!existing || existing.tripId !== tripId) {
    throw new Error("Expense not found or access denied");
  }

  const deleted = await db.expense.delete({
    where: { id },
  });

  revalidatePath(`/trips/${tripId}`);
  return deleted;
}

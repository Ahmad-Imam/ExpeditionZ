"use server";

import { db } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getLoggedUser } from "./user";

export async function searchUsersByName(query) {
  const loggedUser = await getLoggedUser();
  if (!loggedUser) throw new Error("Unauthorized");
  const q = query?.trim();
  if (!q) return [];

  const users = await db.user.findMany({
    where: {
      name: {
        contains: q,
        mode: "insensitive",
      },
    },
    select: {
      id: true,
      name: true,
      email: true,
    },
  });

  // console.log(users);
  return users;
}

export async function createTripAction(data) {
  //   console.log(data);
  const { name, destination, startDate, endDate, description, members } = data;

  const loggedUser = await getLoggedUser();
  if (!loggedUser) throw new Error("Unauthorized");

  const allMembers = [
    ...members,
    {
      id: loggedUser.id,
      name: loggedUser.name,
      isAdmin: true,
    },
  ];

  const trip = await db.trip.create({
    data: {
      name,
      destination,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      creatorId: loggedUser.id,
      description,
      members: {
        //   name: loggedUser.name,
        //   userId: loggedUser.id,
        //   isAdmin: true,
        // },
        create: allMembers.map((member) => ({
          name: member.name,
          userId: member.id,
          isAdmin: member.isAdmin || false,
        })),
      },
    },
  });

  return trip;
}

export async function updateTripAction(data) {
  const { id, name, destination, startDate, endDate, description, members } =
    data;

  const loggedUser = await getLoggedUser();
  if (!loggedUser) throw new Error("Unauthorized");

  const existingMembers = await db.member.findMany({
    where: { tripId: id },
    select: { id: true, userId: true },
  });

  const incomingUserIds = members.map((m) => m.userId);
  const existingUserIds = existingMembers.map((m) => m.userId);

  const toRemove = existingMembers.filter(
    (m) => !incomingUserIds.includes(m.userId)
  );

  const toAdd = members.filter((m) => !existingUserIds.includes(m.userId));

  const toUpdate = members.filter((m) => existingUserIds.includes(m.userId));

  const trip = await db.trip.update({
    where: { id },
    data: {
      name,
      destination,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      description,
      members: {
        deleteMany: {
          id: { in: toRemove.map((m) => m.id) },
        },
        create: toAdd.map((member) => ({
          name: member.name,
          userId: member.userId,
          isAdmin: member.isAdmin || false,
        })),
        update: toUpdate.map((member) => ({
          where: {
            tripId_userId: { tripId: id, userId: member.userId },
          },
          data: {
            name: member.name,
            isAdmin: member.isAdmin || false,
          },
        })),
      },
    },
  });

  revalidatePath(`/trips/${trip.id}`);
  return trip;
}

//get all trips for logged user
export async function getTrips() {
  const loggedUser = await getLoggedUser();
  if (!loggedUser) throw new Error("Unauthorized");

  const trips = await db.trip.findMany({
    where: {
      members: {
        some: {
          userId: loggedUser.id,
        },
      },
    },
    include: {
      members: true,
    },
  });

  return trips;
}

export async function getTripById(id) {
  const loggedUser = await getLoggedUser();
  if (!loggedUser) throw new Error("Unauthorized");

  const trip = await db.trip.findUnique({
    where: {
      id,
    },
    include: {
      members: true,
      polls: {
        include: {
          options: {
            include: {
              votes: true,
            },
          },
        },
      },
      expenses: {
        include: {
          expenseMembers: {
            include: {
              member: true, // if you want member details as well
            },
          },
        },
      },
      locations: true,
      checklist: true,
      timeline: true,
    },
  });

  return trip;
}

export async function getLoggedTripMember(tripId) {
  const loggedUser = await getLoggedUser();
  if (!loggedUser) throw new Error("Unauthorized. Please login.");

  const tripMember = await db.member.findFirst({
    where: {
      tripId,
      userId: loggedUser.id,
    },
  });

  return tripMember;
}

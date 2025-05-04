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

  const tripMembers = members.map((member) => {
    if (member.userId === data.creatorId) {
      return {
        ...member,
        isAdmin: true,
      };
    }
    return member;
  });

  const trip = await db.trip.update({
    where: {
      id,
    },
    data: {
      name,
      destination,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      description,
      members: {
        deleteMany: {
          tripId: id,
        },
        create: tripMembers.map((member) => ({
          name: member.name,
          userId: member.userId,
          isAdmin: member.isAdmin || false,
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
      polls: true,
      expenses: true,
      locations: true,
      checklist: true,
      timeline: true,
    },
  });

  return trip;
}

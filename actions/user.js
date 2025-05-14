"use server";
import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function getLoggedUser() {
  const { userId } = await auth();
  if (!userId) return null;

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  // if (!user) throw new Error("User not found");

  return user;
}

export async function updateUserPremiumStatus(isPremium) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.update({
    where: { clerkUserId: userId },
    data: { isPremium },
  });
  revalidatePath("/pricing");

  return user;
}

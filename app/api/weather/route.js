import { generateTripWeather } from "@/actions/generate";
import { NextResponse } from "next/server";

import { getLoggedUser } from "@/actions/user";

export async function POST(request) {
  const loggedUser = await getLoggedUser();
  if (!loggedUser) throw new Error("User not logged in");

  const { trip } = await request.json();

  if (!trip) throw new Error("Trip ID is required");

  const weatherData = await generateTripWeather(trip);

  return NextResponse.json(weatherData);
}

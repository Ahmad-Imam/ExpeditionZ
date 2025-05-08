//create api route to get weather data from generateWeatherData server action by passing trip object as parameter
import { generateTripWeather } from "@/actions/generate";
import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getLoggedUser } from "@/actions/user";
import { db } from "@/lib/prisma";

export async function POST(request) {
  const loggedUser = await getLoggedUser();
  if (!loggedUser) throw new Error("User not logged in");

  const { trip } = await request.json();

  if (!trip) throw new Error("Trip ID is required");

  const weatherData = await generateTripWeather(trip);

  //   console.log("Weather data generated:", weatherData);

  //   revalidatePath(`/trips/${tripId}`);
  return NextResponse.json(weatherData);
}

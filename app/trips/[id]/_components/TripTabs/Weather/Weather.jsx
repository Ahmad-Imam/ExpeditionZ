import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import WeatherClient from "./WeatherClient";

import Link from "next/link";
import { Gem } from "lucide-react";

export default async function Weather({ trip, loggedUser }) {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-bold ">Weather Forecast</h3>
      </div>

      {loggedUser?.isPremium ? (
        <Tabs defaultValue="current" className="w-full">
          <TabsList className="mb-6 w-full">
            <TabsTrigger value="current">Current</TabsTrigger>
            <TabsTrigger value="forecast">Forecast</TabsTrigger>
            <TabsTrigger value="trip">Trip Weather</TabsTrigger>
          </TabsList>

          <WeatherClient trip={trip} />
        </Tabs>
      ) : (
        <div className="text-center py-12  rounded-lg border">
          <div className=" inline-block p-4 rounded-full mb-4">
            <Gem className="h-8 w-8 " />
          </div>
          <h3 className="text-xl font-semibold mb-2">You don't have access</h3>
          <p className=" mb-6">
            Upgrade to Premium version to unlock this feature.
          </p>
          <Link
            href="/pricing"
            className="inline-flex items-center px-4 py-2 text-sm font-medium border border-accent rounded-md "
          >
            Upgrade to Premium
          </Link>
        </div>
      )}
    </div>
  );
}

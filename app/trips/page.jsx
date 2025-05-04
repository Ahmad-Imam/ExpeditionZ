import { Button } from "@/components/ui/button";
import { MapPin, Plus } from "lucide-react";
import Link from "next/link";

import { getTrips } from "@/actions/trip";
import TripsList from "./_components/TripsList";

export default async function TripsPage() {
  const allTrips = await getTrips();
  // console.log(allTrips);

  return (
    <div className="min-h-screen w-full">
      <header className=" mx-auto py-6 px-4">
        <div className="flex justify-between items-center">
          <Link href="/">
            <div className="flex items-center gap-2">
              <MapPin className="h-6 w-6 " />
              <h1 className="text-2xl font-bold ">ExpeditionZ</h1>
            </div>
          </Link>
          <Link href="/trips/new">
            <Button className="flex items-center justify-center gap-0">
              <Plus className="h-4 w-4 mr-2" />
              New Trip
            </Button>
          </Link>
        </div>
      </header>

      <TripsList allTrips={allTrips} />
    </div>
  );
}

"use client";
import { Input } from "@/components/ui/input";

import { Plane, Search } from "lucide-react";
import { useState } from "react";
import TripCard from "./TripCard";

import { Button } from "@/components/ui/button";
import { MapPin, Plus } from "lucide-react";
import Link from "next/link";

export default function TripsList({ allTrips }) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTrips = allTrips.filter(
    (trip) =>
      trip.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trip.destination.toLowerCase().includes(searchQuery.toLowerCase())
  );
  return (
    <div>
      <main className=" mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold ">My Trips</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search trips..."
              className="pl-10 w-full md:w-64"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {filteredTrips.length === 0 ? (
          <div className="text-center py-12">
            <div className="bg-muted inline-block p-4 rounded-full mb-4">
              <Plane className="h-8 w-8 " />
            </div>
            <h3 className="text-xl font-semibold mb-2">No trips found</h3>
            <p className=" mb-6">
              {searchQuery
                ? "Try a different search term"
                : "Start planning your first adventure"}
            </p>
            <Link href="/trips/new">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create New Trip
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTrips.map((trip) => (
              <TripCard key={trip.id} trip={trip} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

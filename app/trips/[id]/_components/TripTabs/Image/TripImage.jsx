import React from "react";
import TripImageList from "./_components/TripImageList";
import AddTripImage from "./_components/AddTripImage";

import { Gem } from "lucide-react";
import Link from "next/link";

export default async function TripImage({ trip, loggedUser, loggedMember }) {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-bold ">Trip Gallery</h3>
      </div>
      {!loggedUser?.isPremium ? (
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
      ) : (
        <div className="flex flex-col gap-10">
          <div className="flex gap-5 items-center justify-between">
            {loggedMember && <AddTripImage trip={trip} />}
          </div>
          <div>
            <TripImageList trip={trip} loggedMember={loggedMember} />
          </div>
        </div>
      )}
    </div>
  );
}

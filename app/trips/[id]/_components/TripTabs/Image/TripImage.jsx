import React from "react";
import TripImageList from "./_components/TripImageList";
import AddTripImage from "./_components/AddTripImage";

export default function TripImage({ trip }) {
  return (
    <div className="flex flex-col gap-10">
      <div className="flex gap-5 items-center justify-between">
        <div className="text-xl font-semibold">Store Image</div>
        <AddTripImage trip={trip} />
      </div>
      <div>
        <TripImageList trip={trip} />
      </div>
    </div>
  );
}

import { formatDate } from "@/lib/utils";
import { Calendar, MapPin, Users } from "lucide-react";
import EditTripDialog from "./EditTrip";

export default function TripHeader({ trip, loggedUser }) {
  const startDate = formatDate(trip?.startDate);
  const endDate = formatDate(trip?.endDate);

  return (
    <div className="flex justify-between items-center">
      <div className="mb-8">
        <h2 className="text-3xl 2xl:text-5xl font-bold ">{trip.name}</h2>
        <div className="flex flex-wrap gap-4 mt-2">
          <div className="flex items-center 2xl:text-2xl">
            <MapPin className="h-4 w-4 2xl:h-6 2xl:w-6 mr-1" />
            {trip.destination}
          </div>
          <div className="flex items-center 2xl:text-2xl">
            <Calendar className="h-4 w-4 2xl:h-6 2xl:w-6 mr-1" />
            {startDate} - {endDate}
          </div>
          <div className="flex items-center 2xl:text-2xl">
            <Users className="h-4 w-4 2xl:h-6 2xl:w-6 mr-1" />
            {trip?.members.length} travelers
          </div>
        </div>
        {trip.description && (
          <p className="mt-4 2xl:text-2xl">{trip.description}</p>
        )}
      </div>
      {loggedUser && <EditTripDialog initialData={trip} />}
    </div>
  );
}

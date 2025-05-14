import AddLocation from "./_components/AddLocation";
import LocationClient from "./_components/LocationClient";

export default function Locations({ trip, loggedUser }) {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-bold ">Must see locations</h3>
      </div>

      <LocationClient trip={trip} loggedUser={loggedUser} />
    </div>
  );
}

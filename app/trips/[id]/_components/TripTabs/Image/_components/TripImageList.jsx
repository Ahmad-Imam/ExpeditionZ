import { ImagePlay } from "lucide-react";
import TripImageSingle from "./TripImageSingle";

export default function TripImageList({ trip, loggedMember }) {
  return (
    <>
      {trip?.images?.length == 0 ? (
        <div className="text-center py-12  rounded-lg border">
          <div className=" inline-block p-4 rounded-full mb-4">
            <ImagePlay className="h-8 w-8 " />
          </div>
          <h3 className="text-xl font-semibold mb-2">No images uploaded yet</h3>
          <p className=" mb-6">
            Add images to your trip to share with your group
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {trip?.images.map((imageObj, index) => (
            <TripImageSingle
              key={index}
              trip={trip}
              imageObj={imageObj}
              loggedMember={loggedMember}
            />
          ))}
        </div>
      )}
    </>
  );
}

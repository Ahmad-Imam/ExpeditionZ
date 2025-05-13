import TripImageSingle from "./TripImageSingle";

// Placeholder image URLs - replace with your actual image data
const imageUrl = `https://random-image-pepebigotes.vercel.app/api/random-image`;

const placeholderImages = Array.from({ length: 10 });

export default function TripImageList({ trip }) {
  return (
    <>
      {trip?.images?.length == 0 ? (
        <div className="flex justify-center items-center h-full pt-20">
          <p className="text-xl font-semibold">No images available</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {trip?.images.map((imageObj, index) => (
            <TripImageSingle key={index} trip={trip} imageObj={imageObj} />
          ))}
        </div>
      )}
    </>
  );
}

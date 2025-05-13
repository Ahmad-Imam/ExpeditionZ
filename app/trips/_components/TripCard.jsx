import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatDate } from "@/lib/utils";
import { Calendar, MapPin, Users } from "lucide-react";
import Link from "next/link";

export default function TripCard({ trip }) {
  const startDate = formatDate(trip.startDate);
  const endDate = formatDate(trip.endDate);

  return (
    <div>
      <Link key={trip.id} href={`/trips/${trip.id}`}>
        <Card className="h-full cursor-pointer hover:shadow-lg transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl ">{trip.name}</CardTitle>
            <CardDescription className="flex items-center">
              <MapPin className="h-4 w-4 mr-1 " />
              {trip.destination}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center text-sm  mb-2">
              <Calendar className="h-4 w-4 mr-1" />
              <span>
                {startDate} - {endDate}
              </span>
            </div>
            <div className="flex items-center text-sm ">
              <Users className="h-4 w-4 mr-1" />
              <span>{trip?.members.length} travelers</span>
            </div>
          </CardContent>
          <CardFooter className="border-t pt-4">
            <div className="flex -space-x-2">
              {trip?.members.slice(0, 3).map((member, i) => (
                <div
                  key={i}
                  className="h-8 w-8 rounded-full bg-accent flex items-center justify-center border-2 border-muted-foreground"
                  title={member.name}
                >
                  <span className="text-xs font-medium ">
                    {member.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </span>
                </div>
              ))}
              {trip?.members.length > 3 && (
                <div className="h-8 w-8 rounded-full bg-accent flex items-center justify-center border-2 border-muted-foreground">
                  <span className="text-xs font-medium ">
                    +{trip?.members.length - 3}
                  </span>
                </div>
              )}
            </div>
          </CardFooter>
        </Card>
      </Link>
    </div>
  );
}

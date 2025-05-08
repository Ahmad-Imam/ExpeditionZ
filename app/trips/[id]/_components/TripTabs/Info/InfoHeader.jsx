import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { CalendarClock, Clock, Globe } from "lucide-react";
export default function InfoHeader({ destinationData, trip }) {
  //   const [currentTime, setCurrentTime] = useState("");

  const daysUntilTrip = destinationData?.countDown;

  //   useEffect(() => {
  //     // Update local time
  //     const updateLocalTime = () => {
  //       const now = new Date();
  //       const options = {
  //         hour: "2-digit",
  //         minute: "2-digit",
  //         second: "2-digit",
  //         timeZoneName: "short",
  //         timeZone: destinationData.timezone,
  //       };
  //       setCurrentTime(now.toLocaleTimeString("en-US", options));
  //     };

  //     // const timer = setInterval(updateLocalTime, 1000);
  //     // return () => clearInterval(timer);
  //   }, [trip.startDate, destinationData.timezone]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center text-lg">
            <Clock className="h-5 w-5 mr-2 text-sm" />
            Time Zone
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{destinationData?.offset}</div>
          <div className="text-md mt-2">{destinationData?.timezone}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center text-lg">
            <Globe className="h-5 w-5 mr-2 text-sm" />
            Language & Currency
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-1">
            <div>
              <span className="font-medium">Language:</span>{" "}
              {destinationData.language}
            </div>
            <div>
              <span className="font-medium">Currency:</span>{" "}
              {destinationData.currency}
            </div>
            <div>
              <span className="font-medium">Conversion:</span>{" "}
              {destinationData.convert}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center text-lg">
            <CalendarClock className="h-5 w-5 mr-2 text-sm" />
            Trip Countdown
          </CardTitle>
        </CardHeader>
        <CardContent>
          {daysUntilTrip > 0 ? (
            <div>
              <div className="text-2xl font-bold">{daysUntilTrip} days</div>
              <div className="text-md mt-2">until your trip begins</div>
            </div>
          ) : daysUntilTrip === 0 ? (
            <div>
              <div className="text-2xl font-bold text-green-600">Today!</div>
              <div className="text-md ">Your trip starts today</div>
            </div>
          ) : (
            <div>
              <div className="text-2xl font-bold">
                {Math.abs(daysUntilTrip)} days
              </div>
              <div className="text-md ">since your trip started</div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

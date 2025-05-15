import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Calendar, Check, Clock } from "lucide-react";

import AddTimelinePoint from "./AddTimelinePoint";
import { formatDate } from "@/lib/utils";
import EditTimelinePoint from "./EditTimelinePoint";
import DeleteTimelinePoint from "./DeleteTimelinePoint";
import ToggleTimelinePoint from "./ToggleTimelinePoint";

export default function Timeline({ trip, loggedUser }) {
  const timelinePointsByCreatedDate = trip.timeline?.sort((a, b) => {
    const dateA = new Date(a.createdAt);
    const dateB = new Date(b.createdAt);
    return dateA - dateB; // Sort in ascending order
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-bold ">Trip Timeline</h3>

        {loggedUser && <AddTimelinePoint trip={trip} />}
      </div>

      {trip.timeline.length === 0 ? (
        <div className="text-center py-12  rounded-lg border">
          <div className=" inline-block p-4 rounded-full mb-4">
            <Clock className="h-8 w-8 " />
          </div>
          <h3 className="text-xl font-semibold mb-2">No timeline points yet</h3>
          <p className=" mb-6">
            Start adding points to create your trip timeline
          </p>
        </div>
      ) : (
        <div className="relative">
          <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-primary translate-x-1/2">
            <div
              className="absolute left-0 top-0 w-full bg-secondary transition-all duration-500"
              style={{
                height: `${
                  trip.timeline.length > 0
                    ? (trip.timeline.filter((point) => point.completed).length /
                        trip.timeline.length) *
                      100
                    : 0
                }%`,
              }}
            ></div>
          </div>

          <div className="">
            {timelinePointsByCreatedDate.map((point, index) => {
              const isEven = index % 2 === 0;

              return (
                <div
                  key={point.id}
                  className={`flex items-start  ${
                    isEven ? "flex-row" : "flex-row-reverse"
                  } justify-center`}
                >
                  <div
                    className={`w-1/2 ${isEven ? "text-right pr-8" : "pl-8"}`}
                  >
                    <Card className={point.completed ? "opacity-70" : ""}>
                      <CardHeader className="pb-2">
                        <div
                          className={`flex ${
                            isEven ? "justify-end" : "justify-start"
                          } gap-2`}
                        >
                          <CardTitle className={""}>{point.title}</CardTitle>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div
                          className={`text-sm  mb-2 ${
                            isEven ? "text-right" : "text-left"
                          }`}
                        >
                          {formatDate(point.date)}
                          {point.time && ` • ${point.time}`}
                        </div>
                        {point.description && (
                          <p
                            className={`text-sm  ${
                              isEven ? "text-right" : "text-left"
                            }`}
                          >
                            {point.description}
                          </p>
                        )}
                        {loggedUser && (
                          <div
                            className={`flex mt-3 flex-wrap gap-4 ${
                              isEven ? "justify-end" : "justify-start"
                            }gap-4`}
                          >
                            <ToggleTimelinePoint
                              timelinePoint={point}
                              trip={trip}
                            />
                            <EditTimelinePoint
                              timelinePoint={point}
                              trip={trip}
                            />
                            <DeleteTimelinePoint
                              timelinePoint={point}
                              trip={trip}
                            />
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </div>

                  <div className="relative z-10 flex-shrink-0">
                    <div
                      className={`h-12 w-12 rounded-full flex items-center justify-center border-2 ${
                        point.completed
                          ? "bg-primary"
                          : " border-accent-foreground bg-card"
                      }`}
                    >
                      {point.completed ? (
                        <Check className="h-6 w-6 text-card" />
                      ) : (
                        <Calendar className="h-6 w-6" />
                      )}
                    </div>

                    <div
                      className={`absolute top-1/2 ${
                        isEven ? "right-full" : "left-full"
                      } w-4 h-0.5 ${
                        point.completed ? "bg-primary" : "bg-secondary "
                      }`}
                    ></div>
                  </div>

                  <div className="w-1/2"></div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  CheckSquare,
  Clock,
  Cloud,
  DollarSign,
  Globe,
  Map,
  Vote,
} from "lucide-react";

import { getTripById } from "@/actions/trip";
import TripHeader from "./_components/TripHeader";
import Checklist from "./_components/TripTabs/checklist";
import DestinationInfo from "./_components/TripTabs/destination-info";
import CostCalculator from "./_components/TripTabs/Expense/cost-calculator";
import LocationsMap from "./_components/TripTabs/locations-map";
import PollSystem from "./_components/TripTabs/poll-system";
import TimelineCreator from "./_components/TripTabs/timeline-creator";
import WeatherForecast from "./_components/TripTabs/weather-forecast";

export default async function TripDetailPage({ params }) {
  // const trip = mockTrips[0];

  const { id: tripId } = await params;

  const trip = await getTripById(tripId);
  // console.log(trip);

  return (
    <div className="min-h-screen sm:w-xl md:2xl lg:w-4xl xl:w-3/4 mx-auto ">
      <main className=" mx-auto px-4 py-10">
        <TripHeader trip={trip} />

        <Tabs defaultValue="expenses" className="w-full">
          <TabsList className="grid grid-cols-7 mb-8 w-full">
            <TabsTrigger value="expenses" className="flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              <span className="hidden lg:inline">Expenses</span>
            </TabsTrigger>
            <TabsTrigger value="checklist" className="flex items-center gap-2">
              <CheckSquare className="h-4 w-4" />
              <span className="hidden lg:inline">Checklist</span>
            </TabsTrigger>
            <TabsTrigger value="timeline" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span className="hidden lg:inline">Timeline</span>
            </TabsTrigger>
            <TabsTrigger value="locations" className="flex items-center gap-2">
              <Map className="h-4 w-4" />
              <span className="hidden lg:inline">Locations</span>
            </TabsTrigger>
            <TabsTrigger value="polls" className="flex items-center gap-2">
              <Vote className="h-4 w-4" />
              <span className="hidden lg:inline">Polls</span>
            </TabsTrigger>
            <TabsTrigger value="weather" className="flex items-center gap-2">
              <Cloud className="h-4 w-4" />
              <span className="hidden lg:inline">Weather</span>
            </TabsTrigger>
            <TabsTrigger value="info" className="flex items-center gap-2">
              <Globe className="h-4 w-4" />
              <span className="hidden lg:inline">Info</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="expenses">
            <CostCalculator trip={trip} />
          </TabsContent>

          <TabsContent value="checklist">
            <Checklist trip={trip} />
          </TabsContent>

          <TabsContent value="timeline">
            <TimelineCreator trip={trip} />
          </TabsContent>

          <TabsContent value="locations">
            <LocationsMap trip={trip} />
          </TabsContent>

          <TabsContent value="polls">
            <PollSystem trip={trip} />
          </TabsContent>

          <TabsContent value="weather">
            <WeatherForecast trip={trip} />
          </TabsContent>

          <TabsContent value="info">
            <DestinationInfo trip={trip} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

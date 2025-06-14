import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  CheckSquare,
  Clock,
  Cloud,
  DollarSign,
  Globe,
  Image,
  Map,
  Vote,
} from "lucide-react";

import { getLoggedTripMember, getTripById } from "@/actions/trip";

import TripHeader from "./_components/TripHeader";
import Checklist from "./_components/TripTabs/CheckList/Checklist";
import InfoLocation from "./_components/TripTabs/Info/InfoLocation";
import Expense from "./_components/TripTabs/Expense/Expense";
import Locations from "./_components/TripTabs/Locations/Locations";

import Timeline from "./_components/TripTabs/Timeline/Timeline";
import Weather from "./_components/TripTabs/Weather/Weather";
import PollSystem from "./_components/TripTabs/Polls/PollSystem";

import TripImage from "./_components/TripTabs/Image/TripImage";
import { getLoggedUser } from "@/actions/user";

export const metadata = {
  title: "ExpeditionZ - Trip Details",
  description: "View and manage your trips",
};

export default async function TripDetailPage({ params }) {
  const { id: tripId } = await params;

  const trip = await getTripById(tripId);
  const loggedUser = await getLoggedUser();
  const loggedMember = await getLoggedTripMember(tripId);

  return (
    <div className="min-h-screen sm:w-xl md:2xl lg:w-4xl xl:w-3/4 mx-auto ">
      <main className=" mx-auto px-4 py-10">
        <TripHeader trip={trip} loggedUser={loggedMember} />

        <Tabs defaultValue="expenses" className="w-full">
          <TabsList className="grid grid-cols-8 mb-8 w-full">
            <TabsTrigger
              value="expenses"
              className="flex items-center gap-2 text-md"
            >
              <DollarSign className="h-4 w-4" />
              <span className="hidden lg:inline">Expenses</span>
            </TabsTrigger>
            <TabsTrigger
              value="checklist"
              className="flex items-center gap-2 text-md"
            >
              <CheckSquare className="h-4 w-4" />
              <span className="hidden lg:inline">Checklist</span>
            </TabsTrigger>
            <TabsTrigger
              value="timeline"
              className="flex items-center gap-2 text-md"
            >
              <Clock className="h-4 w-4" />
              <span className="hidden lg:inline">Timeline</span>
            </TabsTrigger>
            <TabsTrigger
              value="locations"
              className="flex items-center gap-2 text-md"
            >
              <Map className="h-4 w-4" />
              <span className="hidden lg:inline">Locations</span>
            </TabsTrigger>
            <TabsTrigger
              value="polls"
              className="flex items-center gap-2 text-md"
            >
              <Vote className="h-4 w-4" />
              <span className="hidden lg:inline">Polls</span>
            </TabsTrigger>
            <TabsTrigger
              value="weather"
              className="flex items-center gap-2 text-md"
            >
              <Cloud className="h-4 w-4" />
              <span className="hidden lg:inline">Weather</span>
            </TabsTrigger>
            <TabsTrigger
              value="info"
              className="flex items-center gap-2 text-md"
            >
              <Globe className="h-4 w-4" />
              <span className="hidden lg:inline">Info</span>
            </TabsTrigger>

            <TabsTrigger
              value="file"
              className="flex items-center gap-2 text-md"
            >
              <Image className="h-4 w-4" />
              <span className="hidden lg:inline">Gallery</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="expenses">
            <Expense trip={trip} loggedUser={loggedMember} />
          </TabsContent>

          <TabsContent value="checklist">
            <Checklist trip={trip} loggedUser={loggedMember} />
          </TabsContent>

          <TabsContent value="timeline">
            <Timeline trip={trip} loggedUser={loggedMember} />
          </TabsContent>

          <TabsContent value="locations">
            <Locations trip={trip} loggedUser={loggedMember} />
          </TabsContent>

          <TabsContent value="polls">
            <PollSystem trip={trip} loggedUser={loggedMember} />
          </TabsContent>

          <TabsContent value="weather">
            <Weather trip={trip} loggedUser={loggedUser} />
          </TabsContent>

          <TabsContent value="info">
            <InfoLocation trip={trip} loggedUser={loggedUser} />
          </TabsContent>

          <TabsContent value="file">
            <TripImage
              trip={trip}
              loggedUser={loggedUser}
              loggedMember={loggedMember}
            />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

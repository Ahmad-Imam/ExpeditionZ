import { Button } from "@/components/ui/button";
import { Calendar, CheckSquare, DollarSign, MapPin, Vote } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen ">
      <main className=" mx-auto px-4 flex flex-col justify-center items-center min-h-screen gap-10">
        <h1 className="text-7xl text-center font-bold">ExpeditionZ</h1>
        <section className="max-w-4xl mx-auto text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold  mb-6">
            Plan Your Perfect Adventure
          </h2>
          <p className="text-lg  mb-8">
            Collaborate with friends and family to create unforgettable travel
            experiences
          </p>
          <Link href="/trips/new">
            <Button size="lg" className="">
              Start Planning
            </Button>
          </Link>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <FeatureCard
            icon={<DollarSign className="h-10 w-10 " />}
            title="Cost Splitting"
            description="Track expenses and split costs fairly among trip members"
          />
          <FeatureCard
            icon={<CheckSquare className="h-10 w-10 " />}
            title="Trip Checklist"
            description="Create and manage packing lists and to-dos for your trip"
          />
          <FeatureCard
            icon={<Calendar className="h-10 w-10 " />}
            title="Timeline Creator"
            description="Build a visual timeline of your trip activities and events"
          />
          <FeatureCard
            icon={<MapPin className="h-10 w-10 " />}
            title="Must-See Locations"
            description="Collect and map all the places you don't want to miss"
          />
          <FeatureCard
            icon={<Vote className="h-10 w-10 " />}
            title="Group Polling"
            description="Make decisions together with easy voting on trip options"
          />
          <FeatureCard
            icon={
              <div className="flex">
                <div className="h-10 w-10 rounded-full  flex items-center justify-center border-2 ">
                  <span className=" font-bold">+</span>
                </div>
              </div>
            }
            title="Collaborative Planning"
            description="Invite friends and family to contribute to your trip plans"
          />
        </section>
      </main>
    </div>
  );
}

function FeatureCard({ icon, title, description }) {
  return (
    <div className=" rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-semibold  mb-2">{title}</h3>
      <p className="">{description}</p>
    </div>
  );
}

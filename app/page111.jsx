import { Button } from "@/components/ui/button";
import { Calendar, CheckSquare, DollarSign, MapPin, Vote } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50">
      <header className=" mx-auto py-6 px-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <MapPin className="h-6 w-6 text-purple-600" />
            <h1 className="text-2xl font-bold text-purple-900">ExpeditionZ</h1>
          </div>
          <div className="flex gap-4">
            <Link href="/trips">
              <Button variant="ghost">My Trips</Button>
            </Link>
            <Link href="/trips/new">
              <Button>New Trip</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className=" mx-auto px-4 py-12">
        <section className="max-w-4xl mx-auto text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-purple-900 mb-6">
            Plan Your Perfect Adventure
          </h2>
          <p className="text-lg text-gray-700 mb-8">
            Collaborate with friends and family to create unforgettable travel
            experiences
          </p>
          <Link href="/trips/new">
            <Button size="lg" className="bg-purple-600 hover:bg-purple-700">
              Start Planning
            </Button>
          </Link>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <FeatureCard
            icon={<DollarSign className="h-10 w-10 text-purple-600" />}
            title="Cost Splitting"
            description="Track expenses and split costs fairly among trip members"
          />
          <FeatureCard
            icon={<CheckSquare className="h-10 w-10 text-purple-600" />}
            title="Trip Checklist"
            description="Create and manage packing lists and to-dos for your trip"
          />
          <FeatureCard
            icon={<Calendar className="h-10 w-10 text-purple-600" />}
            title="Timeline Creator"
            description="Build a visual timeline of your trip activities and events"
          />
          <FeatureCard
            icon={<MapPin className="h-10 w-10 text-purple-600" />}
            title="Must-See Locations"
            description="Collect and map all the places you don't want to miss"
          />
          <FeatureCard
            icon={<Vote className="h-10 w-10 text-purple-600" />}
            title="Group Polling"
            description="Make decisions together with easy voting on trip options"
          />
          <FeatureCard
            icon={
              <div className="flex">
                <div className="h-10 w-10 rounded-full bg-purple-200 flex items-center justify-center border-2 border-purple-600">
                  <span className="text-purple-800 font-bold">+</span>
                </div>
              </div>
            }
            title="Collaborative Planning"
            description="Invite friends and family to contribute to your trip plans"
          />
        </section>
      </main>

      <footer className="bg-purple-900 text-white py-8 mt-20">
        <div className=" mx-auto px-4 text-center">
          <p>© {new Date().getFullYear()} ExpeditionZ Travel Planner</p>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }) {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-semibold text-purple-900 mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}

"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarClock, Clock, Globe, Info } from "lucide-react";
import { useEffect, useState } from "react";

// Mock destination data - in a real app, this would come from an API
const mockDestinationData = {
  "Paris, France": {
    timezone: "Europe/Paris",
    offset: "+02:00",
    language: "French",
    currency: "Euro (EUR)",
    tips: [
      "Most museums are closed on Mondays or Tuesdays",
      "Tipping is not required but rounding up is appreciated",
      "The Paris Museum Pass can save money if you plan to visit multiple museums",
      "Metro tickets can be purchased in bundles for a discount",
      "Many restaurants offer fixed-price lunch menus that are a good value",
    ],
    phrases: [
      { phrase: "Hello", translation: "Bonjour" },
      { phrase: "Thank you", translation: "Merci" },
      { phrase: "Excuse me", translation: "Excusez-moi" },
      { phrase: "Do you speak English?", translation: "Parlez-vous anglais?" },
      { phrase: "How much is this?", translation: "Combien ça coûte?" },
    ],
  },
  "Tokyo, Japan": {
    timezone: "Asia/Tokyo",
    offset: "+09:00",
    language: "Japanese",
    currency: "Japanese Yen (JPY)",
    tips: [
      "Tipping is not customary and can sometimes be considered rude",
      "Many places don't accept credit cards, so carry cash",
      "Convenience stores (konbini) are great for quick meals and ATMs",
      "Get a Suica or Pasmo card for easy public transportation",
      "Bow slightly when greeting or thanking someone",
    ],
    phrases: [
      { phrase: "Hello", translation: "Konnichiwa" },
      { phrase: "Thank you", translation: "Arigatou gozaimasu" },
      { phrase: "Excuse me", translation: "Sumimasen" },
      {
        phrase: "Do you speak English?",
        translation: "Eigo wo hanasemasu ka?",
      },
      { phrase: "How much is this?", translation: "Kore wa ikura desu ka?" },
    ],
  },
  Italy: {
    timezone: "Europe/Rome",
    offset: "+02:00",
    language: "Italian",
    currency: "Euro (EUR)",
    tips: [
      "Many shops close for a few hours in the afternoon for 'riposo'",
      "Cover your shoulders and knees when visiting churches",
      "A small coperto (cover charge) is common at restaurants",
      "Validate your train ticket before boarding",
      "Coffee at the bar is cheaper than sitting at a table",
    ],
    phrases: [
      { phrase: "Hello", translation: "Ciao" },
      { phrase: "Thank you", translation: "Grazie" },
      { phrase: "Excuse me", translation: "Scusi" },
      { phrase: "Do you speak English?", translation: "Parla inglese?" },
      { phrase: "How much is this?", translation: "Quanto costa?" },
    ],
  },
};

const CurrencyConverter = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Currency Converter</CardTitle>
        <CardDescription>Convert currencies for your trip</CardDescription>
      </CardHeader>
      <CardContent>
        <p>This is a placeholder for the currency converter.</p>
      </CardContent>
    </Card>
  );
};

export default function DestinationInfo({ trip }) {
  const [currentTime, setCurrentTime] = useState("");
  const [daysUntilTrip, setDaysUntilTrip] = useState(0);
  const [activeTab, setActiveTab] = useState("info");

  // Find destination data or use default
  const destinationKey =
    Object.keys(mockDestinationData).find((key) =>
      trip.destination.includes(key)
    ) || Object.keys(mockDestinationData)[0];

  const destinationData = mockDestinationData[destinationKey];

  useEffect(() => {
    // Update local time
    const updateLocalTime = () => {
      const now = new Date();
      const options = {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        timeZoneName: "short",
        timeZone: destinationData.timezone,
      };
      setCurrentTime(now.toLocaleTimeString("en-US", options));
    };

    // Calculate days until trip
    const calculateDaysUntil = () => {
      const today = new Date();
      const tripStart = new Date(trip.startDate);
      const timeDiff = tripStart.getTime() - today.getTime();
      const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
      setDaysUntilTrip(daysDiff);
    };

    updateLocalTime();
    calculateDaysUntil();

    const timer = setInterval(updateLocalTime, 1000);
    return () => clearInterval(timer);
  }, [trip.startDate, destinationData.timezone]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-bold text-purple-900">
          Destination Information
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-lg">
              <Clock className="h-5 w-5 mr-2 text-purple-600" />
              Local Time
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currentTime}</div>
            <div className="text-sm text-gray-600">
              {destinationData.timezone}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-lg">
              <Globe className="h-5 w-5 mr-2 text-purple-600" />
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
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-lg">
              <CalendarClock className="h-5 w-5 mr-2 text-purple-600" />
              Trip Countdown
            </CardTitle>
          </CardHeader>
          <CardContent>
            {daysUntilTrip > 0 ? (
              <div>
                <div className="text-2xl font-bold">{daysUntilTrip} days</div>
                <div className="text-sm text-gray-600">
                  until your trip begins
                </div>
              </div>
            ) : daysUntilTrip === 0 ? (
              <div>
                <div className="text-2xl font-bold text-green-600">Today!</div>
                <div className="text-sm text-gray-600">
                  Your trip starts today
                </div>
              </div>
            ) : (
              <div>
                <div className="text-2xl font-bold">
                  {Math.abs(daysUntilTrip)} days
                </div>
                <div className="text-sm text-gray-600">
                  since your trip started
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="info">Travel Tips</TabsTrigger>
          <TabsTrigger value="phrases">Useful Phrases</TabsTrigger>
          <TabsTrigger value="currency">Currency Converter</TabsTrigger>
        </TabsList>

        <TabsContent value="info">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Info className="h-5 w-5 mr-2 text-purple-600" />
                Travel Tips for {trip.destination}
              </CardTitle>
              <CardDescription>
                Helpful information for your trip
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {destinationData.tips.map((tip, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-purple-600 mr-2">•</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="phrases">
          <Card>
            <CardHeader>
              <CardTitle>Useful Phrases</CardTitle>
              <CardDescription>
                Common phrases in {destinationData.language}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {destinationData.phrases.map((item, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-2 gap-4 border-b pb-2 last:border-0"
                  >
                    <div className="font-medium">{item.phrase}</div>
                    <div className="italic">{item.translation}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="currency">
          <CurrencyConverter />
        </TabsContent>
      </Tabs>
    </div>
  );
}

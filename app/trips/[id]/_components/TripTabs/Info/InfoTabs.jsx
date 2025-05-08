import React from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Info } from "lucide-react";

export default function InfoTabs({ trip, destinationData }) {
  return (
    <Tabs defaultValue="info" className="w-full">
      <TabsList className="mb-6 w-full">
        <TabsTrigger value="info">Travel Tips</TabsTrigger>
        <TabsTrigger value="phrases">Useful Phrases</TabsTrigger>
      </TabsList>

      <TabsContent value="info">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Info className="h-5 w-5 mr-2 text-xl" />
              Travel Tips for {trip.destination}
            </CardTitle>
            <CardDescription className={"text-md"}>
              Helpful information for your trip
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {destinationData.tips.map((tip, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-sm mr-2">•</span>
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
    </Tabs>
  );
}

"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MapPin, Search, ArrowLeft } from "lucide-react";

export default function FAQPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const filterFAQs = (faqs) => {
    if (!searchQuery.trim()) return faqs;

    return faqs.filter(
      (faq) =>
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const faqData = {
    general: [
      {
        question: "What is ExpeditionZ?",
        answer:
          "ExpeditionZ is a collaborative travel planning application that helps you organize trips with friends and family. You can create itineraries, split expenses, manage checklists, track locations, and make group decisions through polls.",
      },
      {
        question: "Is ExpeditionZ free to use?",
        answer:
          "Yes, ExpeditionZ is mostly free to use for all core features. There are premium features in the application.",
      },
      {
        question: "Can I use ExpeditionZ on my mobile device?",
        answer:
          "Yes, ExpeditionZ is fully responsive and works on mobile devices, tablets, and desktop computers. We recommend using the latest version of Chrome, Firefox, Safari, or Edge for the best experience.",
      },
      {
        question: "How do I get started with ExpeditionZ?",
        answer:
          "To get started, create an account, then add a new trip to create your first trip. Add details like destination, dates, and travel companions. From there, you can start adding expenses, checklist items, timeline events, and more.",
      },
    ],
    trips: [
      {
        question: "How do I create a new trip?",
        answer:
          "Click on the 'New Trip' button from the dashboard or trips page. Fill in the trip details including name, destination, dates, and add any travel companions. Once created, you'll be taken to the trip dashboard where you can start planning.",
      },
      {
        question: "Can I invite others to collaborate on my trip?",
        answer:
          "Yes, you can invite others to collaborate on your trip. From the trip page, you can add members by their email address. They'll receive an invitation to join the trip and can contribute to all aspects of planning.",
      },
      {
        question: "How do I edit trip details after creation?",
        answer:
          "Currently, you can edit most trip components like expenses, checklist items, and timeline events. To edit basic trip details like dates or destination, we're working on an edit feature that will be available soon.",
      },
      {
        question: "Can I duplicate a trip for similar future travels?",
        answer:
          "We're working on a trip duplication feature that will allow you to copy all details from a previous trip as a starting point for a new one. This feature will be available in an upcoming update.",
      },
    ],
    expenses: [
      {
        question: "How does expense splitting work?",
        answer:
          "When you add an expense, you specify who paid for it and who should split the cost. ExpeditionZ automatically calculates how much each person owes or is owed. You can mark expenses as repaid when settled.",
      },

      {
        question: "How do I mark an expense as repaid?",
        answer:
          "On the expense details, you'll see badges for each person who owes money. Click on these badges to mark them as repaid. This helps keep track of who has settled their debts.",
      },
    ],
    timeline: [
      {
        question: "What is the timeline feature used for?",
        answer:
          "The timeline feature helps you plan your trip day by day. You can add events like flights, hotel check-ins, tours, and restaurant reservations with specific dates and times. This creates a chronological view of your trip activities.",
      },

      {
        question: "How do I mark timeline events as completed?",
        answer:
          "Each timeline event has a 'Mark complete' button. Clicking this will mark the event as completed and update the progress indicator on the timeline.",
      },
      {
        question: "Can I reorder timeline events?",
        answer:
          "Timeline events are automatically sorted by date and time. If you need to change the order, you can edit the date or time of the events.",
      },
    ],
    checklist: [
      {
        question: "How do I create a checklist?",
        answer:
          "Go to the Checklist tab in your trip and click 'Add Item'. You can specify the item name, category, and optionally assign it to a specific traveler. Use categories like 'Essentials', 'Clothing', or 'Documents' to organize your list.",
      },
      {
        question: "Can I assign checklist items to specific travelers?",
        answer:
          "Yes, when creating or editing a checklist item, you can assign it to a specific traveler. This helps distribute responsibilities among your travel group.",
      },
      {
        question: "How do I track checklist progress?",
        answer:
          "The checklist shows a progress bar indicating how many items have been completed. Each item has a checkbox that you can click to mark it as completed.",
      },
    ],
    polls: [
      {
        question: "How do I create a poll for group decisions?",
        answer:
          "Go to the Polls tab in your trip and click 'Create Poll'. Enter your question and add multiple options for people to vote on. All trip members will be able to cast their votes.",
      },

      {
        question: "How do I close a poll?",
        answer:
          "As the poll creator or trip admin, you can close a poll by clicking the 'End poll' button. This will prevent further voting and display the final results.",
      },
      {
        question: "Can I reopen a closed poll?",
        answer:
          "Yes, you can reopen a closed poll by clicking the 'Reopen poll' button. This allows for additional voting if needed.",
      },
    ],
    weather: [
      {
        question: "How accurate is the weather forecast?",
        answer:
          "Our weather data comes by utilizing AI to get the latest information. However, weather forecasts are inherently predictions and may change, especially for dates further in the future. We recommend checking the forecast again closer to your trip dates.",
      },
      {
        question: "How far in advance can I see weather forecasts?",
        answer:
          "Currently, we provide weather forecasts for up to 5 days in advance. For trips scheduled further in the future, you'll see an estimated weather for 5 days from the start of your trip. However those might not be accurate.",
      },
    ],
    location: [
      {
        question: "How can I add new location?",
        answer:
          "To add a new location, go to the Locations tab in your trip and click 'Add Location'. Enter the name, address and view it on the mini map.",
      },
      {
        question: "Can I delete locations?",
        answer:
          "Yes, you can delete locations by clicking on the location in the list and selecting the delete option. This will remove it from your trip.",
      },
    ],

    gallery: [
      {
        question: "How can I access gallery?",
        answer:
          "You need to be a premium user to access the gallery. Once you are a premium user, you can upload images and videos to your trip gallery.",
      },
      {
        question: "Can I delete images from gallery?",
        answer:
          "Yes, you can delete images from the gallery. Just click on the image you want to delete and select the delete option.",
      },
    ],
    account: [
      {
        question: "How do I subscribe for premium features?",
        answer:
          "Go to the pricing page and select the monthly/yearly plan that suits you. After payment, your account will be upgraded to premium, unlocking additional features.",
      },
      {
        question: "Can I share my trip with non-premium users?",
        answer:
          "Any members of your trip can access the trip details, regardless of their subscription status. However, some premium features may be limited to premium users only.",
      },
      {
        question: "Can I share my trip with anyone?",
        answer:
          "You can share your trip with anyone with the link. However, they will need to create an account and be added to the trip to access customizations. ",
      },
    ],
  };

  return (
    <div className="min-h-screen w-full">
      <main className=" mx-auto px-20 xl:px-40 flex flex-col items-center justify-center  h-screen">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold  mb-4">
            Frequently Asked Questions
          </h1>
          <p className=" max-w-2xl mx-auto">
            Find answers to common questions about ExpeditionZ.
          </p>
        </div>

        <Card className={"w-full"}>
          <CardHeader>
            <CardTitle></CardTitle>
            <CardDescription></CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs
              defaultValue="general"
              className="w-full flex flex-col justify-between md:gap-20 sm:gap-30 lg:gap-0"
            >
              <TabsList className="grid lg:grid-cols-10 sm:grid-cols-4 mb-12 w-full gap-6">
                <TabsTrigger value="general">General</TabsTrigger>
                <TabsTrigger value="trips">Trip</TabsTrigger>
                <TabsTrigger value="expenses">Expenses</TabsTrigger>
                <TabsTrigger value="timeline">Timeline</TabsTrigger>
                <TabsTrigger value="checklist">Checklist</TabsTrigger>
                <TabsTrigger value="polls">Polls</TabsTrigger>
                <TabsTrigger value="location">Location</TabsTrigger>
                <TabsTrigger value="weather">Weather</TabsTrigger>
                <TabsTrigger value="gallery">Gallery</TabsTrigger>
                <TabsTrigger value="account">Account</TabsTrigger>
              </TabsList>

              {Object.keys(faqData).map((category) => (
                <TabsContent key={category} value={category}>
                  <Accordion type="single" collapsible className="w-full">
                    {faqData[category].map((faq, index) => (
                      <AccordionItem key={index} value={`item-${index}`}>
                        <AccordionTrigger className="text-left text-md">
                          {faq.question}
                        </AccordionTrigger>
                        <AccordionContent>
                          <p className="text-lg">{faq.answer}</p>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </TabsContent>
              ))}
            </Tabs>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

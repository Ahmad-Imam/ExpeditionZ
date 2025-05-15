"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Check, Loader, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAutumn, useCustomer } from "autumn-js/next";
import { toast } from "sonner";
import { updateUserPremiumStatus } from "@/actions/user";

export default function PriceTable({ loggedUser }) {
  const [billingCycle, setBillingCycle] = useState("monthly");
  const { attach, check, track } = useAutumn();
  const [loading, setLoading] = useState(false);

  const plans = [
    {
      name: "Free",
      description: "Essential features",
      price: {
        monthly: "$0",
        yearly: "$0",
      },
      features: [
        { name: "Unlimited trips", included: true },
        { name: "Track trip expenses", included: true },
        { name: "Create trip checklists", included: true },
        { name: "Create polls within the trip members", included: true },
        { name: "Add locations to visit on the map", included: true },
        { name: "Get weather updates of the destination", included: false },
        {
          name: "Get addition information about the destination",
          included: false,
        },
        { name: "Upload images of the trip", included: false },
      ],
      cta: "Get Started",
      popular: false,
    },
    {
      name: "Pro",
      description: "Advanced features for professionals and growing businesses",
      price: {
        monthly: "$5",
        yearly: "$48",
      },
      features: [
        { name: "Unlimited trips", included: true },
        { name: "Track trip expenses", included: true },
        { name: "Create trip checklists", included: true },
        { name: "Create polls within the trip members", included: true },
        { name: "Add locations to visit on the map", included: true },
        { name: "Get weather updates of the destination", included: true },
        {
          name: "Get addition information about the destination",
          included: true,
        },
        { name: "Upload images of the trip", included: true },
      ],
      cta: "Upgrade Now",
      popular: true,
    },
  ];

  async function handleClickPro() {
    setLoading(true);
    try {
      if (billingCycle === "yearly") {
        await attach({ productId: "pro-yearly" });
        let { data } = await check({ featureId: "weather" });

        if (data?.allowed) {
          await updateUserPremiumStatus(true);
          toast.success(
            "You have successfully subscribed to the Pro plan for a year."
          );
        } else {
          toast.error("Error subscribing. Please try again.");
        }
      } else {
        await attach({ productId: "pro" });
        let { data } = await check({ featureId: "weather" });

        if (data?.allowed) {
          await updateUserPremiumStatus(true);
          toast.success(
            "You have successfully subscribed to the Pro plan for a month."
          );
        } else {
          toast.error("Error subscribing. Please try again.");
        }
      }
    } catch (error) {
      console.error("Error attaching product:", error);
      toast.error("Error subscribing. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container px-4 py-12 mx-auto">
      <div className="flex flex-col items-center mb-12 text-center">
        <div className="flex items-center p-1 mt-8 space-x-2 border rounded-lg">
          <Button
            variant={billingCycle === "monthly" ? "default" : "ghost"}
            onClick={() => setBillingCycle("monthly")}
            className="relative"
          >
            Monthly
          </Button>
          <Button
            variant={billingCycle === "yearly" ? "default" : "ghost"}
            onClick={() => setBillingCycle("yearly")}
            className="relative"
          >
            Yearly
            <span className="absolute px-2 py-0.5 text-xs font-semibold -top-2 -right-2 bg-primary text-primary-foreground rounded-full">
              Save 20%
            </span>
          </Button>
        </div>
      </div>

      <div className="grid gap-8 md:grid-cols-2 lg:gap-12">
        {plans.map((plan) => (
          <Card
            key={plan.name}
            className={cn(
              "flex flex-col",
              plan.popular &&
                "border-primary shadow-lg relative overflow-hidden"
            )}
          >
            {plan.popular && billingCycle === "yearly" && (
              <div className="absolute top-0 right-0">
                <div className="w-32 h-32 transform rotate-45 translate-x-12 -translate-y-16 bg-primary text-primary-foreground">
                  <div className="absolute bottom-4 left-1 text-xs font-semibold text-center w-full">
                    POPULAR
                  </div>
                </div>
              </div>
            )}
            <CardHeader>
              <CardTitle className="text-2xl">{plan.name}</CardTitle>
              <CardDescription>{plan.description}</CardDescription>
              <div className="mt-4">
                <span className="text-4xl font-bold">
                  {plan.price[billingCycle]}
                </span>
                {plan.name !== "Free" && (
                  <span className="text-muted-foreground ml-2">
                    /{billingCycle === "monthly" ? "month" : "year"}
                  </span>
                )}
              </div>
            </CardHeader>
            <CardContent className="flex-grow">
              <ul className="space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature.name} className="flex items-center">
                    {feature.included ? (
                      <Check className="w-5 h-5 mr-3 text-green-500" />
                    ) : (
                      <X className="w-5 h-5 mr-3 text-muted-foreground" />
                    )}
                    <span
                      className={cn(
                        !feature.included && "text-muted-foreground"
                      )}
                    >
                      {feature.name}
                    </span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              {loading ? (
                <Loader className="h-6 mr-2 animate-spin w-full" />
              ) : (
                loggedUser && (
                  <Button
                    className={cn(
                      "w-full",
                      plan.popular ? "bg-primary hover:bg-primary/90" : ""
                    )}
                    variant={plan.popular ? "default" : "outline"}
                    size="lg"
                    onClick={
                      plan.name === "Pro" ? () => handleClickPro() : undefined
                    }
                    disabled={loggedUser?.isPremium && plan.name === "Pro"}
                  >
                    {loggedUser?.isPremium && plan.name === "Pro"
                      ? "Already a member"
                      : plan.cta}
                  </Button>
                )
              )}
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}

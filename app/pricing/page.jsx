import React from "react";
import PriceTable from "./PriceTable";
import { getLoggedUser } from "@/actions/user";

export default async function PricingPage() {
  const loggedUser = await getLoggedUser();

  return (
    <div className="flex flex-col items-center mb-12 text-center justify-center min-h-screen">
      <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
        Simple, transparent pricing
      </h2>
      <p className="mt-4 text-muted-foreground">
        Choose the perfect plan for your needs. Always know what you'll pay.
      </p>
      <PriceTable loggedUser={loggedUser} />
    </div>
  );
}

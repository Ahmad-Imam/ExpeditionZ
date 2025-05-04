"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import AddTripForm from "./_components/AddTripForm";

export default function NewTripPage() {
  return (
    <div className="min-h-screen ">
      <header className=" mx-auto p-10">
        <div className="flex justify-between items-center">
          <Link href="/trips">
            <Button variant="ghost" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Trips
            </Button>
          </Link>
        </div>
      </header>

      <AddTripForm />
    </div>
  );
}

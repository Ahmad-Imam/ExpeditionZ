import { PickaxeIcon, TicketsPlane } from "lucide-react";

export default function Loading() {
  return (
    <div className="min-h-screen w-full inset-0 flex items-center justify-center">
      <div className="text-center">
        <div className="inline-flex">
          <TicketsPlane className="w-16 h-16 text-primary animate-bounce" />
          <div className="absolute top-0 right-0 -mr-1 -mt-1 w-4 h-4 rounded-full  animate-ping"></div>
        </div>
        <h2 className="mt-4 text-2xl font-semibold text-foreground">
          Loading ExpeditionZ
        </h2>
        <p className="mt-2 text-muted-foreground">Preparing your trip...</p>
        <div className="mt-4 w-48 h-2 bg-muted rounded-full overflow-hidden">
          <div className="h-full bg-primary rounded-full animate-progress"></div>
        </div>
      </div>
    </div>
  );
}

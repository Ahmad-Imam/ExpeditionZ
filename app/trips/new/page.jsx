import Link from "next/link";
import AddTripForm from "./_components/AddTripForm";

export const metadata = {
  title: "ExpeditionZ - Create New Trip",
  description: "Create a new trip",
};
export default function NewTripPage() {
  return (
    <div className="min-h-screen ">
      <AddTripForm />
    </div>
  );
}

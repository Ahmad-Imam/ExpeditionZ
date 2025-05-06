import { CheckSquare, Plus } from "lucide-react";

import AddCheckListForm from "./AddCheckListForm";
import CheckListItems from "./CheckListItems";

export default function Checklist({ trip }) {
  const getCompletionStats = () => {
    const total = trip.checklist.length;
    const completed = trip.checklist.filter((item) => item.completed).length;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

    return { total, completed, percentage };
  };

  const stats = getCompletionStats();

  const categories = [
    { value: "essentials", label: "Essentials" },
    { value: "clothing", label: "Clothing" },
    { value: "toiletries", label: "Toiletries" },
    { value: "electronics", label: "Electronics" },
    { value: "documents", label: "Documents" },
    { value: "other", label: "Other" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="text-2xl font-bold ">Trip Checklist</h3>
          <p className="">
            {stats.completed} of {stats.total} items completed (
            {stats.percentage}%)
          </p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <AddCheckListForm trip={trip} categories={categories} />
        </div>
      </div>

      {/* Progress bar */}
      <div className="w-full rounded-full h-2.5 bg-accent">
        <div
          className=" h-2.5 rounded-full bg-accent-foreground"
          style={{ width: `${stats.percentage}%` }}
        ></div>
      </div>

      {trip.checklist.length === 0 ? (
        <div className="text-center py-12  rounded-lg border">
          <div className=" inline-block p-4 rounded-full mb-4">
            <CheckSquare className="h-8 w-8 " />
          </div>
          <h3 className="text-xl font-semibold mb-2">No items found</h3>
          <p className=" mb-6">
            {trip.checklist.length === 0
              ? "Start adding items to your checklist"
              : "No items match your current filter"}
          </p>
          <AddCheckListForm trip={trip} categories={categories} />
        </div>
      ) : (
        <CheckListItems trip={trip} />
      )}
    </div>
  );
}

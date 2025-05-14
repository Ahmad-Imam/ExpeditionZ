"use client";
import { deleteExpenseAction } from "@/actions/expense";
import { Button } from "@/components/ui/button";
import { LoaderIcon, Trash2 } from "lucide-react";
import React, { useState } from "react";
import { set } from "react-hook-form";
import { toast } from "sonner";

export default function DeleteExpense({ expense, trip }) {
  const [loading, setLoading] = useState(false);

  async function handleDeleteExpense(expense) {
    setLoading(true);

    try {
      await deleteExpenseAction({ id: expense?.id, tripId: trip.id });

      toast.success("Expense deleted successfully");
    } catch (error) {
      console.error("Error deleting expense:", error);
      toast.error("Error deleting expense: " + error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => handleDeleteExpense(expense)}
        disabled={loading}
      >
        {loading ? (
          <LoaderIcon className="h-4 w-4 animate-spin" />
        ) : (
          <Trash2 className="h-4 w-4 " />
        )}
      </Button>
    </div>
  );
}

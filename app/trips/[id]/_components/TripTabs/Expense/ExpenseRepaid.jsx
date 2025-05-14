"use client";
import { repayExpenseAction } from "@/actions/expense";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import useFetch from "@/hooks/useFetch";
import { formatCurrency } from "@/lib/utils";
import { CheckCheck } from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

export default function ExpenseRepaid({ expense, expenseMember }) {
  const {
    data: repayData,
    error: repayError,
    fn: repayExpenseFn,
    loading: repayLoading,
  } = useFetch(repayExpenseAction);

  const amountPerPerson = expense?.amount / expense?.expenseMembers.length;

  async function handleExpenseRepay(expenseMember) {
    await repayExpenseFn({
      expenseMember,
      hasRepaid: !expenseMember?.hasRepaid,
      tripId: expense?.tripId,
    });
  }

  useEffect(() => {
    if (repayData && !repayLoading) {
      toast.success("Expense repaid updated successfully");
    } else if (repayError) {
      console.error("Error repaying expense", repayError);
      toast.error("Error repaying expense: " + repayError.message);
    }
  }, [repayData, repayError, repayLoading]);

  return (
    <div className="mt-4 border-t pt-4">
      <p className="text-md font-medium mb-2">Mark as repaid / pay:</p>
      <div className="flex flex-wrap gap-2">
        {expense?.expenseMembers.map((expenseMember) => {
          if (expenseMember?.memberId === expense.paidById) return null;

          return (
            <Button
              onClick={() => handleExpenseRepay(expenseMember)}
              className="cursor-pointer p-3 text-sm"
              key={expenseMember?.id}
            >
              {expenseMember?.hasRepaid && (
                <CheckCheck className="ml-1 h-3 w-3" />
              )}
              {!repayLoading
                ? expenseMember?.member?.name +
                  ": " +
                  formatCurrency(amountPerPerson)
                : "Updating..."}
            </Button>
          );
        })}
      </div>
    </div>
  );
}

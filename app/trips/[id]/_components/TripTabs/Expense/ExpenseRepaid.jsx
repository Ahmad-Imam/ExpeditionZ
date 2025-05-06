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
  //   console.log("expenseMember");
  //   console.log(expenseMember);

  const [repaid, setRepaid] = useState(expenseMember?.hasRepaid || false);

  const amountPerPerson = expense.amount / expense?.expenseMembers.length;

  async function handleExpenseRepay() {
    console.log("repay");

    await repayExpenseFn({ expenseMember, hasRepaid: !repaid });
  }

  useEffect(() => {
    if (repayData && !repayLoading) {
      toast.success("Expense repaid updated successfully");
      setRepaid(!repaid);
    } else if (repayError) {
      console.error("Error repaying expense", repayError);
      toast.error("Error repaying expense: " + repayError.message);
    }
  }, [repayData, repayError, repayLoading]);

  return (
    <Button onClick={handleExpenseRepay} className="cursor-pointer p-3 text-sm">
      {repaid && <CheckCheck className="ml-1 h-3 w-3" />}
      {!repayLoading
        ? expenseMember?.member?.name + ": " + formatCurrency(amountPerPerson)
        : "Updating..."}
    </Button>
  );
}

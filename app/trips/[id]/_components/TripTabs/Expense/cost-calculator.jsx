"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Check, DollarSign, Trash2 } from "lucide-react";
import { useState } from "react";
import AddExpenseForm from "./AddExpenseForm";

export default function CostCalculator({ trip, setTrip }) {
  const initialPaidBy = trip.members[0]?.id || "none";
  const initialSplitWith = trip.members.map((m) => m.id);

  const [newExpense, setNewExpense] = useState({
    title: "",
    amount: "",
    paidBy: initialPaidBy,
    splitWith: initialSplitWith,
    category: "food",
  });
  const [isAddingExpense, setIsAddingExpense] = useState(false);
  const [activeTab, setActiveTab] = useState("expenses");

  const handleDeleteExpense = (id) => {
    setTrip({
      ...trip,
      expenses: trip.expenses.filter((e) => e.id !== id),
    });
  };

  const toggleRepayment = (expenseId, personId) => {
    setTrip({
      ...trip,
      expenses: trip.expenses.map((expense) => {
        if (expense.id !== expenseId) return expense;

        const repaidBy = expense.repaidBy || [];
        const newRepaidBy = repaidBy.includes(personId)
          ? repaidBy.filter((id) => id !== personId)
          : [...repaidBy, personId];

        return {
          ...expense,
          repaidBy: newRepaidBy,
        };
      }),
    });
  };

  // Calculate who owes what to whom
  const calculateBalances = () => {
    const balances = {};

    // Initialize balances for all members
    trip.members.forEach((member) => {
      balances[member.id] = 0;
    });

    // Calculate net balance for each person
    trip.expenses.forEach((expense) => {
      const paidBy = expense.paidBy;
      const splitWith = expense.splitWith;
      const repaidBy = expense.repaidBy || [];

      if (splitWith.length === 0) return;

      const amountPerPerson = expense.amount / splitWith.length;

      // For each person who should pay a share
      splitWith.forEach((personId) => {
        if (personId === paidBy) {
          // The payer doesn't owe themselves money
          return;
        }

        // If this person has repaid, they no longer owe money
        // and the payer has received their share
        if (repaidBy.includes(personId)) {
          // No change to balances - it's settled between these two people
        } else {
          // Person owes their share to the payer
          balances[personId] -= amountPerPerson;
          balances[paidBy] += amountPerPerson;
        }
      });
    });

    return balances;
  };

  const balances = calculateBalances();

  // Calculate who owes what to whom
  const calculateDebts = () => {
    const balances = calculateBalances();
    const debts = [];

    // Create a copy of balances for manipulation
    const remainingBalances = { ...balances };

    // Find people who owe money (negative balance)
    const debtors = Object.entries(remainingBalances)
      .filter(([_, balance]) => balance < 0)
      .sort(([_, a], [__, b]) => a - b); // Sort by amount (most negative first)

    // Find people who are owed money (positive balance)
    const creditors = Object.entries(remainingBalances)
      .filter(([_, balance]) => balance > 0)
      .sort(([_, a], [__, b]) => b - a); // Sort by amount (most positive first)

    let debtorIndex = 0;
    let creditorIndex = 0;

    // Match debtors with creditors until all debts are settled
    while (debtorIndex < debtors.length && creditorIndex < creditors.length) {
      const [debtorId, debtorBalance] = debtors[debtorIndex];
      const [creditorId, creditorBalance] = creditors[creditorIndex];

      // Calculate the amount to transfer
      const transferAmount = Math.min(Math.abs(debtorBalance), creditorBalance);

      if (transferAmount > 0.01) {
        // Ignore very small amounts
        debts.push({
          from: debtorId,
          to: creditorId,
          amount: Number.parseFloat(transferAmount.toFixed(2)),
        });
      }

      // Update remaining balances
      remainingBalances[debtorId] += transferAmount;
      remainingBalances[creditorId] -= transferAmount;

      // Move to next debtor if this one's debt is settled
      if (Math.abs(remainingBalances[debtorId]) < 0.01) {
        debtorIndex++;
      }

      // Move to next creditor if this one's credit is settled
      if (remainingBalances[creditorId] < 0.01) {
        creditorIndex++;
      }
    }

    return debts;
  };

  const debts = calculateDebts();

  const getMemberById = (id) => {
    return trip.members.find((m) => m.id === id);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const getTotalExpenses = () => {
    return trip.expenses.reduce((sum, expense) => sum + expense.amount, 0);
  };

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="expenses">Expenses</TabsTrigger>
          <TabsTrigger value="balances">Balances</TabsTrigger>
          <TabsTrigger value="settlements">Settlements</TabsTrigger>
        </TabsList>

        <TabsContent value="expenses">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-2xl font-bold ">Expenses</h3>
              <p className="">Total: {formatCurrency(getTotalExpenses())}</p>
            </div>
            <AddExpenseForm trip={trip} />
          </div>

          {trip.expenses.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg border">
              <div className="bg-purple-100 inline-block p-4 rounded-full mb-4">
                <DollarSign className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">No expenses yet</h3>
              <p className=" mb-6">
                Start adding expenses to track your trip spending
              </p>
              <AddExpenseForm trip={trip} />
            </div>
          ) : (
            <div className="space-y-4">
              {trip.expenses.map((expense) => {
                const paidBy = getMemberById(expense.paidBy);
                const splitWithMembers = expense.splitWith
                  .map((id) => getMemberById(id)?.name)
                  .filter(Boolean)
                  .join(", ");
                const repaidBy = expense.repaidBy || [];
                const amountPerPerson =
                  expense.amount / expense.splitWith.length;

                return (
                  <Card key={expense.id}>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between">
                        <CardTitle>{expense.title}</CardTitle>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteExpense(expense.id)}
                        >
                          <Trash2 className="h-4 w-4 text-gray-500" />
                        </Button>
                      </div>
                      <CardDescription>
                        {expense.date} •{" "}
                        {expense.category.charAt(0).toUpperCase() +
                          expense.category.slice(1)}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex justify-between items-center mb-4">
                        <div>
                          <p className="text-sm ">
                            Paid by{" "}
                            <span className="font-medium">{paidBy?.name}</span>
                          </p>
                          <p className="text-sm ">
                            Split with:{" "}
                            <span className="font-medium">
                              {splitWithMembers}
                            </span>
                          </p>
                        </div>
                        <div className="text-xl font-bold">
                          {formatCurrency(expense.amount)}
                        </div>
                      </div>

                      {/* Repayment section */}
                      <div className="mt-4 border-t pt-4">
                        <p className="text-sm font-medium mb-2">
                          Mark as repaid:
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {expense.splitWith.map((personId) => {
                            if (personId === expense.paidBy) return null; // Skip the person who paid
                            const person = getMemberById(personId);
                            const hasRepaid = repaidBy.includes(personId);

                            return (
                              <Badge
                                key={personId}
                                variant={hasRepaid ? "default" : "outline"}
                                className="cursor-pointer"
                                onClick={() =>
                                  toggleRepayment(expense.id, personId)
                                }
                              >
                                {person?.name} {formatCurrency(amountPerPerson)}
                                {hasRepaid && (
                                  <Check className="ml-1 h-3 w-3" />
                                )}
                              </Badge>
                            );
                          })}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>

        <TabsContent value="balances">
          <h3 className="text-2xl font-bold  mb-6">Current Balances</h3>

          <div className="grid gap-4">
            {trip.members.map((member) => {
              const balance = balances[member.id] || 0;
              return (
                <Card key={member.id}>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center">
                      <div className="font-medium">{member.name}</div>
                      <div
                        className={`font-bold ${
                          balance > 0
                            ? "text-green-600"
                            : balance < 0
                            ? "text-red-600"
                            : ""
                        }`}
                      >
                        {formatCurrency(balance)}
                      </div>
                    </div>
                    <div className="text-sm  mt-1">
                      {balance > 0
                        ? "is owed money"
                        : balance < 0
                        ? "owes money"
                        : "is settled up"}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="settlements">
          <h3 className="text-2xl font-bold  mb-6">Settlements</h3>

          {debts.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg border">
              <h3 className="text-xl font-semibold mb-2">All settled up!</h3>
              <p className="">Everyone has paid their fair share.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {debts.map((debt, index) => {
                const from = getMemberById(debt.from);
                const to = getMemberById(debt.to);
                return (
                  <Card key={index}>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-medium">
                            {from?.name} owes {to?.name}
                          </p>
                          <p className="text-sm  mt-1">
                            Payment needed to settle balance
                          </p>
                        </div>
                        <div className="text-xl font-bold">
                          {formatCurrency(debt.amount)}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

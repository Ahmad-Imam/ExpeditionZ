"use client";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DollarSign, Plus } from "lucide-react";
import { useState } from "react";

export default function AddExpenseForm({ trip }) {
  const initialPaidBy = trip.members[0]?.id || "none";
  const initialSplitWith = trip.members.map((m) => m.id);
  const [isAddingExpense, setIsAddingExpense] = useState(false);
  const [newExpense, setNewExpense] = useState({
    title: "",
    amount: "",
    paidBy: initialPaidBy,
    splitWith: initialSplitWith,
    category: "food",
  });

  const handleAddExpense = () => {
    if (!newExpense.title || !newExpense.amount || !newExpense.paidBy) return;

    const expense = {
      id: Date.now().toString(),
      title: newExpense.title,
      amount: Number.parseFloat(newExpense.amount),
      paidBy: newExpense.paidBy,
      splitWith: newExpense.splitWith || [],
      category: newExpense.category || "other",
      date: new Date().toISOString().split("T")[0],
      repaidBy: [], // Initialize with empty array for repayments
    };

    setTrip({
      ...trip,
      expenses: [...trip.expenses, expense],
    });

    setNewExpense({
      title: "",
      amount: "",
      paidBy: trip.members[0]?.id || "none",
      splitWith: trip.members.map((m) => m.id),
      category: "food",
    });

    setIsAddingExpense(false);
  };

  const togglePersonInSplit = (personId) => {
    setNewExpense((prev) => {
      const currentSplitWith = prev.splitWith || [];
      const newSplitWith = currentSplitWith.includes(personId)
        ? currentSplitWith.filter((id) => id !== personId)
        : [...currentSplitWith, personId];

      return { ...prev, splitWith: newSplitWith };
    });
  };
  return (
    <div>
      <Dialog open={isAddingExpense} onOpenChange={setIsAddingExpense}>
        <DialogTrigger asChild>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Expense
          </Button>
        </DialogTrigger>
        <DialogContent className={""}>
          <DialogHeader>
            <DialogTitle>Add New Expense</DialogTitle>
            <DialogDescription>
              Enter the details of the expense to split with your group.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Expense Title</Label>
              <Input
                id="title"
                placeholder="Dinner at Restaurant"
                value={newExpense.title}
                onChange={(e) =>
                  setNewExpense({ ...newExpense, title: e.target.value })
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="amount">Amount</Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                <Input
                  id="amount"
                  type="number"
                  placeholder="0.00"
                  className="pl-10"
                  value={newExpense.amount}
                  onChange={(e) =>
                    setNewExpense({
                      ...newExpense,
                      amount: e.target.value,
                    })
                  }
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="category">Category</Label>
              <Select
                value={newExpense.category}
                onValueChange={(value) =>
                  setNewExpense({ ...newExpense, category: value })
                }
              >
                <SelectTrigger id="category">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="food">Food & Drinks</SelectItem>
                  <SelectItem value="accommodation">Accommodation</SelectItem>
                  <SelectItem value="transportation">Transportation</SelectItem>
                  <SelectItem value="activities">Activities</SelectItem>
                  <SelectItem value="shopping">Shopping</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="paidBy">Paid By</Label>
              <Select
                value={newExpense.paidBy}
                onValueChange={(value) =>
                  setNewExpense({ ...newExpense, paidBy: value })
                }
              >
                <SelectTrigger id="paidBy">
                  <SelectValue placeholder="Select a person" />
                </SelectTrigger>
                <SelectContent>
                  {trip.members.map((member) => (
                    <SelectItem key={member.id} value={member.id}>
                      {member.name}
                    </SelectItem>
                  ))}
                  {trip.members.length === 0 && (
                    <SelectItem value="none" disabled>
                      No members
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label>Split With</Label>
              <div className="border rounded-md p-4 space-y-2">
                {trip.members.map((member) => (
                  <div key={member.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`member-${member.id}`}
                      checked={(newExpense.splitWith || []).includes(member.id)}
                      onCheckedChange={() => togglePersonInSplit(member.id)}
                    />
                    <label
                      htmlFor={`member-${member.id}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {member.name}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddingExpense(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddExpense}>Add Expense</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

"use client";
import { updateExpenseAction } from "@/actions/expense";
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
import useFetch from "@/hooks/useFetch";
import { DollarSign, Edit } from "lucide-react";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

export default function EditExpenseForm({ trip, expense }) {
  const [isEditingExpense, setIsEditingExpense] = useState(false);

  const {
    data: updatedExpenseData,
    error: updateExpenseError,
    fn: updateExpenseFn,
    loading: isEditingExpenseLoading,
  } = useFetch(updateExpenseAction);

  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: expense.title,
      amount: expense.amount,
      paidBy: expense.paidById,
      splitWith: expense.expenseMembers.map((em) => em.memberId),
      category: expense.category,
      date: new Date(expense?.date).toISOString().slice(0, 10),
    },
  });

  const onSubmit = async (data) => {
    const updatedExpense = {
      ...data,
      amount: Number.parseFloat(data.amount),
      date: data.date,

      tripId: trip.id,
      id: expense.id,
    };

    const result = await updateExpenseFn(updatedExpense);

    if (result) {
      reset({
        title: "",
        amount: "",
        paidBy: trip?.members[0]?.id || "",
        splitWith: trip?.members.map((m) => m.id),
        category: "food",
        date: new Date().toISOString().slice(0, 10),
      });
    }
  };

  useEffect(() => {
    if (updateExpenseError)
      toast.error("Error updating expense: " + updateExpenseError.message);
    if (updatedExpenseData && !isEditingExpenseLoading) {
      toast.success("Expense updated successfully!");
      setIsEditingExpense(false);
    }
  }, [updatedExpenseData, isEditingExpenseLoading, updateExpenseError]);

  return (
    <div>
      <Dialog open={isEditingExpense} onOpenChange={setIsEditingExpense}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm">
            <Edit className="h-4 w-4 mr-2" />
            Edit Expense
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Expense</DialogTitle>
            <DialogDescription>
              Update the details of the expense.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Expense Title</Label>
                <Input
                  id="title"
                  placeholder="Dinner at Restaurant"
                  {...register("title", { required: "Title is required" })}
                />
                {errors.title && (
                  <p className="text-red-600 text-sm">{errors.title.message}</p>
                )}
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
                    step="0.01"
                    {...register("amount", {
                      required: "Amount is required",
                      min: { value: 0.01, message: "Amount must be positive" },
                    })}
                  />
                </div>
                {errors.amount && (
                  <p className="text-red-600 text-sm">
                    {errors.amount.message}
                  </p>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="category">Category</Label>
                <Controller
                  name="category"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger id="category">
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="food">Food & Drinks</SelectItem>
                        <SelectItem value="accommodation">
                          Accommodation
                        </SelectItem>
                        <SelectItem value="transportation">
                          Transportation
                        </SelectItem>
                        <SelectItem value="activities">Activities</SelectItem>
                        <SelectItem value="shopping">Shopping</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="paidBy">Paid By</Label>
                <Controller
                  name="paidBy"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger id="paidBy">
                        <SelectValue placeholder="Select a person" />
                      </SelectTrigger>
                      <SelectContent>
                        {trip?.members.map((member) => (
                          <SelectItem key={member.id} value={member.id}>
                            {member.name}
                          </SelectItem>
                        ))}
                        {trip?.members.length === 0 && (
                          <SelectItem value="none" disabled>
                            No members
                          </SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="date">Paid At</Label>
                <Input
                  id="date"
                  type="date"
                  {...register("date", { required: "Date is required" })}
                />
                {errors.date && (
                  <p className="text-red-600 text-sm">{errors.date.message}</p>
                )}
              </div>
              <div className="grid gap-2">
                <Label>Split With</Label>
                <div className="border rounded-md p-4 space-y-2">
                  {trip?.members.map((member) => (
                    <div
                      key={member.id}
                      className="flex items-center space-x-2"
                    >
                      <Controller
                        name="splitWith"
                        control={control}
                        render={({ field }) => (
                          <Checkbox
                            id={`member-${member.id}`}
                            checked={field.value?.includes(member.id)}
                            onCheckedChange={() => {
                              const current = field.value || [];
                              if (current.includes(member.id)) {
                                field.onChange(
                                  current.filter((id) => id !== member.id)
                                );
                              } else {
                                field.onChange([...current, member.id]);
                              }
                            }}
                          />
                        )}
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
              <Button
                variant="outline"
                type="button"
                onClick={() => setIsEditingExpense(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isEditingExpenseLoading}>
                {isEditingExpenseLoading ? "Updating..." : "Update Expense"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

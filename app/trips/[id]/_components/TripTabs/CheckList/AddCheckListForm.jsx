"use client";
import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus } from "lucide-react";
import useFetch from "@/hooks/useFetch";
import { createCheckListItemAction } from "@/actions/checklist";
import { toast } from "sonner";

export default function AddCheckListForm({ trip, categories }) {
  const [isAddingItem, setIsAddingItem] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: "",
      category: "",
      assignedTo: "unassigned",
    },
  });

  const {
    data: newCheckList,
    error: newCheckListError,
    fn: createCheckListItemFn,
    loading: isCreatingCheckListItem,
  } = useFetch(createCheckListItemAction);

  async function onSubmit(data) {
    const newData = {
      ...data,
      tripId: trip.id,
      assignedTo: data.assignedTo === "unassigned" ? null : data.assignedTo,
    };

    await createCheckListItemFn(newData);
    setIsAddingItem(false);
  }

  useEffect(() => {
    if (newCheckList && !isCreatingCheckListItem) {
      toast.success("Checklist item created successfully!");
      reset();
    }
    if (newCheckListError) {
      console.error("Error creating checklist item:", newCheckListError);
      toast.error(
        "Error creating checklist item: " + newCheckListError.message
      );
    }
  }, [newCheckList, newCheckListError, isCreatingCheckListItem]);

  return (
    <div>
      <Dialog open={isAddingItem} onOpenChange={setIsAddingItem}>
        <DialogTrigger asChild>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Item
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Checklist Item</DialogTitle>
            <DialogDescription>
              Add a new item to your trip checklist.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Item Title</Label>
                <Input
                  id="title"
                  placeholder="Passport"
                  {...register("title", { required: "Title is required" })}
                />
                {errors.title && (
                  <p className="text-red-600 text-sm">{errors.title.message}</p>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="category">Category</Label>
                <Controller
                  name="category"
                  control={control}
                  rules={{ required: "Category is required" }}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger id="category">
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem
                            key={category.value}
                            value={category.value}
                            className={"hover:bg-accent cursor-pointer"}
                          >
                            {category.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.category && (
                  <p className="text-red-600 text-sm">
                    {errors.category.message}
                  </p>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="assignedTo">Assigned To (Optional)</Label>
                <Controller
                  name="assignedTo"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger id="assignedTo">
                        <SelectValue placeholder="Select a person" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="unassigned">Unassigned</SelectItem>
                        {trip?.members.map((member) => (
                          <SelectItem
                            key={member.id}
                            value={member.id}
                            className={"hover:bg-accent cursor-pointer"}
                          >
                            {member.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                type="button"
                onClick={() => setIsAddingItem(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isCreatingCheckListItem}>
                {isCreatingCheckListItem ? "Adding..." : "Add Item"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

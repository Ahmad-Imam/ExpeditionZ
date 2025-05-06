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
import { Edit } from "lucide-react";
import useFetch from "@/hooks/useFetch";
import { editCheckListItemAction } from "@/actions/checklist";
import { toast } from "sonner";

export default function EditCheckListForm({ trip, categories, checklistItem }) {
  const [isEditingItem, setIsEditingItem] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: checklistItem.title,
      category: checklistItem.category,
      assignedTo: checklistItem.assignedToId || "unassigned",
    },
  });

  const {
    data: updatedCheckList,
    error: updateCheckListError,
    fn: updateCheckListItemFn,
    loading: isUpdatingCheckListItem,
  } = useFetch(editCheckListItemAction);

  async function onSubmit(data) {
    const updatedData = {
      ...data,
      id: checklistItem.id,
      tripId: trip.id,
      assignedTo: data.assignedTo === "unassigned" ? null : data.assignedTo,
    };
    console.log(updatedData);
    await updateCheckListItemFn(updatedData);
    reset();
  }

  useEffect(() => {
    if (updatedCheckList && !isUpdatingCheckListItem) {
      console.log("Checklist item updated:", updatedCheckList);
      toast.success("Checklist item updated successfully!");
      setIsEditingItem(false); // Close the dialog
    }
    if (updateCheckListError) {
      console.error("Error updating checklist item:", updateCheckListError);
      toast.error(
        "Error updating checklist item: " + updateCheckListError.message
      );
    }
  }, [updatedCheckList, updateCheckListError, isUpdatingCheckListItem]);

  return (
    <div>
      <Dialog open={isEditingItem} onOpenChange={setIsEditingItem}>
        <DialogTrigger asChild>
          <Edit className="h-4 w-4 mr-2 cursor-pointer " />
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Checklist Item</DialogTitle>
            <DialogDescription>
              Update the details of your checklist item.
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
                          <SelectItem key={member.id} value={member.id}>
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
                onClick={() => setIsEditingItem(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isUpdatingCheckListItem}>
                {isUpdatingCheckListItem ? "Updating..." : "Update Item"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

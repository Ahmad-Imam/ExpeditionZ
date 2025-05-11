"use client";
import React, { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Edit, LoaderIcon, Trash2 } from "lucide-react";
import EditCheckListForm from "./EditCheckListForm";
import { Badge } from "@/components/ui/badge";
import {
  deleteCheckListItemAction,
  toggleCheckListItemAction,
} from "@/actions/checklist";
import { toast } from "sonner";

export default function CheckListItems({ trip }) {
  const categories = [
    { value: "essentials", label: "Essentials" },
    { value: "clothing", label: "Clothing" },
    { value: "toiletries", label: "Toiletries" },
    { value: "electronics", label: "Electronics" },
    { value: "documents", label: "Documents" },
    { value: "other", label: "Other" },
  ];

  const getCategoryLabel = (value) => {
    return categories.find((cat) => cat.value === value)?.label || value;
  };
  const [filter, setFilter] = useState("all");
  const filteredItems = trip.checklist
    .filter((item) => {
      if (filter === "all") return true;
      if (filter === "completed") return item.completed;
      if (filter === "pending") return !item.completed;
      return item.category === filter;
    })
    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

  const [loading, setLoading] = useState(false);

  async function handleDeleteItem(item) {
    try {
      setLoading(true);
      await deleteCheckListItemAction(item);
      toast.success("Item deleted successfully");
    } catch (error) {
      console.error("Error deleting item:", error);
      toast.error("Error deleting item. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function toggleItemCompletion(item, val) {
    try {
      setLoading(true);
      await toggleCheckListItemAction(item?.id, val, trip.id);
      console.log(val);
      console.log(item);
      toast.success("Item updated successfully");
    } catch (error) {
      console.error("Error updating item:", error);
      toast.error("Error updating item. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <div className="space-y-6">
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Filter items" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Items</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="essentials">Essentials</SelectItem>
            <SelectItem value="clothing">Clothing</SelectItem>
            <SelectItem value="toiletries">Toiletries</SelectItem>
            <SelectItem value="electronics">Electronics</SelectItem>
            <SelectItem value="documents">Documents</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
        {filteredItems.map((item) => {
          const assignedPerson = trip?.members.find(
            (m) => m.id === item.assignedToId
          );

          return (
            <Card key={item.id} className={item.completed ? "opacity-70" : ""}>
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-start gap-3">
                  <Checkbox
                    id={`item-${item.id}`}
                    checked={item.completed}
                    onCheckedChange={(val) => toggleItemCompletion(item, val)}
                    className="mt-1 cursor-pointer"
                  />
                  <div>
                    <label
                      htmlFor={`item-${item.id}`}
                      className={`font-medium ${
                        item.completed ? "line-through text-gray-500" : ""
                      }`}
                    >
                      {item.title}
                    </label>
                    <div className="flex flex-col items-start flex-wrap gap-2">
                      <span className="inline-flex items-center py-2 rounded-full  font-medium  ">
                        {getCategoryLabel(item.category)}
                      </span>
                      {assignedPerson && (
                        <Badge className="inline-flex items-center px-2 py-1 rounded-full  font-medium">
                          {assignedPerson.name}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex gap-4 pr-4">
                  <EditCheckListForm
                    categories={categories}
                    trip={trip}
                    checklistItem={item}
                  />
                  {loading ? (
                    <LoaderIcon className="h-5 w-5 animate-spin " />
                  ) : (
                    <Trash2
                      className="h-4 w-4 cursor-pointer "
                      onClick={() => handleDeleteItem(item)}
                    />
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

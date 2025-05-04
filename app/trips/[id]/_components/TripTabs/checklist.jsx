"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
import { CheckSquare, Edit, Plus, Trash2 } from "lucide-react";
import { useState } from "react";

export default function Checklist({ trip, setTrip }) {
  const [newItem, setNewItem] = useState({
    title: "",
    category: "essentials",
    assignedTo: "unassigned",
  });
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [isEditingItem, setIsEditingItem] = useState(false);
  const [filter, setFilter] = useState("all");

  const handleAddItem = () => {
    if (!newItem.title) return;

    const item = {
      id: Date.now().toString(),
      title: newItem.title,
      completed: false,
      category: newItem.category || "essentials",
      assignedTo: newItem.assignedTo || "unassigned",
      createdAt: new Date().toISOString(),
    };

    setTrip({
      ...trip,
      checklist: [...trip.checklist, item],
    });

    setNewItem({
      title: "",
      category: "essentials",
      assignedTo: "unassigned",
    });

    setIsAddingItem(false);
  };

  const handleEditItem = () => {
    if (!editingItem || !editingItem.title) return;

    setTrip({
      ...trip,
      checklist: trip.checklist.map((item) =>
        item.id === editingItem.id ? editingItem : item
      ),
    });

    setEditingItem(null);
    setIsEditingItem(false);
  };

  const handleDeleteItem = (id) => {
    setTrip({
      ...trip,
      checklist: trip.checklist.filter((item) => item.id !== id),
    });
  };

  const toggleItemCompletion = (id) => {
    setTrip({
      ...trip,
      checklist: trip.checklist.map((item) =>
        item.id === id ? { ...item, completed: !item.completed } : item
      ),
    });
  };

  const filteredItems = trip.checklist.filter((item) => {
    if (filter === "all") return true;
    if (filter === "completed") return item.completed;
    if (filter === "pending") return !item.completed;
    return item.category === filter;
  });

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

  const getCategoryLabel = (value) => {
    return categories.find((cat) => cat.value === value)?.label || value;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="text-2xl font-bold text-purple-900">Trip Checklist</h3>
          <p className="text-gray-600">
            {stats.completed} of {stats.total} items completed (
            {stats.percentage}%)
          </p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
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
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="title">Item Title</Label>
                  <Input
                    id="title"
                    placeholder="Passport"
                    value={newItem.title}
                    onChange={(e) =>
                      setNewItem({ ...newItem, title: e.target.value })
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={newItem.category}
                    onValueChange={(value) =>
                      setNewItem({ ...newItem, category: value })
                    }
                  >
                    <SelectTrigger id="category">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.value} value={category.value}>
                          {category.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="assignedTo">Assigned To (Optional)</Label>
                  <Select
                    value={newItem.assignedTo}
                    onValueChange={(value) =>
                      setNewItem({ ...newItem, assignedTo: value })
                    }
                  >
                    <SelectTrigger id="assignedTo">
                      <SelectValue placeholder="Select a person" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="unassigned">Unassigned</SelectItem>
                      {trip.members.map((member) => (
                        <SelectItem key={member.id} value={member.id}>
                          {member.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsAddingItem(false)}
                >
                  Cancel
                </Button>
                <Button onClick={handleAddItem}>Add Item</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Dialog open={isEditingItem} onOpenChange={setIsEditingItem}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Checklist Item</DialogTitle>
                <DialogDescription>
                  Update the details of this checklist item.
                </DialogDescription>
              </DialogHeader>
              {editingItem && (
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="edit-title">Item Title</Label>
                    <Input
                      id="edit-title"
                      placeholder="Passport"
                      value={editingItem.title}
                      onChange={(e) =>
                        setEditingItem({
                          ...editingItem,
                          title: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="edit-category">Category</Label>
                    <Select
                      value={editingItem.category}
                      onValueChange={(value) =>
                        setEditingItem({ ...editingItem, category: value })
                      }
                    >
                      <SelectTrigger id="edit-category">
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
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="edit-assignedTo">
                      Assigned To (Optional)
                    </Label>
                    <Select
                      value={editingItem.assignedTo}
                      onValueChange={(value) =>
                        setEditingItem({ ...editingItem, assignedTo: value })
                      }
                    >
                      <SelectTrigger id="edit-assignedTo">
                        <SelectValue placeholder="Select a person" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="unassigned">Unassigned</SelectItem>
                        {trip.members.map((member) => (
                          <SelectItem key={member.id} value={member.id}>
                            {member.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsEditingItem(false)}
                >
                  Cancel
                </Button>
                <Button onClick={handleEditItem}>Save Changes</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Progress bar */}
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div
          className="bg-purple-600 h-2.5 rounded-full"
          style={{ width: `${stats.percentage}%` }}
        ></div>
      </div>

      {filteredItems.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border">
          <div className="bg-purple-100 inline-block p-4 rounded-full mb-4">
            <CheckSquare className="h-8 w-8 text-purple-600" />
          </div>
          <h3 className="text-xl font-semibold mb-2">No items found</h3>
          <p className="text-gray-600 mb-6">
            {trip.checklist.length === 0
              ? "Start adding items to your checklist"
              : "No items match your current filter"}
          </p>
          <Button onClick={() => setIsAddingItem(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add First Item
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredItems.map((item) => {
            const assignedPerson = trip.members.find(
              (m) => m.id === item.assignedTo
            );

            return (
              <Card
                key={item.id}
                className={item.completed ? "opacity-70" : ""}
              >
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="flex items-start gap-3">
                    <Checkbox
                      id={`item-${item.id}`}
                      checked={item.completed}
                      onCheckedChange={() => toggleItemCompletion(item.id)}
                      className="mt-1"
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
                      <div className="flex flex-wrap gap-2 mt-1">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                          {getCategoryLabel(item.category)}
                        </span>
                        {assignedPerson && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {assignedPerson.name}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setEditingItem(item);
                        setIsEditingItem(true);
                      }}
                    >
                      <Edit className="h-4 w-4 text-gray-500" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteItem(item.id)}
                    >
                      <Trash2 className="h-4 w-4 text-gray-500" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

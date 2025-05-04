"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Textarea } from "@/components/ui/textarea";
import { Calendar, Check, Clock, Edit, Plus, Trash2 } from "lucide-react";
import { useState } from "react";

export default function TimelineCreator({ trip, setTrip }) {
  const [newPoint, setNewPoint] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
  });
  const [isAddingPoint, setIsAddingPoint] = useState(false);
  const [editingPoint, setEditingPoint] = useState(null);
  const [isEditingPoint, setIsEditingPoint] = useState(false);

  const handleAddPoint = () => {
    if (!newPoint.title || !newPoint.date) return;

    const point = {
      id: Date.now().toString(),
      title: newPoint.title,
      description: newPoint.description || "",
      date: newPoint.date,
      time: newPoint.time || "",
      completed: false,
      createdAt: new Date().toISOString(),
    };

    // Sort timeline by date and time
    const updatedTimeline = [...trip.timeline, point].sort((a, b) => {
      const dateA = new Date(`${a.date}T${a.time || "00:00"}`);
      const dateB = new Date(`${b.date}T${b.time || "00:00"}`);
      return dateA.getTime() - dateB.getTime();
    });

    setTrip({
      ...trip,
      timeline: updatedTimeline,
    });

    setNewPoint({
      title: "",
      description: "",
      date: "",
      time: "",
    });

    setIsAddingPoint(false);
  };

  const handleEditPoint = () => {
    if (!editingPoint || !editingPoint.title || !editingPoint.date) return;

    // Sort timeline by date and time after edit
    const updatedTimeline = trip.timeline
      .map((point) => (point.id === editingPoint.id ? editingPoint : point))
      .sort((a, b) => {
        const dateA = new Date(`${a.date}T${a.time || "00:00"}`);
        const dateB = new Date(`${b.date}T${b.time || "00:00"}`);
        return dateA.getTime() - dateB.getTime();
      });

    setTrip({
      ...trip,
      timeline: updatedTimeline,
    });

    setEditingPoint(null);
    setIsEditingPoint(false);
  };

  const handleDeletePoint = (id) => {
    setTrip({
      ...trip,
      timeline: trip.timeline.filter((point) => point.id !== id),
    });
  };

  const togglePointCompletion = (id) => {
    setTrip({
      ...trip,
      timeline: trip.timeline.map((point) =>
        point.id === id ? { ...point, completed: !point.completed } : point
      ),
    });
  };

  const formatDate = (dateString) => {
    const options = {
      weekday: "short",
      month: "short",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-bold text-purple-900">Trip Timeline</h3>

        <Dialog open={isAddingPoint} onOpenChange={setIsAddingPoint}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Timeline Point
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Timeline Point</DialogTitle>
              <DialogDescription>
                Add a new point to your trip timeline.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  placeholder="Flight to Paris"
                  value={newPoint.title}
                  onChange={(e) =>
                    setNewPoint({ ...newPoint, title: e.target.value })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description (Optional)</Label>
                <Textarea
                  id="description"
                  placeholder="Flight details, terminal information, etc."
                  value={newPoint.description}
                  onChange={(e) =>
                    setNewPoint({ ...newPoint, description: e.target.value })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={newPoint.date}
                  onChange={(e) =>
                    setNewPoint({ ...newPoint, date: e.target.value })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="time">Time (Optional)</Label>
                <Input
                  id="time"
                  type="time"
                  value={newPoint.time}
                  onChange={(e) =>
                    setNewPoint({ ...newPoint, time: e.target.value })
                  }
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddingPoint(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddPoint}>Add Point</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={isEditingPoint} onOpenChange={setIsEditingPoint}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Timeline Point</DialogTitle>
              <DialogDescription>
                Update the details of this timeline point.
              </DialogDescription>
            </DialogHeader>
            {editingPoint && (
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-title">Title</Label>
                  <Input
                    id="edit-title"
                    placeholder="Flight to Paris"
                    value={editingPoint.title}
                    onChange={(e) =>
                      setEditingPoint({
                        ...editingPoint,
                        title: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-description">
                    Description (Optional)
                  </Label>
                  <Textarea
                    id="edit-description"
                    placeholder="Flight details, terminal information, etc."
                    value={editingPoint.description}
                    onChange={(e) =>
                      setEditingPoint({
                        ...editingPoint,
                        description: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-date">Date</Label>
                  <Input
                    id="edit-date"
                    type="date"
                    value={editingPoint.date}
                    onChange={(e) =>
                      setEditingPoint({ ...editingPoint, date: e.target.value })
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-time">Time (Optional)</Label>
                  <Input
                    id="edit-time"
                    type="time"
                    value={editingPoint.time}
                    onChange={(e) =>
                      setEditingPoint({ ...editingPoint, time: e.target.value })
                    }
                  />
                </div>
              </div>
            )}
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsEditingPoint(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleEditPoint}>Save Changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {trip.timeline.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border">
          <div className="bg-purple-100 inline-block p-4 rounded-full mb-4">
            <Clock className="h-8 w-8 text-purple-600" />
          </div>
          <h3 className="text-xl font-semibold mb-2">No timeline points yet</h3>
          <p className="text-gray-600 mb-6">
            Start adding points to create your trip timeline
          </p>
          <Button onClick={() => setIsAddingPoint(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add First Point
          </Button>
        </div>
      ) : (
        <div className="relative">
          {/* Vertical line in the middle with progress indicator */}
          <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gray-200 -translate-x-1/2">
            {/* Progress overlay */}
            <div
              className="absolute left-0 top-0 w-full bg-purple-600 transition-all duration-500"
              style={{
                height: `${
                  trip.timeline.length > 0
                    ? (trip.timeline.filter((point) => point.completed).length /
                        trip.timeline.length) *
                      100
                    : 0
                }%`,
              }}
            ></div>
          </div>

          <div className="space-y-8">
            {trip.timeline.map((point, index) => {
              const isEven = index % 2 === 0;

              return (
                <div
                  key={point.id}
                  className={`flex items-start gap-4 ${
                    isEven ? "flex-row" : "flex-row-reverse"
                  } justify-center`}
                >
                  {/* Content on the left or right */}
                  <div
                    className={`w-1/2 ${isEven ? "text-right pr-8" : "pl-8"}`}
                  >
                    <Card className={point.completed ? "opacity-70" : ""}>
                      <CardHeader className="pb-2">
                        <div
                          className={`flex ${
                            isEven ? "justify-end" : "justify-start"
                          } gap-2`}
                        >
                          <CardTitle
                            className={point.completed ? "text-gray-500" : ""}
                          >
                            {point.title}
                          </CardTitle>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div
                          className={`text-sm text-gray-600 mb-2 ${
                            isEven ? "text-right" : "text-left"
                          }`}
                        >
                          {formatDate(point.date)}
                          {point.time && ` • ${point.time}`}
                        </div>
                        {point.description && (
                          <p
                            className={`text-sm ${
                              point.completed
                                ? "text-gray-500"
                                : "text-gray-700"
                            } ${isEven ? "text-right" : "text-left"}`}
                          >
                            {point.description}
                          </p>
                        )}
                        <div
                          className={`flex mt-3 ${
                            isEven ? "justify-end" : "justify-start"
                          } gap-1`}
                        >
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => togglePointCompletion(point.id)}
                            title={
                              point.completed
                                ? "Mark as incomplete"
                                : "Mark as complete"
                            }
                          >
                            <Check
                              className={`h-4 w-4 ${
                                point.completed
                                  ? "text-green-500"
                                  : "text-gray-400"
                              }`}
                            />
                            <span className="ml-1">
                              {point.completed ? "Completed" : "Mark complete"}
                            </span>
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setEditingPoint(point);
                              setIsEditingPoint(true);
                            }}
                          >
                            <Edit className="h-4 w-4 text-gray-500" />
                            <span className="ml-1">Edit</span>
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeletePoint(point.id)}
                          >
                            <Trash2 className="h-4 w-4 text-gray-500" />
                            <span className="ml-1">Delete</span>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Timeline dot in the middle */}
                  <div className="relative z-10 flex-shrink-0">
                    <div
                      className={`h-12 w-12 rounded-full flex items-center justify-center border-2 ${
                        point.completed
                          ? "bg-purple-600 border-purple-700 text-white"
                          : "bg-white border-purple-300 text-purple-600"
                      }`}
                    >
                      {point.completed ? (
                        <Check className="h-6 w-6" />
                      ) : (
                        <Calendar className="h-6 w-6" />
                      )}
                    </div>
                    {/* Connector lines to the vertical bar */}
                    <div
                      className={`absolute top-1/2 ${
                        isEven ? "right-full" : "left-full"
                      } w-4 h-0.5 ${
                        point.completed ? "bg-purple-600" : "bg-gray-200"
                      }`}
                    ></div>
                  </div>

                  {/* Empty space on the other side */}
                  <div className="w-1/2"></div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

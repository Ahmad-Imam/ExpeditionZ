"use client";
import React, { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { Button } from "@/components/ui/button";
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
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import useFetch from "@/hooks/useFetch";
import { createPollAction } from "@/actions/poll";

export default function AddPoll({ trip }) {
  const [isAddingPoll, setIsAddingPoll] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      question: "",
      options: [{ text: "" }, { text: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "options",
  });

  const {
    data: pollData,
    error: addPollError,
    fn: addPollFn,
    loading: isAddingPollLoading,
  } = useFetch(createPollAction);

  const onSubmit = async (data) => {
    const poll = {
      ...data,
      options: data.options.map((opt, idx) => ({
        id: (idx + 1).toString(),
        text: opt.text,
        votes: [],
      })),
      tripId: trip.id,
    };

    await addPollFn(poll);
  };

  useEffect(() => {
    if (addPollError) {
      toast.error(addPollError.message);
    }
    if (pollData && !isAddingPollLoading) {
      toast.success("Poll created successfully!");
      reset();
      setIsAddingPoll(false);
    }
  }, [addPollError, pollData, isAddingPollLoading]);

  return (
    <div>
      <Dialog open={isAddingPoll} onOpenChange={setIsAddingPoll}>
        <DialogTrigger asChild>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Create Poll
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Poll</DialogTitle>
            <DialogDescription>
              Create a poll for your group to vote on.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="question">Question</Label>
                <Input
                  id="question"
                  placeholder="Where should we eat dinner tonight?"
                  {...register("question", {
                    required: "Question is required",
                  })}
                />
                {errors.question && (
                  <p className="text-red-600 text-sm">
                    {errors.question.message}
                  </p>
                )}
              </div>
              <div className="grid gap-2">
                <Label>Options</Label>
                <div className="space-y-2">
                  {fields.map((field, index) => (
                    <div key={field.id} className="flex gap-2">
                      <Input
                        placeholder={`Option ${index + 1}`}
                        {...register(`options.${index}.text`, {
                          required: "Option is required",
                        })}
                      />
                      {fields.length > 2 && (
                        <Button
                          variant="ghost"
                          size="icon"
                          type="button"
                          onClick={() => remove(index)}
                        >
                          <Trash2 className="h-4 w-4 text-gray-500" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  type="button"
                  onClick={() => append({ text: "" })}
                  className="mt-2"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Option
                </Button>
                {errors.options && (
                  <p className="text-red-600 text-sm">
                    {errors.options.message}
                  </p>
                )}
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                type="button"
                onClick={() => setIsAddingPoll(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={
                  !!errors.question ||
                  fields.some((_, idx) => errors.options?.[idx]?.text) ||
                  isAddingPollLoading
                }
              >
                {isAddingPollLoading ? "Creating..." : "Create Poll"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

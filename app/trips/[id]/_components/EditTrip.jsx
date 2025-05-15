"use client";
import { searchUsersByName, updateTripAction } from "@/actions/trip";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogClose,
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
import useDebounce from "@/hooks/useDebounce";
import useFetch from "@/hooks/useFetch";
import { Edit } from "lucide-react";
import { useEffect, useState } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";

export default function EditTripDialog({ initialData }) {
  const [open, setOpen] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      tripName: initialData?.name || "",
      destination: initialData?.destination || "",
      startDate:
        new Date(initialData?.startDate).toISOString().slice(0, 10) || "",
      endDate: new Date(initialData?.endDate).toISOString().slice(0, 10) || "",
      description: initialData?.description || "",
      members:
        initialData?.members?.map((m) => ({
          name: m.name,
          id: m.id,
          isAdmin: m.isAdmin,
          userId: m.userId,
        })) || [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "members",
  });

  const {
    data: tripsUpdated,
    loading: tripsLoading,
    error: tripsError,
    fn: updateTripsFn,
  } = useFetch(updateTripAction);

  const [searchResults, setSearchResults] = useState({});
  const debouncedSearch = useDebounce(async (query, idx) => {
    if (!query) {
      setSearchResults((p) => ({ ...p, [idx]: [] }));
      return;
    }
    const results = await searchUsersByName(query);

    const currentUserIds = fields.map((m) => m.userId);

    const filteredResults = results.filter(
      (u) => !currentUserIds.includes(u.id)
    );

    setSearchResults((p) => ({ ...p, [idx]: filteredResults || [] }));
  }, 300);

  const onSubmitForm = async (vals) => {
    const payload = {
      id: initialData.id,
      name: vals.tripName,
      destination: vals.destination,
      startDate: vals.startDate,
      endDate: vals.endDate,
      description: vals.description,
      members: vals.members
        .filter((m) => m.name.trim())
        .map((m) => ({
          name: m.name,
          id: m.id,
          isAdmin: m.isAdmin,
          userId: m.userId,
        })),
    };

    try {
      await updateTripsFn(payload);

      setOpen(false);
    } catch (e) {
      toast.error("Failed to update trip.");
    }
  };

  useEffect(() => {
    if (tripsUpdated && !tripsLoading) {
      toast.success("Trip updated successfully!");
    }
  }, [tripsUpdated, tripsLoading]);

  useEffect(() => {
    if (open) {
      reset({
        tripName: initialData?.name || "",
        destination: initialData?.destination || "",
        startDate:
          new Date(initialData?.startDate).toISOString().slice(0, 10) || "",
        endDate:
          new Date(initialData?.endDate).toISOString().slice(0, 10) || "",
        description: initialData?.description || "",
        members:
          initialData?.members?.map((m) => ({
            name: m.name,
            userId: m.userId,
            id: m.id,
            isAdmin: m.isAdmin,
          })) || [],
      });
    }
  }, [initialData, reset, open]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Edit className="h-4 w-4 mr-2" />
          Edit Trip
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <form
          onSubmit={handleSubmit(onSubmitForm, (formErrors) => {
            console.log("Form validation errors:", formErrors);
          })}
        >
          <DialogHeader>
            <DialogTitle>Edit Trip</DialogTitle>
            <DialogDescription>Update trip details below.</DialogDescription>
          </DialogHeader>
          <div className="space-y-6 pt-6">
            <div className="grid grid-cols-2 gap-6">
              <div className="flex flex-col gap-6">
                <Label htmlFor="tripName">Trip Name</Label>
                <Input
                  id="tripName"
                  {...register("tripName", { required: "Required" })}
                />
                {errors.tripName && (
                  <p className="text-red-600">{errors.tripName.message}</p>
                )}
              </div>
              <div className="flex flex-col gap-6">
                <Label htmlFor="destination">Destination</Label>
                <Input
                  id="destination"
                  {...register("destination", { required: "Required" })}
                />
                {errors.destination && (
                  <p className="text-red-600">{errors.destination.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="flex flex-col gap-6">
                <Label htmlFor="startDate">Start Date</Label>
                <Input
                  id="startDate"
                  type="date"
                  {...register("startDate", { required: "Required" })}
                />
                {errors.startDate && (
                  <p className="text-red-600">{errors.startDate.message}</p>
                )}
              </div>
              <div className="flex flex-col gap-6">
                <Label htmlFor="endDate">End Date</Label>
                <Input
                  id="endDate"
                  type="date"
                  {...register("endDate", { required: "Required" })}
                />
                {errors.endDate && (
                  <p className="text-red-600">{errors.endDate.message}</p>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-6">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                {...register("description")}
                rows={4}
              />
            </div>

            <div className="flex flex-col gap-6">
              <div className="flex justify-between items-center mb-2">
                <Label>Members</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    append({ name: "", isAdmin: false, userId: "" })
                  }
                >
                  + Add Member
                </Button>
              </div>

              {fields.map((field, idx) => (
                <div key={field.id} className="mb-4">
                  <div className="flex gap-3 items-center">
                    <div className="flex-1 relative">
                      <Controller
                        name={`members.${idx}.name`}
                        control={control}
                        rules={{ required: "Name required" }}
                        render={({ field: { value, onChange } }) => (
                          <>
                            <Input
                              placeholder="Search name..."
                              value={value}
                              onChange={(e) => {
                                onChange(e.target.value);
                                debouncedSearch(e.target.value, idx);
                              }}
                            />
                            {searchResults[idx]?.length > 0 && (
                              <ul className="absolute z-10 w-full rounded-md divide-y mt-6 space-y-4 ">
                                {searchResults[idx].map((u) => (
                                  <li
                                    key={u.id}
                                    onClick={() => {
                                      setValue(`members.${idx}.name`, u.name, {
                                        shouldValidate: true,
                                      });
                                      setValue(`members.${idx}.userId`, u.id);
                                      setValue(`members.${idx}.id`, u.id);

                                      setSearchResults((p) => ({
                                        ...p,
                                        [idx]: [],
                                      }));
                                    }}
                                    className="p-4 cursor-pointer bg-background rounded-md border-2 border-accent-foreground hover:bg-muted hover:border-accent/80 "
                                  >
                                    {u.name} ({u.email})
                                  </li>
                                ))}
                              </ul>
                            )}
                          </>
                        )}
                      />
                      {errors.members?.[idx]?.name && (
                        <p className="text-red-600 text-sm mt-1">
                          {errors.members[idx].name.message}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center px-2">
                      <Controller
                        name={`members.${idx}.isAdmin`}
                        control={control}
                        defaultValue={false}
                        render={({ field }) => (
                          <Checkbox
                            id={`admin-${idx}`}
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            className="mr-1"
                          />
                        )}
                      />
                      <Label htmlFor={`admin-${idx}`}>Admin</Label>
                    </div>
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      onClick={() => remove(idx)}
                      disabled={initialData?.creatorId === field.userId}
                    >
                      –
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <DialogFooter className="mt-6">
            <Button type="submit" disabled={tripsLoading}>
              {tripsLoading ? "Saving..." : "Save Changes"}
            </Button>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

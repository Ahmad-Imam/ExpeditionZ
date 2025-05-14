"use client";
import { createTripAction, searchUsersByName } from "@/actions/trip";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import useDebounce from "@/hooks/useDebounce";
import useFetch from "@/hooks/useFetch";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";

export default function AddTripForm() {
  const router = useRouter();
  const {
    register,
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      tripName: "",
      destination: "",
      startDate: "",
      endDate: "",
      description: "",
      members: [{ name: "", email: "", isAdmin: false, userId: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "members",
  });

  const {
    fn: createTripFn,
    loading: createTripLoading,
    error: tripError,
    data: createTripData,
  } = useFetch(createTripAction);

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

  const onSubmit = async (vals) => {
    const payload = {
      name: vals.tripName,
      destination: vals.destination,
      startDate: vals.startDate,
      endDate: vals.endDate,
      description: vals.description,
      members: vals.members
        .filter((m) => m.name.trim())
        .map((m, i) => ({
          name: m.name,
          id: m.id,
          isAdmin: m.isAdmin,
          userId: m.userId,
        })),
      expenses: [],
      checklist: [],
      timeline: [],
      locations: [],
      polls: [],
    };

    await createTripFn(payload);
  };

  useEffect(() => {
    if (createTripData && !createTripLoading) {
      toast.success("Trip created successfully!");
      router.push("/trips/" + createTripData?.id);
    }
  }, [createTripData, createTripLoading]);

  return (
    <Card className="space-y-4 w-xl md:w-3xl lg:w-5xl xl:w-7xl mx-auto mt-10 px-4">
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardHeader>
          <CardTitle>Create New Trip</CardTitle>
          <CardDescription>Fill in trip details below.</CardDescription>
        </CardHeader>

        <CardContent className="space-y-6 pt-6">
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
            <Textarea id="description" {...register("description")} rows={4} />
          </div>

          <div className="flex flex-col gap-6">
            <div className="flex justify-between items-center mb-2">
              <Label className={"text-md"}>Members</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => append({ name: "", email: "" })}
              >
                <Plus size={16} className="mr-2" />
                Add Member
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
                                    setValue(`members.${idx}.email`, u.email);

                                    setSearchResults((p) => ({
                                      ...p,
                                      [idx]: [],
                                    }));
                                  }}
                                  className="p-4 cursor-pointer bg-accent rounded-md border-2 border-accent-foreground "
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

                  <div className="flex-1">
                    <Input
                      placeholder="Email"
                      readOnly
                      className="bg-gray-100 cursor-not-allowed"
                      {...register(`members.${idx}.email`)}
                    />
                    {errors.members?.[idx]?.email && (
                      <p className="text-red-600 text-sm mt-1">
                        {errors.members[idx].email.message}
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
                  >
                    –
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>

        <CardFooter className={"flex justify-end py-6"}>
          <Button type="submit" disabled={createTripLoading}>
            {createTripLoading ? "Creating..." : "Create Trip"}
          </Button>
          {tripError && (
            <p className="text-red-600 ml-4">Failed to create trip.</p>
          )}
        </CardFooter>
      </form>
    </Card>
  );
}

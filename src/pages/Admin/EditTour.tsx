import MultipleImageUploader from "@/components/MultipleImageUploader";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { useGetDivisionsQuery } from "@/redux/features/division/division.api";
import {
  useGetAllTourQuery,
  useGetTourTypesQuery,
  useUpdateTourMutation,
} from "@/redux/features/Tour/tour.api";
import { zodResolver } from "@hookform/resolvers/zod";
import { format, formatISO } from "date-fns";
import { CalendarIcon, Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { useParams } from "react-router";
import { toast } from "sonner";
import z from "zod";

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  location: z.string().min(1, "Location is required"),
  costFrom: z.string().min(1, "Cost is required"),
  startDate: z.date({ message: "Start date is required" }),
  endDate: z.date({ message: "End date is required" }),
  departureLocation: z.string().min(1, "Departure location is required"),
  arrivalLocation: z.string().min(1, "Arrival location is required"),
  included: z.array(z.object({ value: z.string() })),
  excluded: z.array(z.object({ value: z.string() })),
  amenities: z.array(z.object({ value: z.string() })),
  tourPlan: z.array(z.object({ value: z.string() })),
  maxGuest: z.string().min(1, "Max guest is required"),
  minAge: z.string().min(1, "Minimum age is required"),
  division: z.string().min(1, "Division is required"),
  tourType: z.string().min(1, "Tour type is required"),
});

export default function EditTour() {
  const { id } = useParams();
  const [images, setImages] = useState<File[] | []>([]);
  const [deleteImages, setDeleteImages] = useState<string[]>([]);

  console.log(id);

  const { data: tourData, isLoading: tourLoading } = useGetAllTourQuery({
    _id: id,
  });
  const { data: tourTypeData, isLoading: tourTypeLoading } =
    useGetTourTypesQuery({ limit: 1000 }, { skip: !id || tourLoading });
  const { data: divisionData, isLoading: divisionLoading } =
    useGetDivisionsQuery(undefined, { skip: !id || tourLoading });
  const [updateTour] = useUpdateTourMutation();

  const tour = tourData?.data?.[0];

  console.log(tour);

  const divisionOptions = divisionData?.data?.map(
    (item: { _id: string; name: string }) => ({
      value: item._id,
      label: item.name,
    }),
  );

  const tourTypeOptions = tourTypeData?.data?.map(
    (item: { _id: string; name: string }) => ({
      value: item._id,
      label: item.name,
    }),
  );

  console.log(tourTypeOptions, divisionOptions);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      location: "",
      division: "",
      tourType: "",
      description: "",
      startDate: undefined,
      endDate: undefined,
      included: [{ value: "" }],
      excluded: [{ value: "" }],
      amenities: [{ value: "" }],
      tourPlan: [{ value: "" }],
      departureLocation: "",
      arrivalLocation: "",
      costFrom: "",
      maxGuest: "",
      minAge: "",
    },
  });

  const { reset } = form;

  useEffect(() => {
    if (!tour || divisionLoading || tourTypeLoading) return;

    reset({
      title: tour.title,
      description: tour.description,
      location: tour.location,
      costFrom: String(tour.costFrom),
      startDate: new Date(tour.startDate),
      endDate: new Date(tour.endDate),
      departureLocation: tour.departureLocation,
      arrivalLocation: tour.arrivalLocation,
      included: tour.included?.map((value: string) => ({ value })) ?? [
        { value: "" },
      ],
      excluded: tour.excluded?.map((value: string) => ({ value })) ?? [
        { value: "" },
      ],
      amenities: tour.amenities?.map((value: string) => ({ value })) ?? [
        { value: "" },
      ],
      tourPlan: tour.tourPlan?.map((value: string) => ({ value })) ?? [
        { value: "" },
      ],
      maxGuest: String(tour.maxGuest),
      minAge: String(tour.minAge),
      division: tour.division ?? "",
      tourType: tour.tourType ?? "",
    });
  }, [tour, divisionLoading, tourTypeLoading, reset]);

  useEffect(() => {
    if (!tour) return;
    if (!divisionOptions || !tourTypeOptions) return;

    const currentDivision = form.getValues("division");
    const currentTourType = form.getValues("tourType");

    if (currentDivision !== tour.division) {
      form.setValue("division", tour.division);
    }

    if (currentTourType !== tour.tourType) {
      form.setValue("tourType", tour.tourType);
    }
  }, [tour, divisionOptions, tourTypeOptions, form]);

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "included",
  });

  const {
    fields: amenitiesFields,
    append: amenitiesAppend,
    remove: amenitiesRemove,
  } = useFieldArray({
    control: form.control,
    name: "amenities",
  });

  const {
    fields: tourPlanFields,
    append: tourPlanAppend,
    remove: tourPlanRemove,
  } = useFieldArray({
    control: form.control,
    name: "tourPlan",
  });

  const {
    fields: excludedFields,
    append: excludedAppend,
    remove: excludedRemove,
  } = useFieldArray({
    control: form.control,
    name: "excluded",
  });

  const handleSubmit = async (data: z.infer<typeof formSchema>) => {
    const toastId = toast.loading("Updating tour...");

    const tourData = {
      ...data,
      costFrom: Number(data.costFrom),
      maxGuest: Number(data.maxGuest),
      minAge: Number(data.minAge),
      startDate: formatISO(data.startDate),
      endDate: formatISO(data.endDate),
      included: data.included.map((item: { value: string }) => item.value),
      excluded: data.excluded.map((item: { value: string }) => item.value),
      amenities: data.amenities.map((item: { value: string }) => item.value),
      tourPlan: data.tourPlan.map((item: { value: string }) => item.value),
      deleteImages,
    };

    console.log(tourData);

    const formData = new FormData();
    formData.append("data", JSON.stringify(tourData));
    images.forEach((image) => formData.append("files", image));

    try {
      if (!id) return;
      const res = await updateTour({
        id,
        tourData: formData as FormData,
      }).unwrap();
      if (res.success) {
        toast.success("Tour has been updated!", { id: toastId });
        setDeleteImages([]);
        setImages([]);
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="w-full max-w-4xl mx-auto px-5 my-16">
      <Card>
        <CardHeader>
          <CardTitle>Update Tour</CardTitle>
          <CardDescription>Update a tour from your system</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              id="update-tour-form"
              className="space-y-5"
              onSubmit={form.handleSubmit(handleSubmit)}
            >
              {/* Title */}
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tour Title</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Title */}

              {/* Location and CostFrom */}
              <div className="flex gap-5">
                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Location</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="costFrom"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Per person Cost</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              {/* Location and CostFrom */}

              {/* Departure and Arrival Location */}
              <div className="flex gap-5">
                <FormField
                  control={form.control}
                  name="departureLocation"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Departure Location</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="arrivalLocation"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Arrival Location</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              {/* Departure and Arrival Location */}

              {/* CostFrom, MinAge and MinGuest */}
              <div className="flex gap-5">
                <FormField
                  control={form.control}
                  name="minAge"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Minimum Age</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="maxGuest"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Maximum Guest</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              {/* CostFrom, MinAge and MinGuest */}

              {/* Division and Tour Types */}
              <div className="flex gap-5">
                {/* Division */}
                <FormField
                  control={form.control}
                  name="division"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Division</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value ?? ""}
                        disabled={divisionLoading}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select a division" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {divisionOptions?.map(
                            (item: { label: string; value: string }) => (
                              <SelectItem key={item.value} value={item.value}>
                                {item.label}
                              </SelectItem>
                            ),
                          )}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* Division */}

                {/* Tour Types */}
                <FormField
                  control={form.control}
                  name="tourType"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Tour Types</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value ?? ""}
                        disabled={tourTypeLoading}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select a Tour Type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {tourTypeOptions?.map(
                            (item: { label: string; value: string }) => (
                              <SelectItem key={item.value} value={item.value}>
                                {item.label}
                              </SelectItem>
                            ),
                          )}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* Tour Types */}
              </div>
              {/* Division and Tour Types */}

              {/* Date */}
              <div className="flex gap-5">
                {/* Start Date */}
                <FormField
                  control={form.control}
                  name="startDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col flex-1">
                      <FormLabel>Start Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground",
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={
                              field.value ? new Date(field.value) : undefined
                            }
                            onSelect={field.onChange}
                            disabled={(date) =>
                              date <
                              new Date(
                                new Date().setDate(new Date().getDate() - 1),
                              )
                            }
                            captionLayout="dropdown"
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* Start Date */}

                {/* End Date */}
                <FormField
                  control={form.control}
                  name="endDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col flex-1">
                      <FormLabel>End Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground",
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={
                              field.value ? new Date(field.value) : undefined
                            }
                            onSelect={field.onChange}
                            disabled={(date) =>
                              date <
                              new Date(
                                new Date().setDate(new Date().getDate() - 1),
                              )
                            }
                            captionLayout="dropdown"
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* End Date */}
              </div>
              {/* Date */}

              {/* Description */}
              <div className="flex gap-5 items-stretch">
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea {...field} className="h-51.25" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex-1 mt-5">
                  <MultipleImageUploader onChange={setImages} />
                </div>
              </div>
              {/* Description */}

              {/* Tour Images */}
              <div>
                <FormLabel>Current Images</FormLabel>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 mt-4">
                  {tour?.images?.map((image: string, index: number) => {
                    const isDeleted = deleteImages.includes(image);

                    return (
                      <div
                        key={index}
                        className={cn(
                          "relative group rounded-lg overflow-hidden",
                          isDeleted && "opacity-50 border-2 border-red-500",
                        )}
                      >
                        <img
                          src={image}
                          alt={`${tour?.title} ${index + 1}`}
                          className="w-full h-48 object-cover"
                        />

                        {/* Overlay when selected */}
                        {isDeleted && (
                          <div className="absolute inset-0 bg-red-500/40 flex items-center justify-center">
                            <span className="text-white font-semibold text-sm">
                              Marked for deletion
                            </span>
                          </div>
                        )}

                        {/* Delete / Undo Button */}
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => {
                            setDeleteImages(
                              (prev) =>
                                prev.includes(image)
                                  ? prev.filter((img) => img !== image) // undo
                                  : [...prev, image], // mark delete
                            );
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    );
                  })}
                </div>
              </div>
              {/* Tour Images */}

              {/* Separator */}
              <div className="border-t border-muted w-full"></div>
              {/* Separator */}

              {/* Included */}
              <div>
                <div className="flex justify-between">
                  <p className="font-semibold">Included</p>
                  <Button
                    size={"icon"}
                    type="button"
                    variant={"outline"}
                    onClick={() => append({ value: "" })}
                  >
                    <Plus />
                  </Button>
                </div>
                <div className="space-y-4 mt-4">
                  {fields.map((item, index) => (
                    <div key={item.id} className="flex gap-2">
                      <FormField
                        control={form.control}
                        name={`included.${index}.value`}
                        key={item.id}
                        render={({ field }) => (
                          <FormItem className="flex-1">
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button
                        onClick={() => remove(index)}
                        variant={"destructive"}
                        size={"icon"}
                        type="button"
                      >
                        <Trash2 />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
              {/* Included */}

              {/* Excluded */}
              <div>
                <div className="flex justify-between">
                  <p className="font-semibold">Excluded</p>
                  <Button
                    size={"icon"}
                    type="button"
                    variant={"outline"}
                    onClick={() => excludedAppend({ value: "" })}
                  >
                    <Plus />
                  </Button>
                </div>
                <div className="space-y-4 mt-4">
                  {excludedFields.map((item, index) => (
                    <div key={index} className="flex gap-2">
                      <FormField
                        control={form.control}
                        name={`excluded.${index}.value`}
                        key={item.id}
                        render={({ field }) => (
                          <FormItem className="flex-1">
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button
                        onClick={() => excludedRemove(index)}
                        variant={"destructive"}
                        size={"icon"}
                        type="button"
                      >
                        <Trash2 />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
              {/* Excluded */}

              {/* Amenities */}
              <div>
                <div className="flex justify-between">
                  <p className="font-semibold">Amenities</p>
                  <Button
                    size={"icon"}
                    type="button"
                    variant={"outline"}
                    onClick={() => amenitiesAppend({ value: "" })}
                  >
                    <Plus />
                  </Button>
                </div>
                <div className="space-y-4 mt-4">
                  {amenitiesFields.map((item, index) => (
                    <div key={index} className="flex gap-2">
                      <FormField
                        control={form.control}
                        name={`amenities.${index}.value`}
                        key={item.id}
                        render={({ field }) => (
                          <FormItem className="flex-1">
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button
                        onClick={() => amenitiesRemove(index)}
                        variant={"destructive"}
                        size={"icon"}
                        type="button"
                      >
                        <Trash2 />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
              {/* Amenities */}

              {/* Tour Plan */}
              <div>
                <div className="flex justify-between">
                  <p className="font-semibold">Tour Plan</p>
                  <Button
                    size={"icon"}
                    type="button"
                    variant={"outline"}
                    onClick={() => tourPlanAppend({ value: "" })}
                  >
                    <Plus />
                  </Button>
                </div>
                <div className="space-y-4 mt-4">
                  {tourPlanFields.map((item, index) => (
                    <div key={index} className="flex gap-2">
                      <FormField
                        control={form.control}
                        name={`tourPlan.${index}.value`}
                        key={item.id}
                        render={({ field }) => (
                          <FormItem className="flex-1">
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button
                        onClick={() => tourPlanRemove(index)}
                        variant={"destructive"}
                        size={"icon"}
                        type="button"
                      >
                        <Trash2 />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
              {/* Tour Plan */}
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button form="update-tour-form" type="submit">
            Update Tour
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

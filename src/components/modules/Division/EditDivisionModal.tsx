/* eslint-disable @typescript-eslint/no-explicit-any */
import SingleImageUploader from "@/components/SingleImageUploader";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  useGetDivisionsQuery,
  useUpdateDivisionMutation,
} from "@/redux/features/division/division.api";
import { Edit2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export function EditDivisionModal({ id }: { id: string }) {
  const [open, setOpen] = useState(false);
  const [image, setImage] = useState<File | null>(null);
  const [updateDivision, { isLoading }] = useUpdateDivisionMutation();
  const { data } = useGetDivisionsQuery({ _id: id });


  const form = useForm({
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const { reset } = form;

  useEffect(() => {
    const division = data?.data?.[0];

    if (division) {
      reset({
        name: division.name,
        description: division.description,
      });
    }
    
  }, [data, reset])

  const onSubmit = async (data: any) => {
    try {
      const formData = new FormData();

      formData.append("data", JSON.stringify({ ...data, _id: id }));
      
      if (image) {
        formData.append("file", image as File);
      }

      const res = await updateDivision({
        divisionData: formData as any,
        id,
      }).unwrap();

      if (res.success) {
        toast.success("Division added successfully!");
        setOpen(false);
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong!");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size={"sm"}>
          <Edit2 />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Update Division</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            className="space-y-4"
            id="update-division"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Division Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Division name here" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Division description</FormLabel>
                  <FormControl>
                    <Textarea
                      className="h-50"
                      placeholder="Division description here"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
          <SingleImageUploader onChange={setImage} />
        </Form>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button
            form="update-division"
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? "Uploading..." : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

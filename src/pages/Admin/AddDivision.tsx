import { DeleteConfirmation } from "@/components/DeleteConfirmation";
import ImagePreview from "@/components/ImagePreview";
import { AddDivisionModal } from "@/components/modules/Division/AddDivisionModal";
import { EditDivisionModal } from "@/components/modules/Division/EditDivisionModal";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  useDeleteDivisionMutation,
  useGetDivisionsQuery,
} from "@/redux/features/division/division.api";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

interface IDivision {
  _id: string;
  name: string;
  thumbnail: string;
}

export default function AddDivision() {
  const { data } = useGetDivisionsQuery(undefined);
  const [removeDivision] = useDeleteDivisionMutation();

  const handleRemoveTourType = async (divisionId: string) => {
    try {
      const res = await removeDivision(divisionId).unwrap();

      if (res.success) {
        toast.success("Division removed successfully!");
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong, could not delete the division!");
    }
  };
  return (
    <div>
      <div className="w-full max-w-7xl mx-auto px-5">
        <div className="flex justify-between my-8">
          <h1 className="text-xl font-semibold">All Divisions</h1>
          <AddDivisionModal />
        </div>
        <div className="border border-muted rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-25">Name</TableHead>
                <TableHead className="w-25">Picture</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.data?.map((item: IDivision) => (
                <TableRow key={item.name}>
                  <TableCell className="w-[50%]">{item?.name}</TableCell>
                  <TableCell className="w-full">
                    <ImagePreview src={item?.thumbnail} />
                  </TableCell>
                  <TableCell>
                    <EditDivisionModal id={item._id} />

                    <DeleteConfirmation
                      onConfirm={() => handleRemoveTourType(item._id)}
                    >
                      <Button size={"sm"}>
                        <Trash2 />
                      </Button>
                    </DeleteConfirmation>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}

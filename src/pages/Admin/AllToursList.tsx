import { DeleteConfirmation } from "@/components/DeleteConfirmation";
import TourFilters from "@/components/modules/Tour/TourFilters";
import PaginationComponent from "@/components/PaginationComponent";
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
  useDeleteTourMutation,
  useGetAllTourQuery,
} from "@/redux/features/Tour/tour.api";
import { Edit2, Info, Trash2 } from "lucide-react";
import { useState } from "react";
import { Link, useSearchParams } from "react-router";
import { toast } from "sonner";

export default function AllToursList() {
  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(10);

  const [searchParams] = useSearchParams();

  const division = searchParams.get("division") || undefined;
  const tourType = searchParams.get("tourType") || undefined;

  const { data } = useGetAllTourQuery({
    division,
    tourType,
    page: currentPage,
    limit,
  });
  const [deleteTour] = useDeleteTourMutation();

  const allTours = data?.data;

  const totalPage = data?.meta?.totalPage || 1;

  const handleRemoveTour = async (id: string) => {
    const toastId = toast.loading("Deleting tour...");

    try {
      const res = await deleteTour(id).unwrap();

      if (res.success) {
        toast.success("Tour removed successfully!", { id: toastId });
      } else {
        toast.error("Failed to delete tour", { id: toastId });
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong!", { id: toastId });
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="text-xl font-semibold">All Tours</h1>
      </div>
      {/* Header */}
      <div className="w-full mx-auto px-5 flex justify-between gap-10">
        {/* Left Side */}
        <div className="flex-1 max-w-xs">
          <TourFilters />
        </div>
        {/* Left Side */}

        {/* Right Side */}
        <div className="flex-1">
          {/* Tour Table */}
          <div className="border border-muted rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-25">Name</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {allTours?.map((item) => (
                  <TableRow key={item._id}>
                    <TableCell className="w-full">{item?.title}</TableCell>
                    <TableCell className="text-right">
                      <DeleteConfirmation
                        onConfirm={() => handleRemoveTour(item._id)}
                      >
                        <Button size={"sm"}>
                          <Trash2 />
                        </Button>
                      </DeleteConfirmation>
                      <Link to={`/tours/${item._id}`}>
                        <Button size={"sm"}>
                          <Info />
                        </Button>
                      </Link>
                      <Link to={`/admin/edit-tour/${item._id}`}>
                        <Button size={"sm"}>
                          <Edit2 />
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          {/* Tour Table */}

          {/* <Pagination */}
          <PaginationComponent
            currentPage={currentPage}
            totalPage={totalPage}
            setCurrentPage={(page) => setCurrentPage(page)}
          />
          {/* Pagination */}
        </div>
        {/* Right Side */}
      </div>
    </div>
  );
}

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Spinner } from "@/components/ui/spinner";
import { useUserInfoQuery } from "@/redux/features/auth/auth.api";
import { useCreateBookingMutation } from "@/redux/features/booking/booking.api";
import { useGetAllTourQuery } from "@/redux/features/Tour/tour.api";
import type { ICreateBooking, ITourPackage } from "@/types";
import { useState } from "react";
import { Link, useLocation, useParams } from "react-router";
import { toast } from "sonner";

export default function Booking() {
  const [guestCount, setGuestCount] = useState(1);
  const [openDialog, setOpenDialog] = useState(false);

  const { id } = useParams();
  const location = useLocation();

  const { data, isLoading, isError } = useGetAllTourQuery({ _id: id });
  const { data: userData } = useUserInfoQuery(undefined);
  const [createBooking] = useCreateBookingMutation(undefined);

  const user = userData?.data?.data;
  const tourData = data?.data?.[0] as ITourPackage;

  const totalAmount = guestCount * (tourData?.costFrom || 0);

  const incrementGuest = () => {
    setGuestCount((prv) => prv + 1);
  };

  const decrementGuest = () => {
    setGuestCount((prv) => prv - 1);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center gap-4 min-h-screen">
        <Button disabled size="sm">
          <Spinner data-icon="inline-start" />
          Loading...
        </Button>
      </div>
    );
  }

  const handleBooking = async () => {
    if (!user.phone && !user.address) {
      setOpenDialog(true);
      return;
    }
    
    if (!data || !id) return;

    const bookingData: ICreateBooking = {
      tour: id,
      guestCount,
    }

    try {
      const res = await createBooking(bookingData).unwrap();

      if (res.success) {
        window.open(res.data.paymentUrl, "_blank");
        toast.success("Booking created successfully!");
      }
      console.log(res)
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong!");
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-8 p-6 container mx-auto">
      {!isLoading && isError && (
        <div>
          <p>Something went wrong!</p>
        </div>
      )}
      {!isLoading && data?.data?.length === 0 && (
        <div>
          <p>No data found!</p>
        </div>
      )}
      {!isLoading && !isError && data!.data!.length > 0 && (
        <>
          {/* Left Section - Tour Summary */}
          <div className="flex-1 space-y-6">
            <div>
              <img
                src={tourData?.images[0]}
                alt={tourData?.title}
                className="w-full h-64 object-cover rounded-lg"
              />
            </div>

            <div>
              <h1 className="text-3xl font-bold mb-2">{tourData?.title}</h1>
              <p className="text-gray-600 mb-4">{tourData?.description}</p>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <strong>Location:</strong> {tourData?.location}
                </div>
                <div>
                  <strong>Duration:</strong> {tourData?.startDate} to{" "}
                  {tourData?.endDate}
                </div>
                <div>
                  <strong>Tour Type:</strong> {tourData?.tourType}
                </div>
                <div>
                  <strong>Max Guests:</strong> {tourData?.maxGuest}
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-2">What's Included</h3>
              <ul className="list-disc list-inside text-sm space-y-1">
                {tourData?.included.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-2">Tour Plan</h3>
              <ol className="list-decimal list-inside text-sm space-y-1">
                {tourData?.tourPlan.map((plan, index) => (
                  <li key={index}>{plan}</li>
                ))}
              </ol>
            </div>
          </div>
          {/* Left Section - Tour Summary */}

          {/* Right Section - Booking Details */}
          <div className="w-full md:w-96">
            <div className="border border-muted p-6 rounded-lg shadow-md sticky top-6">
              <h2 className="text-2xl font-bold mb-6">Booking Details</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Number of Guests
                  </label>
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={decrementGuest}
                      disabled={guestCount <= 1}
                      className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center disabled:opacity-50"
                    >
                      -
                    </button>
                    <span className="text-lg font-medium w-8 text-center">
                      {guestCount}
                    </span>
                    <button
                      onClick={incrementGuest}
                      disabled={guestCount >= tourData!.maxGuest}
                      className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center disabled:opacity-50"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span>Price per person:</span>
                    <span>৳{tourData?.costFrom}</span>
                  </div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Guests:</span>
                    <span>{guestCount}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total Amount:</span>
                    <span>৳{totalAmount}</span>
                  </div>
                </div>

                <Button onClick={handleBooking} className="w-full" size="lg">
                  Book Now
                </Button>
              </div>
            </div>
          </div>
          {/* Right Section - Booking Details */}
        </>
      )}
      {/* Dialog for the profile here */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Complete Your Profile</DialogTitle>
            <DialogDescription>
              You need to add your phone number and address before booking a
              tour.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="flex gap-2">
            <Button variant="outline" onClick={() => setOpenDialog(false)}>
              Cancel
            </Button>

            <Button asChild>
              <Link to="/me" state={{ from: location.pathname }}>
                Go to Profile
              </Link>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

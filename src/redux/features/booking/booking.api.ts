import { baseApi } from "@/redux/baseApi";
import type { IBooking, ICreateBooking, IResponse } from "@/types";

export const bookingApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createBooking: builder.mutation<IResponse<IBooking>, ICreateBooking>({
      query: (bookingData) => ({
        url: "/booking",
        method: "POST",
        data: bookingData,
      }),
      invalidatesTags: ["BOOKING"],
    }),
  }),
});

export const { useCreateBookingMutation } = bookingApi;

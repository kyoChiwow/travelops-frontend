import { baseApi } from "@/redux/baseApi";
import type { IMeta, IResponse } from "@/types";
import type { ITourPackage } from "@/types/tour.type";

export const tourApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    addTourType: builder.mutation<IResponse<null>, string>({
      query: (tourTypeName) => ({
        url: "/tour/create-tour-type",
        method: "POST",
        data: tourTypeName,
      }),
      invalidatesTags: ["TOUR-TYPE"],
    }),
    getTourTypes: builder.query({
      query: () => ({
        url: "/tour/all-tour-types",
        method: "GET",
      }),
      providesTags: ["TOUR-TYPE"],
      transformResponse: (response) => response.data,
    }),
    removeTourType: builder.mutation({
      query: (tourTypeId) => ({
        url: `/tour/tour-type/${tourTypeId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["TOUR-TYPE"],
    }),
    addTour: builder.mutation<IResponse<ITourPackage>, FormData>({
      query: (tourData) => ({
        url: "/tour/create",
        method: "POST",
        data: tourData,
      }),
      invalidatesTags: ["TOUR"],
    }),
    getAllTour: builder.query<{ data: ITourPackage[]; meta: IMeta }, unknown>({
      query: (params) => ({
        url: "/tour",
        method: "GET",
        params,
      }),
      providesTags: ["TOUR"],
      transformResponse: (
        response: IResponse<{ data: ITourPackage[]; meta: IMeta }>,
      ) => response.data,
    }),
  }),
});

export const {
  useAddTourTypeMutation,
  useGetTourTypesQuery,
  useRemoveTourTypeMutation,
  useAddTourMutation,
  useGetAllTourQuery,
} = tourApi;

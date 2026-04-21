import { baseApi } from "@/redux/baseApi";
import type { IMeta, IResponse } from "@/types";
import type { ITourPackage } from "@/types/tour.type";

export const tourApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    addTourType: builder.mutation<IResponse<null>, { name: string }>({
      query: (tourTypeName) => ({
        url: "/tour/create-tour-type",
        method: "POST",
        data: tourTypeName,
      }),
      invalidatesTags: ["TOUR-TYPE"],
    }),
    getTourTypes: builder.query({
      query: (params) => ({
        url: "/tour/all-tour-types",
        method: "GET",
        params,
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
    getSingleTour: builder.query<IResponse<ITourPackage>, string>({
      query: (slug) => ({
        url: `/tour/${slug}`,
        method: "GET",
      }),
      providesTags: ["TOUR"],
    }),
    updateTour: builder.mutation<
      IResponse<ITourPackage>,
      { id: string; tourData: FormData }
    >({
      query: ({ id, tourData }) => ({
        url: `/tour/${id}`,
        method: "PATCH",
        data: tourData,
      }),
      invalidatesTags: ["TOUR"],
    }),
    deleteTour: builder.mutation<IResponse<null>, { id: string }>({
      query: (params) => ({
        url: "/tour",
        method: "DELETE",
        params,
      }),
      invalidatesTags: ["TOUR"],
    }),
  }),
});

export const {
  useAddTourTypeMutation,
  useGetTourTypesQuery,
  useRemoveTourTypeMutation,
  useAddTourMutation,
  useGetAllTourQuery,
  useUpdateTourMutation,
  useDeleteTourMutation,
  useGetSingleTourQuery,
} = tourApi;

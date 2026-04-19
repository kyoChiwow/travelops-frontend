import { baseApi } from "@/redux/baseApi";
import type { IDivision, IResponse } from "@/types";

export const divisionApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    addDivision: builder.mutation({
      query: (divisionData) => ({
        url: "/division/create",
        method: "POST",
        data: divisionData,
      }),
      invalidatesTags: ["DIVISION"],
    }),
    updateDivision: builder.mutation<
      IResponse<IDivision>,
      { divisionData: Partial<IDivision>; id: string }
    >({
      query: ({ divisionData, id }) => ({
        url: `/division/${id}`,
        method: "PATCH",
        data: divisionData,
      }),
      invalidatesTags: ["DIVISION"],
    }),
    deleteDivision: builder.mutation({
      query: (divisionId) => ({
        url: `/division/${divisionId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["DIVISION"],
    }),
    getDivisions: builder.query({
      query: (params) => ({
        url: "/division",
        method: "GET",
        params,
      }),
      providesTags: ["DIVISION"],
    }),
  }),
});

export const {
  useAddDivisionMutation,
  useUpdateDivisionMutation,
  useGetDivisionsQuery,
  useDeleteDivisionMutation,
} = divisionApi;

import { baseApi } from "@/redux/baseApi";
import type { ILogin, ILoginData, IResponse } from "@/types";

export const tourApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    addTourType: builder.mutation<IResponse<ILoginData>, ILogin>({
      query: (tourTypeName) => ({
        url: "/tour/create-tour-type",
        method: "POST",
        data: tourTypeName,
      }),
    }),
    getTourTypes: builder.query({
      query: () => ({
        url: "/tour/all-tour-types",
        method: "GET",
      }),
      transformResponse: (response) => response.data,
    }),
  }),
});

export const { useAddTourTypeMutation, useGetTourTypesQuery } = tourApi;

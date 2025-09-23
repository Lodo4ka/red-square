import { emptySplitApi } from "@/shared/api/base";

const roundApi = emptySplitApi.injectEndpoints({
  endpoints: (builder) => ({
    getRounds: builder.query<Round[], void>({
      query: () => 'game/all',
    }),
  }),
})

export const { useGetRoundsQuery } = roundApi;

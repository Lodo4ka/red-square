import { emptySplitApi } from "@/shared/api/base";
import type { Round } from "../type";

const roundApi = emptySplitApi.injectEndpoints({
  endpoints: (builder) => ({
    getRounds: builder.query<Round[], void>({
      query: () => 'game/rounds',
    }),
    createRound: builder.mutation<number, { adminId: number }>({
      query: (body) => ({ url: 'game/rounds', method: 'POST', body }),
      transformResponse: (response: unknown) => (response as Round).id,
    }),
  }),
})

export const { useGetRoundsQuery, useCreateRoundMutation } = roundApi;

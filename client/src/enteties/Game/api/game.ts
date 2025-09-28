import type { Round, RoundPlayer } from '@/enteties/Round/type';
import { emptySplitApi } from '../../../shared/api/base';

const gameApi = emptySplitApi.injectEndpoints({
  endpoints: (builder) => ({
    getRound: builder.query<Round, string>({
      query: (id) => `game/rounds/${id}`,
    }),
    updateRound: builder.mutation<RoundPlayer, { id: string, userId: number }>({
      query: ({ id, userId }) => ({ url: `game/rounds/${id}`, method: 'POST', body: { userId } }),
    }),
    getRounds: builder.query<Round[], void>({
      query: () => 'game/rounds',
    }),
    createRound: builder.mutation<number, { adminId: number }>({
      query: (body) => ({ url: 'game/rounds', method: 'POST', body }),
      transformResponse: (response: Round) => response.id,
    }),
    joinRound: builder.mutation<Round, { roundId: number }>({
      query: (body) => ({ url: 'game/join', method: 'POST', body }),
    }),
  })
})

export const { useGetRoundQuery, useUpdateRoundMutation, useGetRoundsQuery, useCreateRoundMutation, useJoinRoundMutation } = gameApi;

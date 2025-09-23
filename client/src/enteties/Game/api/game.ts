import type { Round } from '@/enteties/Round/type';
import { emptySplitApi } from '../../../shared/api/base';

const gameApi = emptySplitApi.injectEndpoints({
  endpoints: (builder) => ({
    getRound: builder.query<Round, string>({
      query: (id) => `game/rounds/${id}`,
    }),
    updateRound: builder.mutation<void, { id: string, userId: number }>({
      query: ({ id, userId }) => ({ url: `game/rounds/${id}`, method: 'POST', body: { userId } }),
    }),
  })
})

export const { useGetRoundQuery, useUpdateRoundMutation } = gameApi;

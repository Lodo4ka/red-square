import type { Round } from '@/enteties/Round/type';
import { emptySplitApi } from '../../../shared/api/base';

const gameApi = emptySplitApi.injectEndpoints({
  endpoints: (builder) => ({
    getRound: builder.query<Round, string>({
      query: (id) => `game/rounds/${id}`,
    }),
  })
})

export const { useGetRoundQuery } = gameApi;

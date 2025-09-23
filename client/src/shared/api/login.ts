import { ROUTES_NAME } from '../constants';
import { emptySplitApi } from './base';

const loginApi = emptySplitApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (body) => ({
        url: ROUTES_NAME.LOGIN,
        method: 'POST',
        body
      })
    }),
    logout: builder.mutation({
      query: () => ({
        url: ROUTES_NAME.LOGOUT,
        method: 'POST'
      })
    })
  })
})

export const { useLoginMutation } = loginApi

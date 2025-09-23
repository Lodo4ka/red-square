import { ROUTES_NAME } from '../../../shared/constants';
import { emptySplitApi } from '../../../shared/api/base';
import type { LoginResponse } from '../type';
import { setUser } from '../model';

const loginApi = emptySplitApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (body) => ({
        url: ROUTES_NAME.LOGIN,
        method: 'POST',
        body,
      }),
      transformResponse: (response: LoginResponse) => response,
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
          const { data } = await queryFulfilled;
          const user = {
            name: data.name,
            role: data.role,
          };
          dispatch(setUser(user));
      },
    }),
    getMe: builder.query<LoginResponse, void>({
      query: () => ({ url: ROUTES_NAME.ME, method: 'GET' }),
      transformResponse: (response: LoginResponse) => response,
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        const { data } = await queryFulfilled;
        const user = {
          name: data.name,
          role: data.role,
        };
        dispatch(setUser(user));
      },
    }),
    logout: builder.mutation({
      query: () => ({
        url: ROUTES_NAME.LOGOUT,
        method: 'POST'
      })
    })
  })
})

export const { useLoginMutation, useGetMeQuery } = loginApi

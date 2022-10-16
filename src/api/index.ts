import { createApi } from '@reduxjs/toolkit/dist/query/react';
import { baseQuery, CustomRequest } from '@/api/baseQuery';

export const api = createApi({
  reducerPath: 'api',
  baseQuery,
  endpoints: builder => ({
    getAccounts: builder.query<any, CustomRequest>({
      query: ({ queryParams }) => ({
        path: '/accounts',
        method: 'get',
        request: {
          queryParams,
        },
      }),
    }),
    getTransactions: builder.query<any, CustomRequest>({
      query: ({ queryParams }) => ({
        path: '/transactions',
        method: 'get',
        request: {
          queryParams,
        },
      }),
    }),
    // post: builder.mutation<any, CustomRequest>({
    //   query: ({ pathParams, queryParams, data }) => ({
    //     path: '/posts',
    //     method: 'post',
    //     request: {
    //       pathParams,
    //       queryParams,
    //       data,
    //     }
    //   }),
    // }),
  }),
});

export const { useLazyGetAccountsQuery, useLazyGetTransactionsQuery } = api;

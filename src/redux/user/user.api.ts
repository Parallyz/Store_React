import { User, UserDelete, Users } from "../../models/models";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import { URLs } from "../../models/path";

export interface UserQueryParams {
  skip?: number;
  limit?: number;
}

export const userApi = createApi({
  reducerPath: "user/api",
  baseQuery: fetchBaseQuery({
    baseUrl: URLs.users,
  }),
  refetchOnFocus: false,

  endpoints: (build) => ({
    getUsers: build.query<Users, UserQueryParams>({
      query: ({ skip = 0, limit = 30 }) => ({
        url: `users?limit=${limit}&skip=${skip}`,
      }),
    }),
    deleteUser: build.query<UserDelete, number>({
      query: (id) => ({
        url: `users/${id}`,
        method: "DELETE",
      }),
    }),
    searchUsers: build.query<Users, UserQueryParams & { search: string }>({
      query: ({ search, skip = 0, limit = 30 }) => ({
        url: `users/search?q=${search}&limit=${limit}&skip=${skip}`,
      }),
    }),
    addUser: build.mutation<User, Omit<User, "id">>({
      query: (user) => ({
        url: `users/add`,
        body: user,
        method: "POST",
      }),
    }),
  }),
});

export const {
  useLazyGetUsersQuery,
  useLazyDeleteUserQuery,
  useLazySearchUsersQuery,
  useAddUserMutation,
} = userApi;

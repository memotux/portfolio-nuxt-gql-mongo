import { userWithFriendsFragment } from "./fragments";

export const AllUsers = /* GraphQL */ `
{
  allUsers {
    ...UserWithFriends
  }
}
${userWithFriendsFragment}
`

export const GetMe = /* GraphQL */ `
{
  me {
    ...UserWithFriends
  }
}
${userWithFriendsFragment}
`
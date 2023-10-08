import { userWithFriendsFragment } from "./fragments";

export const AllUsers = /* GraphQL */ `
{
  allUsers {
    ...UserWithFriends
  }
}
${userWithFriendsFragment}
`
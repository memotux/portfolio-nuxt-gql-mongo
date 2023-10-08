import { userWithFriendsFragment } from "./fragments";

export const OnCreateUser = /* GraphQL */ `
   subscription {
     onCreateUser {
       ...UserWithFriends
     }
   }
   ${userWithFriendsFragment}
 `
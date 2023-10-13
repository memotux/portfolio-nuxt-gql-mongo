import { userWithFriendsFragment } from "./fragments";

export const OnCreateUser = /* GraphQL */ `
   subscription OnCreateUser($all: Boolean) {
     onCreateUser(all: $all) {
       ...UserWithFriends
     }
   }
   ${userWithFriendsFragment}
 `
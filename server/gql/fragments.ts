export const userWithFriendsFragment = /* GraphQL */ `
  fragment UserWithFriends on User {
    _id
    userName
    friends {
      userName
    }
  }
`
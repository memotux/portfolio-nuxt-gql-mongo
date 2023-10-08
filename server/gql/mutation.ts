import { userWithFriendsFragment } from "./fragments";

export const DeleteUser = /* GraphQL */ `
mutation DeleteUser($id: ID!) {
  deleteUser(id: $id) {
    ...UserWithFriends
  }
}
${userWithFriendsFragment}
`

export const CreateUser = /* GraphQL */ `
mutation CreateUser($userName: String!) {
  createUser(userName: $userName) {
    ...UserWithFriends
  }
}
${userWithFriendsFragment}
`

export const Login = /* GraphQL */ `
  mutation Login($userName: String!, $password: String!) {
    login(userName: $userName, password: $password) {
      value
    }
  }
`
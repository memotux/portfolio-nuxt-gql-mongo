export interface User {
  _id: string
  userName: string
  friends: Array<User>
}

export interface AllUsersResult {
  allUsers: Array<User>
}
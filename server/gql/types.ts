export interface User {
  _id: string
  userName: string
  friends: Array<User>
}

export interface AllUsersResult {
  allUsers: Array<User>
}

export interface OnCreateUserResult {
  onCreateUser: Array<User> | null
}
import { defineMongooseModel } from '#nuxt/mongoose'
import { Schema } from "mongoose";

export interface User {
  _id: string
  userName: string
  friends?: User[]
  createdAt: string
  updatedAt: string
}

export default defineMongooseModel<User>('User', {
  userName: { type: String, minLength: 3, required: true },
  friends: [{
    ref: 'User',
    type: Schema.Types.ObjectId
  }]
}, { timestamps: true })
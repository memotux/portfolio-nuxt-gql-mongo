import { defineMongooseModel } from '#nuxt/mongoose'

export interface Author {
  _id: string
  id?: number
  firstName: string
  lastName: string
  fullName?: string
  createdAt: string
  updatedAt: string
}

export default defineMongooseModel<Author>('Author', {
  id: Number,
  firstName: { type: String, minLength: 3, required: true },
  lastName: { type: String, minLength: 3, required: true }
}, { timestamps: true })
import { Schema, model } from "mongoose";

const author = new Schema({
  id: Number,
  firstName: { type: String, minLength: 3, required: true },
  lastName: { type: String, minLength: 3, required: true }
}, { timestamps: true })

export default model('Author', author)
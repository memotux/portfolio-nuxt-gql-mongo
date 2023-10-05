import { Schema, model } from "mongoose";

const author = new Schema({
  id: Number,
  firstName: { type: String, minLength: 3 },
  lastName: { type: String, minLength: 3 }
}, { _id: false, timestamps: true })

export default model('Author', author)
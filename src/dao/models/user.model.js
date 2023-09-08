import { Schema, Types, model } from "mongoose";

const roleType = {
  USER: "USER",
  ADMIN: "ADMIN",
  PUBLIC: "PUBLIC",
  BRONCE: "BRONCE",
  SILVER: "SILVER",
};

const collectionName = "Usuarios";


const userSchema = new Schema({
  first_name: String,
  last_name: String,
  email: {
    type: String,
    unique: true,
  },
  age: Number,
  password: String,
  cart: {
    type: Types.ObjectId,
    ref: "carts",    
  },
  role: {
    type: String,
    enum: Object.values(roleType),
    default: 'USER'
  }
});

const userModel = model(collectionName, userSchema);
export default userModel;

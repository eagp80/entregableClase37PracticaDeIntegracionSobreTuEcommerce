import { Schema, model, Types } from "mongoose";

const cartsMongoCollection = 'Cart';//en otra parte se pone en minusculas y mongo le agrega una "s"

const cartsMongoSchema = new Schema({
  products: {
    type: [
      {
        product: {
          type: Types.ObjectId,
          ref: "products"
        },
        quantity: Number
      }
    ],
    default: []
  }
});

//[{ productMongoId: Types.ObjectId, quantity: Number }]
const cartsMongoModel = model(cartsMongoCollection, cartsMongoSchema);
export default cartsMongoModel;
import cartsMongoModel from "../models/cartsMongo.models.js";

class CartsMongoManager {
  getAllCartsMongo = async () => {
    try {
      const allCartsMongo = await cartsMongoModel.find({});

      return allCartsMongo;
    } catch (err) {
      console.log(
        "🚀 ~ file: carts.manager.js:10 ~ CartsMongoManager ~ getAllCartsMongo= ~ err:",
        err
      );
    }
  };

  getAllCartsMongoPopulate = async () => {
    try {
      const allCartsMongo = await cartsMongoModel.find({}).populate('products.product');

      return allCartsMongo;
    } catch (err) {
      console.log(
        "🚀 ~ file: carts.manager.js:19 ~ CartsMongoManager ~ getAllCartsMongoPopulate= ~ err:",
        err
      );
    }
  };

  getCartMongoById = async (id) => {
    try {
      return await cartsMongoModel.findById({ _id: id });
    } catch (err) {
      console.log(
        "🚀 ~ file: cartsMongo.manager.js:21 ~ CartsMongoManager ~ getCartMongoById= ~ err:",
        err
      );
    }
  };

  getCartMongoByIdPopulate = async (id) => {
    try {
      return await cartsMongoModel.findById({ _id: id }).populate('products.product');
    } catch (err) {
      console.log(
        "🚀 ~ file: cartsMongo.manager.js:21 ~ CartsMongoManager ~ getCartMongoById= ~ err:",
        err
      );
    }
  };
  
  createCartMongo = async (cartMongoBody) => {
    try {
      // const checkCartMongo = await cartsMongoModel.findOne({
      //   products: `${cartMongoBody.cartMongo.toLowerCase()}`,//product o products OJO
      // });

      // if (!checkCartMongo) {
      //   return null;
      // }
      console.log("cartMongoBody es:");
      console.log(cartMongoBody);     

      
      const newCartMongo = await cartsMongoModel.create(cartMongoBody);
      if(!newCartMongo){
        throw "no se creo el documento en mongo atlas";
      }
      return newCartMongo;

    } catch (error) {
      console.log(
        "🚀 ~ file: carts.manager.js:45 ~ CartsManager ~ createCarts=async ~ error:",
        error
      );
      throw error;

    }
  };
}

export default CartsMongoManager;
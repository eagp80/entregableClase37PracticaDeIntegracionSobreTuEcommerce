import cartsMongoModel from "../models/cartsMongo.models.js";

class CartsMongoManager {
  getAllCartsMongo = async () => {
    try {
      const allCartsMongo = await cartsMongoModel.find({});

      return allCartsMongo;
    } catch (error) {

      req.logger.fatal(
        `Method: carts.manager.js:10 ~ CartsMongoManager ~ getAllCartsMongo,
         - time: ${new Date().toLocaleTimeString()
        } con ERROR: ${error.message}`);
        throw error;
    }
  };

  getAllCartsMongoPopulate = async () => {
    try {
      const allCartsMongo = await cartsMongoModel.find({}).populate('products.product');

      return allCartsMongo;
    } catch (error) {
      req.logger.fatal(
        `Method: cartMongo.manager.js:25 ~ CartsMongoManager ~ getAllCartsMongoPopulate,
         - time: ${new Date().toLocaleTimeString()
        } con ERROR: ${error.message}`);
        throw error;

    }
  };

  getCartMongoById = async (id) => {
    try {
      return await cartsMongoModel.findById({ _id: id });
    } catch (error) {
      req.logger.fatal(
        `Method: cartsMongo.manager.js:39 ~ CartsMongoManager ~ getCartMongoById,
         - time: ${new Date().toLocaleTimeString()
        } con ERROR: ${error.message}`);
        throw error;     
    }
  };

  getCartMongoByIdPopulate = async (id) => {
    try {
      return await cartsMongoModel.findById({ _id: id }).populate('products.product');
    } catch (error) {
      req.logger.fatal(
        `Method: cartsMongo.manager.js:51 ~ CartsMongoManager ~ getCartMongoByIdPopulate,
         - time: ${new Date().toLocaleTimeString()
        } con ERROR: ${error.message}`);
        throw error;
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
      req.logger.info(
        `Method: cartsMongo.manager.js:51 ~ CartsMongoManager ~ createCartMongo,
         - time: ${new Date().toLocaleTimeString()
        } cartMongoBody es: ${cartMongoBody}`);
      
      const newCartMongo = await cartsMongoModel.create(cartMongoBody);
      if(!newCartMongo){
        throw "no se creo el documento en mongo atlas";
      }
      return newCartMongo;

    } catch (error) {
      req.logger.fatal(
        `Method: cartsMongo.manager.js:79 ~ CartsMongoManager ~ createCartMongo,
         - time: ${new Date().toLocaleTimeString()
        } con ERROR: ${error.message}`);
        throw error; 
    }
  };

  deleteAllProductsFromCart = async (cid) => {
    try {
      await cartsModel.findOneAndUpdate(
        { _id: cid },
        { $set: { products: [] }},
        { new: true},
      )

      return { msg: 'Cart emptyed' }

    } catch (error) {
      console.log(error);
      throw new Error('Error while emptying cart')
    }
  };

  deleteProductFromCart = async (cid, pid) => {
    try {
      const deletedProduct = await cartsMongoModel.findOneAndUpdate(
        { _id: cid },
        { $pull: { products: { product: pid }}},
        { new: true },
      );

      return {
        msg: 'Product deleted',
        deletedProduct,
      };
      
    } catch (error) {
      console.error(error);
      throw new Error('Error while deleting product from cart');
    }
  }

}

export default CartsMongoManager;
import productsMongoModel from "../models/productsMongo.models.js";

class ProductMongoManager {
  getAllProductsMongo = async () => {
    try {
      const productsMongoArr = await productsMongoModel.find({});
      return productsMongoArr;
    } catch (error) {
      console.log(
        "🚀 ~ file: productsMongo.routes.js:42 ~ ProductsMongoRoutes ~ this.router.get ~ error:",
        error
      );
    }
  };

  getProductMongoById = async (id) => {
    try {
      const productMongoDetail = await productsMongoModel.findById({ _id: id });

      return productMongoDetail;
    } catch (error) {
      console.log(
        "🚀 ~ file: productMongo.manager.js:22 ~ ProductMongoManager ~ getProductMongoById= ~ error:",
        error
      );
    }
  };

  createProductMongo = async (bodyProductMongo) => {
    try {
      // TODO REVISANDO SI EL PRODUCTO YA FUE CREADO ANTERIOMENTE
      const productMongoDetail = await productsMongoModel.findOne({
        code: bodyProductMongo.code,
      });
      if (productMongoDetail && Object.keys(productMongoDetail).length !== 0) {//si existe y tiene alguna propiedad no crear
        //return null;
        throw 'ya existe el codigo del producto';
      }// si no existe producto o (si existe pero tiene una propiedad) 


      //validar nombre repetido
      // const productMongo= await productsMongoModel.findOne({
      //   title: bodyProductMongo.title,
      // });
      // if (productMongoDetail && Object.keys(productMongoDetail).length !== 0) {//si existe y tiene alguna propiedad no crear
      //   throw 'ya existe el nombre  del producto';
      // }// si no existe estudiante o (si existe pero tiene una propiedad) 
      console.log(bodyProductMongo);
      const newProductMongo = await productsMongoModel.create(bodyProductMongo);
      // TODO: Manejar el error o si pasa algo mientras creo el documento de producto

      return newProductMongo;
    } catch (error) {
      console.log(
        "🚀 ~ file: productMongo.manager.js:42 ~ ProductMongoManager ~ createProductMongo= ~ error:",
        error
      );
      throw error;
    }
  };
}

export default ProductMongoManager;

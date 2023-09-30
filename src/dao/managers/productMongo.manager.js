import productsMongoModel from "../models/productsMongo.models.js";

class ProductMongoManager {
  getAllProductsMongo = async () => {
    try {
      const productsMongoArr = await productsMongoModel.find({});
      return productsMongoArr;
    } catch (error) { 
      req.logger.fatal(
        `Method: productMongo.manager.js:9 ~ getAllProductsMongo,
         - time: ${new Date().toLocaleTimeString()
        } con ERROR: ${error.message}`); 
      throw error;
    }
  };

  getProductMongoById = async (id) => {
    try {
      //Tutor: podemos evitar try catch y delegar a quien use el metodoque atrape error y decida
      //si se hace aca se debe devolver una respuesta
      //se puede lanzar la excepcion pero se duplicran los mensajes
      const productMongoDetail = await productsMongoModel.findById({ _id: id });

      return productMongoDetail;
    } catch (error) {
      req.logger.fatal(
      `Method: productMongo.manager.js:25 ~ ProductMongoManager ~ getProductMongoById,
       - time: ${new Date().toLocaleTimeString()
      } con ERROR: ${error.message}`);

      //Tutor: esta ee una opcion ademas del log o remover el try catch (throw error)
      throw error;
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
      // if (productMongoDetail && Object.keys(productMongoDetail).length !== 0) {//si existe y tiene alguna propiedad no crear
      //   throw 'ya existe el nombre  del producto';
   
      console.log(bodyProductMongo);
      const newProductMongo = await productsMongoModel.create(bodyProductMongo);
      // TODO: Manejar el error o si pasa algo mientras creo el documento de producto

      return newProductMongo;
    } catch (error) {
        console.log("🚀 ~ file: productMongo.manager.js:58 ~ createProductMongo= ~ error:", error)
        req.logger.fatal(
        `Method: productMongo.manager.js:58 ~ createProductMongo,
         - time: ${new Date().toLocaleTimeString()
        } con ERROR: ${error.message}`);
      throw error;
    }
  };

    // This method updates a Product information a saves the change into the DB
    updateProduct = async (id, updatedData) => {

      try {
        const productUpdated = await productsMongoModel.findOneAndUpdate({ _id: id }, updatedData, { new: true });
          
        if(!productUpdated) return {msg: `Unexisting product with id: ${id}`}
  
        return {msg: 'Product Updated', productUpdated}
        
      } catch (error) {
        console.log(error);
        throw new Error('Error while updating the product');
      }
    }

}

export default ProductMongoManager;

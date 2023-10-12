import { HttpResponse } from "../../middleware/error-handler.js";
import productsMongoModel from "../models/productsMongo.models.js";
const  httpResp  = new HttpResponse();

class ProductMongoManager {
  getAllProductsMongo = async () => {
    try {
      const productsMongoArr = await productsMongoModel.find({});
      return productsMongoArr;
    } catch (error) { 
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
        throw 'ya existe el codigo del producto';
      }// si no existe producto o (si existe pero tiene una propiedad)
      //validar nombre repetido      
      const newProductMongo = await productsMongoModel.create(bodyProductMongo);
      return newProductMongo;
    } catch (error) {

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
        console.error(error);
        throw new Error('Error while updating the product');
      }
    }

    deleteProduct = async (id, updatedData) => {

      try {
        const productDeleted = await productsMongoModel.findByIdAndDelete(id)
        
          
        if(!productDeleted) return {msg: `Unexisting product for to delete with id: ${id}`}
  
        return {msg: 'Product Deleted', productDeleted}
        
      } catch (error) {
        console.error(error);
        throw new Error('Error while deleting the product');
      }
    }

}

export default ProductMongoManager;

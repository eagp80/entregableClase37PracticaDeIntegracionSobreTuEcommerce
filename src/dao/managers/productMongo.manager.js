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

    const {
      title,
      description,
      code,
      price,
      stock,
      category,
      owner,
    } = bodyProductMongo;


    // if( !title || !description || !code || !price || !stock || !category || !owner) {

    //   return httpResp.BadRequest(res, 'Error while creating product', "Fields 'title', 'description', 'code', 'price', 'stock', 'category', owner are necesary");
    // }
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
        console.log(error);
        throw new Error('Error while updating the product');
      }
    }

}

export default ProductMongoManager;

import { Router } from "express";
import cartsMongoModel  from "../dao/models/cartsMongo.models.js";
import userModel from "../dao/models/user.model.js";
import ticketsManager from "../dao/managers/tickets.manager.js";
import productMongoModel from "../dao/models/productsMongo.models.js";
import CartMongoManager from "../dao/managers/cartMongo.manager.js";
import ProductMongoManager from "../dao/managers/productMongo.manager.js";
import { Schema, model, Types } from "mongoose";
import { HttpResponse, EnumErrors } from "../middleware/error-handler.js";
import { passportCall } from "../utils/jwt.js";
import handlePolicies from "../middleware/handle-policies.middleware.js";
const { ObjectId } = Types;

const httpResp  = new HttpResponse;



class CartsMongoRoutes {
  path = "/carts";
  router = Router();
  cartMongoManager = new CartMongoManager();
  productMongoManager = new ProductMongoManager();


  constructor() {
    this.initCartsMongoRoutes();
  }

  initCartsMongoRoutes() {
    //*************************************************************************************
    //*************************************************************************************
    //******* Crear un carrito nuevo con un array vacío de products ***********************
    //******  POST DE /api/v1/cartsmongo **************************************************
    //*************************************************************************************
    //*************************************************************************************
    this.router.post(`${this.path}`, async (req, res) => {
      try {    
        const cartMongo = {"products": []};
        // TODO REVISANDO SI EL CARRITO YA FUE CREADO ANTERIOMENTE
        const newCartMongo = await this.cartMongoManager.createCartMongo(cartMongo);
        if (!newCartMongo) {
          return httpResp.Error(res,`the cartMongo not created`, {error:EnumErrors.DATABASE_ERROR}); 
          
          // return res.json({
          //   message: `the cartMongo not created`,
          // });
        }//se cambio por throw,
        return httpResp.OK(res,`Carrito nuevo creado`, {newCartMongo:newCartMongo}); 

        // return res.status(201).json({
        //   message: `cart created successfully in Mongo Atlas`,
        //   cart: newCartMongo,
        // });
      } catch (error) {
        req.logger.fatal(
          `Method: ${req.method}, url: ${
            req.url
          } - time: ${new Date().toLocaleTimeString()
          } con ERROR: ${error.message}`);   
       
        //recibe tambiem el catch de createProductMongo
        return httpResp.Error(res,`the cartMongo not created`, {error:error}); 
        
        //  return res.status(400).json({
        //     message: error.message ?? error            
        //   });
        }
    });

    //*************************************************************************************
    //*************************************************************************************
    //********** Obtener un carrito con Id de carrito *************************************
    //******  GET DE /api/v1/carts/:cid **************************************
    //*************************************************************************************
    //*************************************************************************************
    this.router.get(`${this.path}/:cid`, async (req, res) => {
      try {
        // TODO: HACER VALIDACIONES *
        const cid=req.params.cid;
        let cartMongoData = await this.cartMongoManager.getCartMongoByIdPopulate(cid);//population        
        // TODO REVISANDO SI EL CARRITO YA FUE CREADO ANTERIOMENTE        
        if (!cartMongoData) {
          return httpResp.Error(res,`the cart by Id in Mongo Atlas not found`, {error:EnumErrors.INVALID_PARAMS}); 

          // return res.json({
          //   message: `the cart by Id in Mongo Atlas not found`,
          // });
        }//se cambio por throw,
        return httpResp.OK(res,`cart found successfully in Mongo Atlas (with population)`, {cart: cartMongoData}); 

        // return res.status(201).json({
        //   message: `cart found successfully in Mongo Atlas (with population)`,
        //   cart: cartMongoData,
        // });
      } catch (error) {
        req.logger.fatal(
          `Method: ${req.method}, url: ${
            req.url
          } - time: ${new Date().toLocaleTimeString()
          } con ERROR: ${error.message}`);   
 
        //recibe tambiem el catch de getCartById ProductMongo
        return httpResp.Error(res,error.message ?? error, {error:EnumErrors.CONTROLLER_ERROR}); 
        
        //  return res.status(400).json({
        //     message: error.message ?? error            
        //   });
        }
    });

    //*************************************************************************************
    //*************************************************************************************
    //*********** Agregar un Id de  producto a un carrito dado por su Id *****************
    //******  POST DE /api/v1/carts/:cid/products/:pid *************
    //*************************************************************************************
    //*************************************************************************************
    this.router.post(`${this.path}/:cid/products/:pid`,[passportCall("jwt"), handlePolicies(["ADMIN", "USER","PREMIUM"])], async (req, res) => {
      try {
        // TODO: HACER VALIDACIONES 
        const cid=req.params.cid;
        const pid=req.params.pid;
        const { email, role } = req.user.user;
        //comparar owner de producto con email de usuario, no proceder si son iguales

        const productMongoExist = await this.productMongoManager.getProductMongoById(
          pid
        );  
        if (!productMongoExist) {
          return httpResp.BadRequest(res, 'Unexisting Product', 'Product not found')
        }
        if (productMongoExist.owner === email ) {
          return httpResp.Forbbiden(res, 'you are owner', 'You are not can buy this product')
        }

        let cartMongoData = {};

        cartMongoData = await this.cartMongoManager.getCartMongoById(cid);
        
        if (!cartMongoData) {// 1. si no existe carrito no se hace nada
          return httpResp.Error(res,`the cart by Id in Mongo Atlas not found`, {error:EnumErrors.INVALID_PARAMS}); 

        }
          //2. si existe carrito pero no tiene productos
        if(cartMongoData.products==[]){           
            const productNewId= new ObjectId(pid);
            req.logger.debug(
              `Method: ${req.method}, url: ${
                req.url
              } - time: ${new Date().toLocaleTimeString()
              } entro en 2`
            ); 
            cartsMongoModel.findByIdAndUpdate(cid, { products: [{product: productNewId, quantity: 1}] }, { new: true })
            .then(updatedCart => {
              req.logger.info(
                `Method: ${req.method}, url: ${
                  req.url
                } - time: ${new Date().toLocaleTimeString()
                } updatedCart: ${updatedCart}`
              );  
              cartMongoData=updatedCart;
            })
            .catch(error => {
              req.logger.fatal(
                `Method: ${req.method}, url: ${
                  req.url
                } - time: ${new Date().toLocaleTimeString()
                } con ERROR: ${error.message}`); 
              return httpResp.Error(res,`the cart by Id in Mongo Atlas not update`, {error:EnumErrors.DATABASE_ERROR}); 
            });
        } else {// fin if 2, else al if 2... Situacion 3. si el carrito tiene productos verificar si ya tiene el producto
          req.logger.debug(
            `Method: ${req.method}, url: ${
              req.url
            } - time: ${new Date().toLocaleTimeString()
            } Comparando cada producto en carrito con pid pasado por parametro en url, antes de entrar a 3 o 4 `
          );  
            //console.log("verificando antes de entrar a 3 o 4")
            //const idComp = new ObjectId(pid);
            let existeProduct = false;
            let indexOfProducts= 0;
            cartMongoData.products.forEach((element,i) => {  
              req.logger.debug(
                `Method: ${req.method}, url: ${
                  req.url
                } - time: ${new Date().toLocaleTimeString()
                } product: ${element.product.toString()} `
              );       
              req.logger.debug(
                `Method: ${req.method}, url: ${
                  req.url
                } - time: ${new Date().toLocaleTimeString()
                } pid: ${pid} `
              );  

              if(element.product.toString() === pid){//este if solo funciono con toString() en ambos
                req.logger.debug(
                  `Method: ${req.method}, url: ${
                    req.url
                  } - time: ${new Date().toLocaleTimeString()
                  } el producto ya lo tiene e carrito`
                );  
                existeProduct= true;
                indexOfProducts=i;              
              }              
            }); 

            if(existeProduct){//if 3 situacion 3, si ya se tiene el producto incrementamos quantity
                  cartMongoData.products[indexOfProducts].quantity++;
                  req.logger.debug(
                    `Method: ${req.method}, url: ${
                      req.url
                    } - time: ${new Date().toLocaleTimeString()
                    }  entrooooo en caso 3, ya tiene el producto se incrementa quantity `
                  );
                  cartsMongoModel.findByIdAndUpdate(cid, {products: cartMongoData.products }, { new: true })
                  .then(updatedCart => {
                    req.logger.http(
                      `Method: ${req.method}, url: ${
                        req.url
                      } - time: ${new Date().toLocaleTimeString()
                      }Carrito actualizado updatedCart: ${updatedCart}  `
                    );
                    cartMongoData = updatedCart;

                  })
                  .catch(error => {
                    req.logger.fatal(
                      `Method: ${req.method}, url: ${
                        req.url
                      } - time: ${new Date().toLocaleTimeString()
                      } con ERROR: ${error.message}`); 
                    return httpResp.Error(res,`the cart by Id in Mongo Atlas not update`, {error:EnumErrors.DATABASE_ERROR}); 

                  });
            } else {//else a if 3,  situacion 4 . si el carrrito existe y no tiene el producto hacer quantity =1
              req.logger.debug(
                `Method: ${req.method}, url: ${
                  req.url
                } - time: ${new Date().toLocaleTimeString()
                } entro en caso 4, no tiene el producto, se agregara un nuevo ObjectId del producto en el carrito`
              );    
                  const productNewId= new ObjectId(pid);
                  cartMongoData.products.push({ product:productNewId, quantity: 1 }); 
                  cartsMongoModel.findByIdAndUpdate(cid, {products: cartMongoData.products }, { new: true })
                  .then(updatedCart => {
                    req.logger.info(
                      `Method: ${req.method}, url: ${
                        req.url
                      } - time: ${new Date().toLocaleTimeString()
                      } updateCart: ${updatedCart}`
                    );
                    cartMongoData = updatedCart;
                  })
                  .catch(error => {
                    req.logger.fatal(
                      `Method: ${req.method}, url: ${
                        req.url
                      } - time: ${new Date().toLocaleTimeString()
                      } con ERROR: ${error.message}`);  
                    return httpResp.Error(res,`the cart by Id in Mongo Atlas not update`, {error:EnumErrors.DATABASE_ERROR}); 
                  });             
            }// fin else de situacion 4
        }//fin else del if 2, situacion 3
        return httpResp.OK(res,`cart found successfully and update in Mongo Atlas`,{cartMongoData});
        
        // return res.status(201).json({
        //   //agregar 
        //   message: `cart found successfully and update in Mongo Atlas`        
        // });
      } catch (error) {
        req.logger.fatal(
          `Method: ${req.method}, url: ${
            req.url
          } - time: ${new Date().toLocaleTimeString()
          } con ERROR: ${error.message}`);   
        //recibe tambiem el catch de getCartById ProductMongo
         return httpResp.Error(res,error.message ?? error , error);

        //  return res.status(400).json({
        //     message: error.message ?? error            
        //   });
        }
    });

    //*************************************************************************************
    //*************************************************************************************
    // Eliminar un Id de  producto de un carrito por medio de Id de carrito  **************
    //******  PUT DE /api/v1/cartsmongo/:cid/productMongo/:produtMongoId   ************
    //*************************************************************************************
    //*************************************************************************************
    this.router.delete(`${this.path}/:cid/products/:pid`, async (req, res) => {
      try{
        const { cid, pid } = req.params;
        const cart = await cartsMongoModel.findById({_id: cid});
        const index =  cart.products.findIndex(item => item.product === pid);
        if(index){
          const cartAux = cart;
          cartAux.products.splice(index,1);    
          await cartsMongoModel.updateOne({_id:cid}, cartAux);
          const cartUpdate = await cartsMongoModel.findById({_id: cid}); 
          return httpResp.OK(res,`the product by Id in cart by Id in Mongo Atlas deleted`, {cartUpdate: cartUpdate}); 
         
        }else{
          return httpResp.NotFound(res,`no existe el producto en este carrito`, {productId: pid}); 

        }
      } catch (error) {
        req.logger.fatal(
          `Method: ${req.method}, url: ${
            req.url
          } - time: ${new Date().toLocaleTimeString()
          } con ERROR: ${error.message}`);  
          return httpResp.Error(res,`the cart by Id in Mongo Atlas not deleted`, {error:EnumErrors.DATABASE_ERROR}); 

      }
      
    });

    //*************************************************************************************
    //*************************************************************************************
    //****** VACIAR el array de products de un carrito por medio de Id CARRITO ************
    //******  DELETE DE /api/v1/cartsmongo/:cid **********************************
    //*************************************************************************************
    //*************************************************************************************
    this.router.delete(`${this.path}/:cid`, async (req, res) => {
      try{
        const { cid} = req.params;
        let result = await cartsMongoModel.findOneAndUpdate({_id:`${cid}`},{products:[]});
        return httpResp.Ok(res,`cartsMongo DELETE all products sucessfully`, {result:result}); 

        // return res.json({ 
        //   message: `cartsMongo DELETE all products sucessfully`, 
        //   result:result });
        
      } catch (error) {
        req.logger.fatal(
          `Method: ${req.method}, url: ${
            req.url
          } - time: ${new Date().toLocaleTimeString()
          } con ERROR: ${error.message}`);  
          return httpResp.Error(res,`the cart by Id in Mongo Atlas not deleted`, {error:EnumErrors.DATABASE_ERROR}); 

      }
      
    });

    //*************************************************************************************
    //*************************************************************************************
    //******  Actualizar el array de products por medio de Id de carrito ******************
    //******  PUT DE /api/v1/cartsmongo/:cid  ************************************
    //*************************************************************************************
    //*************************************************************************************
    this.router.put(`${this.path}/:cid`, async (req, res) => {
      try{
        const { cid} = req.params;
        const arrayItemsProducts= req.body.products;
        let result = await cartsMongoModel.findOneAndUpdate({_id:`${cid}`},{products:arrayItemsProducts}, { new: true });
        return httpResp.OK(res,`cartsMongo update array of products with PUT sucessfully`, {result:result}); 

      } catch (error) {
        req.logger.fatal(
          `Method: ${req.method}, url: ${
            req.url
          } - time: ${new Date().toLocaleTimeString()
          } con ERROR: ${error.message}`);  
          return httpResp.Error(res,`cartsMongo NOT update array of products with PUT`, {error:EnumErrors.DATABASE_ERROR}); 

      }
    });

    //*************************************************************************************
    //*************************************************************************************
    //******  Actualizar  SÓLO la cantidad de ejemplares  del producto ********************
    //******* por cualquier cantidad pasada desde req.body.     ***************************
    //******  PUT DE /api/v1/cartsmongo/:cid/productMongo/:produtMongoId **********************************
    //*************************************************************************************
    //*************************************************************************************
    this.router.put(`${this.path}/:cid/products/:pid`, async (req, res) => {
      try{
        let result = await cartsMongoModel.findOneAndUpdate(
          { _id: req.params.cid, "products.product": req.params.pid },
          { $set: { "products.$.quantity": req.body.quantity } },
          { new: true });   
          return httpResp.Ok(res,`cartsMongo PUT set quantity in product pid of cart cid`, {result:result}); 
      } catch (error) {
        req.logger.fatal(
          `Method: ${req.method}, url: ${
            req.url
          } - time: ${new Date().toLocaleTimeString()
          } con ERROR: ${error.message}`);   
          return httpResp.Error(res,`Error cartsMongo PUT NOT set quantity in product pid of cart cid`, {error:EnumErrors.DATABASE_ERROR});
      }
    });

    this.router.post(`${this.path}/:cid/purchase`, async (req, res) => {
      const { cid } = req.params;    
      try {
      // Corroboro la existencia del cart
      const cart = await this.cartMongoManager.getCartMongoByIdPopulate(cid);
           
        if (!cart)  return httpResp.BadRequest(res,'Cart not found',cart);

      // creo variables para almacenar productos cuyo stock es mejor a la compra, y otra para el monto total de la compra
      const outOfStock = [];
      let purchaseAmount = 0;

      // Itero sobre los productos del cart. 
      // Si tiene existencia suficiente: lo sumo al monto total de la compa, actualizo la existencia, y lo elimino del carrito.
      // Si no tiene existencia suficiente agrego al producto al arreglo de "outOfStock"
      for (const element of cart.products) {
        if ( element.product.stock > element.quantity ) {
          purchaseAmount += element.quantity * element.product.price
          await this.productMongoManager.updateProduct(element.product._id, {
            stock: element.product.stock - element.quantity
          })
          await this.cartMongoManager.deleteProductFromCart(cid, element.product._id)
        } else {
          outOfStock.push(element.product.title)
        }
      }

      // Si ningun producto tenia stock
      if(outOfStock.length > 0 && purchaseAmount === 0) {
        console.log("🚀 ~ file: cartsMongo.router.js:406 ~ CartsMongoRoutes ~ this.router.post ~ outOfStock:", outOfStock)
        return httpResp.BadRequest(res,'Selected products are out of stock.',null);   
      }

      // Corroboro el id del usuario que es dueño de ese cart
      const userWithCart = await userModel.findOne({ cart: cid });
      console.log("🚀 ~ file: cartsMongo.router.js:415 ~ CartsMongoRoutes ~ this.router.post ~ userWithCart:", userWithCart)
      
      // Creo un ticket pasandole el email del usuario dueño del carrito, y el monto total de la compra.
      // (El id carrito se le asigna al usuario cuando el mismo se registra). Relacion 1 a 1 entre cart y usuario.
      const ticket = await ticketsManager.createTicket(userWithCart.email, purchaseAmount)

      // Si algunos productos no tenian stock
      if(outOfStock.length > 0 && purchaseAmount > 0) {
        return httpResp.OK(res,'Purchase submitted, The following products are out of stock:',{outOfStock, ticket});
      }
      // Si todos los productos tenian stock
      return httpResp.OK(res,'Purchase submitted, ticket:',ticket);
      // res.send(resp);          
      } catch (error) {
        console.log(error);
        //req.logger.error(error);
        // res.status(500).send({msg: error.message});
        httpResp.Error(res, 'Error while purchasing', error);
      }
    })
  }
}

export default CartsMongoRoutes;

import { Router } from "express";
import CartsMongoManager from "../dao/managers/cartMongo.manager.js";
import ProductsMongoManager from "../dao/managers/productMongo.manager.js";
import productMongoModel from "../dao/models/productsMongo.models.js";
import { NODE_ENV, PORT, API_VERSION, CURSO } from "../config/config.js";
import { passportCall } from "../utils/jwt.js";
import handlePolicies from "../middleware/handle-policies.middleware.js";




class ViewsMongoRoutes {
  path = "/views";
  router = Router();
  productMongoManager = new ProductsMongoManager();
  cartsMongoManager = new CartsMongoManager();
  role="USER";

  constructor() {
    this.initViewsMongoRoutes();
  }

  initViewsMongoRoutes() {

    /*************************************************************************************
    //*************************************************************************************
    //********** Vista de todos los carritos  *************************************
    //******  GET DE /api/v1/views/carts/ **************************************
    //*************************************************************************************
    //*************************************************************************************/

    this.router.get(`${this.path}/carts`, 
    [passportCall("jwt"), 
    handlePolicies(["USER", "ADMIN", "GOLD", "SILVER", "BRONCE"])],
     async (req, res) => {
      // let courses = [];
      let i = 0;
      const cartsMongo = await this.cartsMongoManager.getAllCartsMongoPopulate();

      const cartsMongoMapped = cartsMongo.map((cartMongo, index) => {
        return {
          i: index+1,
          id: cartMongo.id,
          // products: cartMongo.products.map(prod => prod.product.title)

          products: cartMongo.products.map(prod => {
            return {
              title: prod.product.title,
              qty: prod.quantity
            }
          })

        }
      })
      // console.log(JSON.stringify(cartsMongoMapped));    
      // cartsMongoMapped.map(item =>  console.log("Carrito:",item.i,item.products));     
      res.render("carts", { cartsMongo: cartsMongoMapped });
    });

    //*************************************************************************************
    //*************************************************************************************
    //********** Vista de un carrito por  Id de carrito *************************************
    //******  GET DE /api/v1/views/carts/:cid **************************************
    //*************************************************************************************
    //*************************************************************************************
    
    this.router.get(`${this.path}/carts/:cid`, 
    [passportCall("jwt"), 
    handlePolicies(["USER", "ADMIN", "GOLD", "SILVER", "BRONCE"])],
     async (req, res) => {
      try {
        // TODO: HACER VALIDACIONES *
        const cid=req.params.cid;
        let cartMongoData = await this.cartsMongoManager.getCartMongoByIdPopulate(cid);//population        
        // TODO REVISANDO SI EL CARRITO YA FUE CREADO ANTERIOMENTE        
        if (!cartMongoData) {
          return res.json({
            message: `the cart by Id in Mongo Atlas not found`,
          });
        }//se cambio por throw,

      const cartMongoMapped = cartMongoData.products.map((item, index) => {
        return {
          i: index+1,
          title: item.product.title,
          qty: item.quantity          
          // products: cartMongo.products.map(prod => prod.product.title)
        }
      })
      console.log(JSON.stringify(cartMongoMapped));    
      cartMongoMapped.map(item2 =>  console.log("Item",item2.i,": ",item2.title,`, cantidad(${item2.qty}).`));  
        res.render("cartbyid", { cartMongo: cartMongoMapped, id:cid});

        // return res.status(201).json({
        //   message: `cart found successfully in Mongo Atlas (with population)`,
        //   cart: cartMongoData,
        // });
      } catch (error) {
        console.log(
          "🚀 ~ file: viewsMongo.routes.js:86 ~ viewsMongoRoutes ~ this.router.get ~ error:",
          error
        );
        //recibe tambiem el catch de getCartMongoByIdPopulate 
         return res.status(400).json({
            message: error.message ?? error            
          });
        }
    });


   //******************************************************************************* */
   //******************************************************************************* */
   //*******************Vista de productos con paginacion*************************** */
   //******************************************************************************* */
   //******************************************************************************* */
    this.router.get(`${this.path}/products`,
    [passportCall("jwt"), 
    handlePolicies(["USER", "ADMIN", "GOLD", "SILVER", "BRONCE"])], 
    async (req, res) => {//
      try {
        //obtener el carrito asosiado al usuario y ponerselo en linea 132s a CartOwn
        const cartUser = req.user.cart??req.user.user.cart;

        const { page = 1, limit = 10, query, sort } = req.query;
        let q = {};
        let qString = "";       
        let s = {};
        let sString = "";
        let url1="";
        let url2="";
        let cartOwn = `http://localhost:${PORT}/api/${API_VERSION}/carts/${cartUser}/products/`;

        if (sort) {
          s = JSON.parse(sort);
          sString= JSON.stringify(s);
        }        
        if(query){
          q = JSON.parse(query);
          qString = JSON.stringify(q);
        }
        const { docs, totalPages, hasPrevPage, hasNextPage, prevPage, nextPage } =
          await productMongoModel.paginate(q, { limit, page, sort: s, lean: true });      

          if (!query && sort) {            
            url1=`http://localhost:${PORT}/api/${API_VERSION}/views/products?limit=${limit}&page=${prevPage}&sort=${sString}`;
            url2=`http://localhost:${PORT}/api/${API_VERSION}/views/products?limit=${limit}&page=${nextPage}&sort=${sString}`;
          }

          
          if (query && !sort) {
            let qStringURI = encodeURIComponent(qString);
            url1=`http://localhost:${PORT}/api/${API_VERSION}/views/products?limit=${limit}&page=${prevPage}&query=${qStringURI}`;
            url2=`http://localhost:${PORT}/api/${API_VERSION}/views/products?limit=${limit}&page=${nextPage}&query=${qStringURI}`;
          }

          if (!query && !sort) {
            url1=`http://localhost:${PORT}/api/${API_VERSION}/views/products?limit=${limit}&page=${prevPage}`;
            url2=`http://localhost:${PORT}/api/${API_VERSION}/views/products?limit=${limit}&page=${nextPage}`;
          }        

          if (query && sort) {
            let qStringURI = encodeURIComponent(qString);
            url1 = `http://localhost:${PORT}/api/${API_VERSION}/views/products?limit=${limit}&page=${prevPage}&sort=${sort}&query=${qStringURI}`
            url2 = `http://localhost:${PORT}/api/${API_VERSION}/views/products?limit=${limit}&page=${nextPage}&sort=${sort}&query=${qStringURI}`
        }

      if (req.session.user?.email === "adminCoder@coder.com") {
        console.log(req.session);
        req.user.role="ADMIN";
      }else{ req.user.role = "USER" }

        res.render("products", {
          role: req.session?.user?.rol||req.user.user.role,
          name: req.session?.user?.name||req.user.user.name,
          first_name: req.session?.user?.first_name||req.user.user.first_name,
          last_name: req.session?.user?.last_name||req.user.user.last_name,
          email: req.session?.user?.email||req.user.user.email,
          cart: req.user.user.cart,
          age: req.session?.user?.age||req.user.user.age,
          payload: docs,
          totalPages: totalPages,
          prevPage: prevPage,
          nextPage: nextPage,
          page: page,
          hasPrevPage: hasPrevPage,
          hasNextPage: hasNextPage,
          prevLink: hasPrevPage
            ? url1
            : null,
          nextLink: hasNextPage
            ? url2
            : null,
          //prevLink: Link directo a la página previa (null si hasPrevPage=false),
          //nextLink:Link directo a la página siguiente (null si hasNextPage=false),
          cartOwn: cartOwn,
        })
      } catch (error) {
        console.log(
          "🚀 ~ file: viewsMongo.router.js:190 ~ viewsMongoRoutes ~ this.router.put ~ error:",
          error
        );
      }
    });
    
    this.router.get(`${this.path}/*`, async (req,res)=>{
      res.status(404).send('Error: algo mal en la ruta escrita');
    })
  }
}

export default ViewsMongoRoutes;

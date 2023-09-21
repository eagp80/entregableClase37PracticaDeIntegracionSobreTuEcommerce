
import express from "express";
import {Server} from 'socket.io';
import mongoose from "mongoose";
import cookieParser from "cookie-parser";

//const cors = require("cors");
import { NODE_ENV, PORT, API_VERSION, CURSO } from "./config/config.js";
import { mongoDBConnection } from "./db/mongo.config.js";
import handlebars from "express-handlebars";
import ProductManager from './dao/managers/productManager.js'

import productsRouter from './routes/products.router.js';
import cartsRouter from './routes/carts.router.js';
import viewsRouter from './routes/views.router.js';
import ViewsMongoRoutes from './routes/viewsMongo.router.js'
import ProductsMongoRoute from './routes/productsMongo.router.js';
import CartsMongoRoute from './routes/cartsMongo.router.js';
import SessionRoutes from "./routes/session.routes.js";//OJO
import SessionViewsRoutes from "./routes/sessionViews.routes.js";//OJO
import UserRoutes from "./routes/user.routes.js"
import mockingProducts from "./routes/mockingProducts.router.js";

import displayRoutes from "express-routemap";
import __dirname from './utils.js'
import AppMongo from './appMongo.js'
import LoggerTestRoutes from "./routes/loggerTest.routes.js";


const appMongo = new AppMongo([
       new CartsMongoRoute(),
       new ProductsMongoRoute(),
       new ViewsMongoRoutes(),//ojo
       new SessionViewsRoutes(),
       new SessionRoutes(),
       new UserRoutes(),
       new LoggerTestRoutes(),
     ]);
     
appMongo.listen();


const app = express();

app.use(express.json()); //permite leer json en las peticiones (en req.body)
//middlewar intercepta la peticion verifica si esta en json, covierte y continua
app.use(express.urlencoded({extended:true}));// permite tener el objeto codificado desde url (formularios)
//middlewar intercepta que este codificada desde una url si no continua
app.use(cookieParser());

app.use(express.static(`${__dirname}/public`));//lo que estara disponible, publico

//app.use('/api/products',productsRouter);//al llegar la ruta especificada lo procesa con productsRouter
//app.use('/api/carts',cartsRouter);//idem
app.use("/mockingproducts",mockingProducts);


app.engine('handlebars', handlebars.engine());//arrancamos y le ponemos un alias a el motor 
app.set('views', `${__dirname}/views`);//le decimos a app donde estaran las vistas
app.set('view engine', 'handlebars');//le decimos a app que el motor de vistas es handlebars con alias definido dos lineas antes

//app.use('/',viewsRouter);//al llegar la ruta especificada lo procesa con viewsRouter

//*****Se comenta este bloque de codigo para deshabilitar elservidor con file system */
       const serverHTTP = app.listen(8081, ()=>{
              console.log("Servidor con file-system en puerto 8081");
              console.log("Rutas disponibles con file-system en puerto 8081:");
              displayRoutes(app);
              console.log("=================================================");
              console.log("=================================================");
       });

//const io= new Server (serverHTTP);

// const productManager = new ProductManager("./products.json");//en directorio de proyecto
// const products = productManager.getProducts();
// productManager.products=products;

// io.on('connection', socket=>{
//        console.log("cliente conectado");
//        //io.emit('log',products);  

//        socket.on('message', data => {
//               const id = products.length + 1;
//                //con este metodo solicitamos crear producto
//               const {title, description, code,price,status, stock, category, thumbnails, image} = data;       
//               productManager.addProduct(title, description, code,price,status, stock, category, thumbnails);
//               //res.send({status:"ok", message :"Producto añadido" });
//               // const product = { id, ...data}
//               // products.unshift(product);
//               // fs.writeFileSync('./products.json',JSON.stringify(products, null, '\t'))
//               data["id"]=ProductManager.contador-1;
//               console.log("El siguiente producto fue creado desde cliente conectado por socket web");
//               console.log(data);
//               io.emit('product', data)
//           })            
       
//        socket.on('put',data=>{
       
//        io.emit('messageLogs', products)
// })

// });

import express from "express";
import cors from "cors";
import displayRoutes from "express-routemap";
import { engine } from "express-handlebars";
import { NODE_ENV, PORT, API_VERSION, CURSO, DB_CNN, SECRET_SESSION} from "./config/config.js";
import { mongoDBConnection } from "./db/mongo.config.js";
import __dirname from './utils.js'
import cookieParser from "cookie-parser";
import session from "express-session";
import mongoStore from "connect-mongo";
import passport from "passport";
import initializePassport from "./config/passport.config.js";


class AppMongo {
  appMongo;//referencia
  env;//ambiente
  port;//donde se escucharan las peticiones
  server;//para a futuro pruebas funcionales o unitarias, permite hacer cerrado de conexion 
  db_cnn;
  api_version;

  constructor(routes) {
    this.appMongo = express();
    this.env = NODE_ENV || "development";//si NODE_ENV no esta definido tomar "development"
    this.port = PORT || 8000;
    this.db_cnn = DB_CNN;
    this.api_version = API_VERSION;

    this.initializeMiddlewares();
    this.initializeRoutes(routes);
    this.connectDB();
    this.initHandlebars();
  }

  getServer() {
    return this.appMongo;
  }

  closeServer(done) {
    this.server = this.appMongo.listen(this.port, () => {
      done();//callback
    });
  }

  async connectDB() {// es asincrona porque mongoose retorna una promesa
    await mongoDBConnection()
  }

  initializeMiddlewares() {
    this.appMongo.use(cors());// para proteger o filtrar desde que dominio se puede conectar a este servidor
    this.appMongo.use(express.json());// cuando se hace req.body se pueda entender el formato json
    this.appMongo.use(express.urlencoded({ extended: true }));//cuando envian un formulario poder procesarlo en req.body
    this.appMongo.use("/static", express.static(`${__dirname}/public`));
    this.appMongo.use(cookieParser());
    this.appMongo.use(
      session({
        store: mongoStore.create({
          mongoUrl: DB_CNN,
          mongoOptions: { useNewUrlParser: true, useUnifiedTopology: true },
          ttl: 120
        }),
        secret: SECRET_SESSION,
        resave: false,
        saveUninitialized: false,
      })
    );
    initializePassport();
    this.appMongo.use(passport.initialize());
    this.appMongo.use(passport.session());

  }

  /**
   * initializeRoutes
   */
  initializeRoutes(routes) {
    routes.forEach((route) => {
      this.appMongo.use(`/api/${API_VERSION}`, route.router);
    });
  }

  listen() {
    this.appMongo.listen(this.port, () => {
      console.log(`Rutas disponibles y metodos asociados para servidor con Mongo-Atlas en puerto ${this.port}:`);
      displayRoutes(this.appMongo);
      console.log(`===================================================`);
      console.log(`================== COURSE: ${CURSO} ==================`);
      console.log(`================ ENV: ${this.env} =================`);
      console.log(`🚀 App con Mongo-Atlas listening on the port ${this.port}`);
      console.log(`===================================================`);
      console.log(`===================================================`);
      console.log(`Ruta de inicio -------> localhost:${this.port}/api/${this.api_version}`)

    });
  }

  initHandlebars() {
    this.appMongo.engine("handlebars", engine());//indica que se usara el motor handlebars en este express llamado appMongo se da alias handlebars
    this.appMongo.set("views", __dirname + "/views");//indica que cuando se escriba views en rutas se ira a carpeta __dirname/views
    this.appMongo.set("view engine", "handlebars");//indica que el motor que se usara para las vistas sera handlebars (alias dos lineas arriba)
  }
}

export default AppMongo;
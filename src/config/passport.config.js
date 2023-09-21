// import { use, serializeUser, deserializeUser } from "passport";
import passport from "passport";
import local from "passport-local";
import GithubStrategy from "passport-github2";
import userModel  from "../dao/models/user.model.js";
import { GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET} from "./config.js"
import { createHashValue, isValidPasswd } from "../utils/encrypt.js";
import jwt from "passport-jwt";
import ROLES from "../constantes/role.js";
import { SECRET_JWT, cookieExtractor } from "../utils/jwt.js";
import { Schema, model, Types } from "mongoose";
import CartsMongoManager from "../dao/managers/cartMongo.manager.js";

const { ObjectId } = Types;

const cartsMongoManager = new CartsMongoManager();

const JWTStrategy = jwt.Strategy;
const ExtractJWT = jwt.ExtractJwt;




const LocalStrategy =local.Strategy;

const initializePassport = () => {

  passport.use('registerpassport', new LocalStrategy(
    {passReqToCallback:true, usernameField:'email'}, async (req,username,password,done)=>{
      req.logger.http(
        `Method: ${req.method}, url: ${
          req.url
        } - time: ${new Date().toLocaleTimeString()
        } entraron a registerpassport`
      );
      const {first_name, last_name, email,age} = req.body;
      const role= 'USER';
      try {
        let user = await userModel.findOne({email:username});
        if(user){
          req.logger.http(
            `Method: ${req.method}, url: ${
              req.url
            } - time: ${new Date().toLocaleTimeString()
            } User already exist, you does not to continue`
          );
          return done(null,false); // ya existe usuario no puedes continuar
        }
        const cartMongo = {"products": []};
        const newCartMongo = await cartsMongoManager.createCartMongo(cartMongo);
        if (!newCartMongo) {
          req.logger.warning(
            `Method: ${req.method}, url: ${
              req.url
            } - time: ${new Date().toLocaleTimeString()
            } cartMongo asociado no creado al registrarse usuario, no se crea nuevo usuario`
          );
          return res.json({
            message: `the cartMongo not created, and the user not created`,
          });
        }

        const idCartUser = newCartMongo._id;
        const cartNewId= new ObjectId(idCartUser);

   
        const newUser = {
          first_name,
          last_name,
          email,
          age,
          password: await createHashValue(password),
          role,
          cart: cartNewId,
        };
        let result = await userModel.create(newUser);
        return done(null,result);
        
      } catch (error) {
        req.logger.fatal(
          `Method: ${req.method}, url: ${
            req.url
          } - time: ${new Date().toLocaleTimeString()
          } error fatal: ${error}`
        );
        return done("Error al intentar crear usuario:" + error)
      }
    }
  ));
  passport.use(
    "github",
    new GithubStrategy(
      {
        clientID: GITHUB_CLIENT_ID,
        clientSecret: GITHUB_CLIENT_SECRET,
        callbackURL: "http://localhost:8000/api/v1/session/githubcallback",
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          if(profile._json?.email===null){profile._json.email=profile._json?.url}
          //validar si email es null cambiar email:login o email o url o html_url 
          let user = await userModel.findOne({ email: profile._json?.email });
          
          if (!user) {
            console.log("entro a addNewUser en passport-github");// no tengo disponible aca req para usar req.logger
            const cartMongo = {"products": []};
            const newCartMongo = await cartsMongoManager.createCartMongo(cartMongo);
             if (!newCartMongo) {
             return res.json({
            message: `the cartMongo not created`,
            });
            }
            const idCartUser = newCartMongo._id;
            const cartNewId= new ObjectId(idCartUser);

            let addNewUser = {
              first_name: profile._json.name,
              last_name: "",
              email: profile._json?.email,
              age: 0,
              password: "",
              role: "USER",
              cart: cartNewId,
            };
            let newUser = await userModel.create(addNewUser);
            done(null, newUser);
          } else {
            // ***ya existia el usuario***
            // req.logger.info(
            //   `Method: ${req.method}, url: ${
            //     req.url
            //   } - time: ${new Date().toLocaleTimeString()
            //   } entró a ya existía usuario`
            // );
            console.log("Entró a ya existía usuario en passport-github");// no tengo disponible aca req para usar req.logger

            done(null, user);
          }
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  passport.use(
    "jwt",
    new JWTStrategy(
      {
        jwtFromRequest: ExtractJWT.fromExtractors([cookieExtractor]),
        //jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(), // Bearer atokenaskjehbdkajdhkahdka
        secretOrKey: SECRET_JWT,
      },
      async (jwtPayload, done) => {

        try {
          if (ROLES.includes(jwtPayload.role)) {
            return done(null, jwtPayload);
          }
          return done(null, jwtPayload);//ojo revisar porque se repite lo de arriba
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser(async (id, done) => {
    let user = await userModel.findById({ _id: id });
    done(null, user);
  });
};

export default initializePassport;

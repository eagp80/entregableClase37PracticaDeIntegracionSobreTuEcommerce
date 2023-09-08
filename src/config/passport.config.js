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
      console.log("entre a registerpassport");
      const {first_name, last_name, email,age} = req.body;
      const role= 'USER';
      try {
        let user = await userModel.findOne({email:username});
        if(user){
          console.log("User already exist");
          return done(null,false); // ya existe usuario no puedes conttinuar
        }
        const cartMongo = {"products": []};
        const newCartMongo = await cartsMongoManager.createCartMongo(cartMongo);
        if (!newCartMongo) {
          return res.json({
            message: `the cartMongo not created`,
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
        console.log("🚀 ~ file: passport.config.js:19 ~ {passReqtoCallback:true,usernameField:'email'}, ~ error:", error)
        return done("Error al crear usuario:" + error)
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
            console.log("entro a addNewUser");
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
            // ya existia el usuario
            console.log("entro a ya existia usuario");

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

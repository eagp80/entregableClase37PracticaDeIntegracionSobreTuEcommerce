import { Router } from "express";
import userModel from "../dao/models/user.model.js";
import session from "express-session";
import { API_VERSION } from "../config/config.js";
import { createHashValue, isValidPasswd } from "../utils/encrypt.js";
import passport from "passport";
import { generateJWT } from "../utils/jwt.js";

import { passportCall } from "../utils/jwt.js";
import handlePolicies from "../middleware/handle-policies.middleware.js";



//********* /api/v1/session/

class SessionRoutes {//no es un Router pero adentro tiene uno
  path = "/session";
  router = Router();
  api_version= API_VERSION;

  constructor() {
    this.initSessionRoutes();
  }

  initSessionRoutes() {//  api/v1/session/logout
    this.router.get(`${this.path}/current`, 
    [passportCall("jwt"), handlePolicies(["USER","ADMIN"])],
    async (req, res) =>{
      return res.send(req.user);
    });

    this.router.get(`${this.path}/current/:uid`, 
    [passportCall("jwt"), 
    handlePolicies(["USER", "ADMIN", "GOLD", "SILVER", "BRONCE"])],
    async (req, res) =>{
      try{
        const { uid } = req.params;
        const user = await userModel.findById(uid);
    
        if (!user) {
          return res.status(404).json({
            message: `user ${uid} info not found`,
          });
        }        
        return res.json({ message: "user info", user });
      } catch (error) {
        req.logger.fatal(
          `Method: ${req.method}, url: ${
            req.url
          } - time: ${new Date().toLocaleTimeString()
          } con ERROR: ${error}`);  
      } 
    });

    this.router.get(`${this.path}/logout`, async (req, res) =>{
      
      try{
        //algo
        req.logger.http(
          `Method: ${req.method}, url: ${
            req.url
          } - time: ${new Date().toLocaleTimeString()
          } - Alguien haciendo logout`);  
          req.session.destroy((err) => {//cambiar esto para trabajar con token y cookie
          if (!err) return res.redirect(`../login`);
          return res.send({ message: `logout Error`, body: err });
        });
        
      } catch (error) {
        req.logger.fatal(
          `Method: ${req.method}, url: ${
            req.url
          } - time: ${new Date().toLocaleTimeString()
          } con ERROR: ${error}`);        
      } 

    });

    this.router.post(`${this.path}/login`, async (req, res) =>{
      try{
        //algo
        const { email, password } = req.body;
        if(!email||!password) return res.status(400).send({status:"error", error: "Incompletes values"})
        //no es necesario consultar password a  base de datos
        const session = req.session;
        req.logger.http(
          `Method: ${req.method}, url: ${
            req.url
          } - time: ${new Date().toLocaleTimeString()
          } haciendo session: ${session}`);             
        // { email: email }
        //console.log(await userModel.find());
        const findUser = await userModel.findOne({ email });
        req.logger.http(
          `Method: ${req.method}, url: ${
            req.url
          } - time: ${new Date().toLocaleTimeString()
          } -buscando usuario por email, resultado: ${findUser}`);      
           
        if (!findUser) {
          return res
            .status(401)
            .json({ message: "user no found" });
        };
        if(!isValidPasswd(password,findUser.password)) {
          return res
            .status(401)
            .send({status: "error",  error: "Incorrect password" });
        };
    
        // const a = {          
        //   ...findUser, // estraigo todo propiedad por propiedad
        //   password: "***", //borro password en la session no en la base de datos
        // };
        //req.session.user=a._doc; //se hace asi porque los tres puntitos traen un monton de info incluyendo objeto _doc donde viene el user
        const signUser = {
          last_name: findUser.last_name,  
          first_name: findUser.first_name,  
          email,
          age: findUser.age,
          role: findUser.role,
          id: findUser._id,
          cart: findUser.cart,
        };
    
        const token = await generateJWT({ ...signUser });
        req.logger.http(
          `Method: ${req.method}, url: ${
            req.url
          } - time: ${new Date().toLocaleTimeString()
          } generando token: ${token}`); 
   
        req.user = {
          ...signUser,
        };
        req.logger.info(
          `Method: ${req.method}, url: ${
            req.url
          } - time: ${new Date().toLocaleTimeString()
          } -Guardando user en req.user: ${req.user}`); 
        
        // TODO: RESPUESTA DEL TOKEN ALMACENADO EN LA COOKIE
         res.cookie("token", token, { maxAge: 1000000, httpOnly: true });
        //return res.send("login sucess with jwt and cookie");
        return res.redirect(`../views/products`)//*****activatr este depues***/
    
        return res.json({ message: `welcome $${email},login success`, token });//para postman
    
        return res.render("profile", {//OJO OJO OJO
          last_name: req.session?.user?.last_name || findUser.last_name,
          email: req.session?.user?.email || email,
          age: req.session?.user?.age || findUser.age,
        });

      } catch (error) {
        req.logger.fatal(
          `Method: ${req.method}, url: ${
            req.url
          } - time: ${new Date().toLocaleTimeString()
          } con ERROR: ${error}`);       
      } 

    });

    this.router.post(`${this.path}/register`, passport.authenticate("registerpassport", {failureRedirect:'./failregister'}), async (req,res)=>{
      try{
        
        //algo
        req.logger.http(
          `Method: ${req.method}, url: ${
            req.url
          } - time: ${new Date().toLocaleTimeString()
          } -Obteniendo body******, resultado: ${req.body}`); 
        // const { first_name, last_name, email, age, password } = req.body;
        
        // const pswHashed = await createHashValue(password);
        // const userAdd = {
        //   first_name,
        //   last_name,
        //   email,
        //   age,
        //   password: pswHashed,
        // };
        // const newUser = await userModel.create(userAdd);

        // console.log("🚀 ~ file: session.routes.js:96 ~ SessionRoutes ~ this.router.post ~ newUser:", newUser);       
        res.send({status: "success", message: "User register"})
        // req.session.user = { first_name, last_name,email, age };
        // console.log("req.session al entrar con formulario a register");        
        // console.log(req.session);
        // return res.render("login");// OJO OJO OJO 
      } catch (error) {
        req.logger.fatal(
          `Method: ${req.method}, url: ${
            req.url
          } - time: ${new Date().toLocaleTimeString()
          } con ERROR: ${error}`);       
      }
    })

    this.router.get(`${this.path}/failregister`, async (req,res)=>{
      req.logger.warning(
        `Method: ${req.method}, url: ${
          req.url
        } - time: ${new Date().toLocaleTimeString()
        } Failed register with passport local`
      );
      res.send({error:"Failed register with passport local"});
    })

    this.router.get(`${this.path}/github`,passport.authenticate("github",{scope:['user:email']}), async (req, res) =>{
      
    });

    this.router.get(`${this.path}/githubcallback`, passport.authenticate('github',{failureRedirect:'/api/v1/login'}), async (req,res)=>{
      req.session.user=req.user;
      req.user.user=req.user;
      req.logger.http(
        `Method: ${req.method}, url: ${
          req.url
        } - time: ${new Date().toLocaleTimeString()
        } entró a githubcallback. Req.user: ${req.user}`
      );
      //console.log("entre a githubcallback");
     //console.log(req.user);
      let email = req.user.email;
      const findUser = await userModel.findOne({ email });

      const signUser = {
        email,
        role: findUser.role,
        id: findUser._id,
        cart: findUser.cart
      };
      const token = await generateJWT({ ...signUser });

      res.cookie("token", token, { maxAge: 1000000, httpOnly: true });

      //res.send("login correct with github");

      res.redirect(`../views/products`);
    })

  
    this.router.get(`${this.path}/failgithub`,async (req,res)=>{
      req.logger.error(
        `Method: ${req.method}, url: ${
          req.url
        } - time: ${new Date().toLocaleTimeString()
        } -Failed strategy, error: ${error}`);
      res.send({error:"Failed"});
    })

    this.router.post(`${this.path}/recover-psw`,async (req,res)=>{
      try {
        req.logger.info(
          `Method: ${req.method}, url: ${
            req.url
          } - time: ${new Date().toLocaleTimeString()
          } -BODY UPDATE*** CAMPO CORREO PARA ACTUALIZAR PASSWORD:`+ JSON.stringify(req.body.email));
        const {new_password,email}=req.body;
        const newPswHashed = await createHashValue(new_password);
        const user = await userModel.findOne({email});
        if(!user) return res.status(401).json({message:"credenciales invalidas o erroneas"});
        const updateUser = await userModel.findOneAndUpdate({email},{password:newPswHashed});
        if(!updateUser){
          return res.json({message:"Problemas actualizando contraseña"});
        }
        // return res.render("login");
        return res.redirect(`../login`);
      } catch (error) {
        req.logger.fatal(
          `Method: ${req.method}, url: ${
            req.url
          } - time: ${new Date().toLocaleTimeString()
          } con ERROR: ${error}`);             
      }
    })
  }  
}
export default SessionRoutes;

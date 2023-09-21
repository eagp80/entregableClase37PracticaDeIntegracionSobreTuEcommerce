import { Router } from "express";
import userModel from "../dao/models/user.model.js";
import session from "express-session";
import { API_VERSION } from "../config/config.js";
import passport from "passport";
import { passportCall } from "../utils/jwt.js";
import handlePolicies from "../middleware/handle-policies.middleware.js";



class SessionViewsRoutes {
  //algo
  path = "/";
  router = Router();

  constructor() {
    this.initSessionViewsRoutes();
  }
  initSessionViewsRoutes(){
    // ****** rutas directas ejemplo http://localhost:8000/api/v1/login

    this.router.get(`${this.path}`, async (req, res) =>{
      return res.redirect(`/api/${API_VERSION}/login`);
    })
    this.router.get(`${this.path}login`, async (req, res) =>{
      //algo
      try{
        res.render("login");
      }catch(error){
      console.log("🚀 ~ file: sessionViews.routes.js:21 ~ SessionViewsRoutes ~ this.router.get ~ error:", error)
      }
    })

    this.router.get(`${this.path}register`, async (req, res) =>{
      //algo
      try{
        res.render("register");
      }catch(error){
        console.log("🚀 ~ file: sessionViews.routes.js:30 ~ SessionViewsRoutes ~ this.router.get ~ error:", error)
      }
    })

    this.router.get(`${this.path}profile`,
    [passportCall("jwt"), 
    handlePolicies(["USER", "ADMIN", "GOLD", "SILVER", "BRONCE"])], 
    async (req, res) =>{
      try{
        const user = req.session.user?._doc || req.user.user|| "usuario no logueado";
        console.log("🚀 ~ file: sessionViews.routes.js:38 ~ SessionViewsRoutes ~ this.router.get ~ user:", user)
        res.render("profile", {
         email:  user.email,
         role: user.role,
         age: user.age,
         last_name: user.last_name,
         first_name: user.first_name,
         cart: user.cart,
          carrito: {
            carritoId: "carrito-1",
            productos: [{ productoId: "1", nombre: "camisa" }],
          },
        });
      }catch(error){
        console.log("🚀 ~ file: sessionViews.routes.js:50 ~ SessionViewsRoutes ~ this.router.get ~ error:", error)
      }
    })

    this.router.get(`${this.path}recover`, async (req,res)=>{
      res.render("recover");
    })
  }
}
export default SessionViewsRoutes;

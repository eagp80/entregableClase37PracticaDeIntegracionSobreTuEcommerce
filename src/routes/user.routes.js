import { Router } from "express";
import userModel from "../dao/models/user.model.js";

import { passportCall } from "../utils/jwt.js";
import authorization from "../middleware/authorization.middleware.js";
import handlePolicies from "../middleware/handle-policies.middleware.js";

import { API_VERSION } from "../config/config.js";
import { createHashValue, isValidPasswd } from "../utils/encrypt.js";
import passport from "passport";
//********* /api/v1/current/

class UserRoutes {//no es un Router pero adentro tiene uno
  path = "/current";
  router = Router();
  api_version= API_VERSION;

  constructor() {
    this.initUserRoutes();
  }

  initUserRoutes() {//  api/v1/current/
    this.router.get(`${this.path}`, 
    [passportCall("jwt"), authorization("USER")],    
    (req, res) =>{      
        return res.send(req.user); 
    });
    // USER, ADMINS
    this.router.get(
        `${this.path}/:uid`, 
        handlePolicies(["USER", "ADMIN", "GOLD", "SILVER", "BRONCE"]),
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
      console.log("🚀 ~ file: user.routes.js:46 ~ UserRoutes ~ error:", error)
      } 
    });
    // TODO: eso solo deberia hacerlo el ADMIN
    this.router.delete(`${this.path}/:uid`,
    handlePolicies(["BRONCE"]),
    async (req,res)=>{
      try{
        const { uid } = req.params;
        const user = await userModel.findById(uid);

        if (!user) {
        return res.status(404).json({
        message: `user ${uid} info not found`,
        });
        }
        const userDel = await userModel.deleteOne({ id: uid });
        console.log(
            "🚀 ~ file: user.routes.js:50 ~ router.delete ~ userDel:",
            userDel
        );
        return res.json({ message: "user deleted" });
      } catch (error) {
      console.log("🚀 ~ file: user.routes.js:72 ~ UserRoutes ~ error:", error)
      }
    })

  }  
}
export default UserRoutes;

import { Router } from "express";
import userModel from "../dao/models/user.model.js";

import { passportCall } from "../utils/jwt.js";
import handlePolicies from "../middleware/handle-policies.middleware.js";

import { API_VERSION } from "../config/config.js";
import { createHashValue, isValidPasswd } from "../utils/encrypt.js";
import passport from "passport";
import { HttpResponse } from "../middleware/error-handler.js";
const httpResp  = new HttpResponse;
//********* /api/v1/current/

class UserRoutes {//no es un Router pero adentro tiene uno
  path = "/users";
  router = Router();
  api_version= API_VERSION;

  constructor() {
    this.initUserRoutes();
  }

  initUserRoutes() {//  api/v1/current/
    this.router.get(`${this.path}/current`, 
    [passportCall("jwt"), handlePolicies(["USER","ADMIN","PREMIUM"])],    
    (req, res) =>{      
        return res.send(req.user); 
    });
    // USER, ADMINS
    this.router.get(
        `${this.path}/:uid`, 
        handlePolicies(["USER", "ADMIN","PREMIUM", "GOLD", "SILVER", "BRONCE"]),
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
          } con ERROR: ${error.message}`);      
      } 
    });
    // TODO: eso solo deberia hacerlo el ADMIN
    this.router.delete(`${this.path}/current/:uid`,
    handlePolicies(["ADMIN"]),
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
        req.logger.info(
          `Method: ${req.method}, url: ${
            req.url
          } - time: ${new Date().toLocaleTimeString()
          } con userDel: ${userDel}`); 

        return res.json({ message: "user deleted" });
      } catch (error) {
        req.logger.fatal(
          `Method: ${req.method}, url: ${
            req.url
          } - time: ${new Date().toLocaleTimeString()
          } con ERROR: ${error.message}`); 
     
      }
    })
    this.router.get(//cambiar role de usuario  de premium  a user
      `${this.path}/premium/:uid`, 
      handlePolicies([ "ADMIN"]),
      async (req, res) =>{        
      try{
          const { uid } = req.params;
          const user = await userModel.findById(uid);
      
          if (!user) {
            return res.status(404).json({
              message: `user ${uid} info not found`,
            });
          }  
        if(user.role==="ADMIN") return httpResp.BadRequest(res,`user with uid: ${uid}, is ADMIN, not modified`,user.email);
          if(user.role==="PREMIUM") {
            user.role = "USER";
          } else{
              if(user.role==="USER") user.role = "PREMIUM" ;
            } ;
          let userUpdated = await userModel.findByIdAndUpdate({_id:uid},{role:user.role}); 
          userUpdated = await userModel.find({_id:uid}); 

        return httpResp.OK(res,`user with uid: ${uid}, updated successfully`,userUpdated);

    } catch (error) {
      req.logger.fatal(
        `Method: ${req.method}, url: ${
          req.url
        } - time: ${new Date().toLocaleTimeString()
        } con ERROR: ${error.message}`);      
    } 
  });

  }  
}
export default UserRoutes;

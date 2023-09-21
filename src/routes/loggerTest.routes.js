import { Router } from "express";
import { passportCall } from "../utils/jwt.js";
import handlePolicies from "../middleware/handle-policies.middleware.js";
import { API_VERSION } from "../config/config.js";


//********* /api/v1/loggerTest/

class LoggerTestRoutes {//no es un Router pero adentro tiene uno
  path = "/loggerTest";
  router = Router();
  api_version= API_VERSION;

  constructor() {
    this.initLoggerTestRoutes();
  }
  initLoggerTestRoutes() {//  api/v1/loggerTest/ 
    this.router.get(`${this.path}/error`, 
    [passportCall("jwt"), handlePolicies(["USER"])],    
    (req, res) =>{    
        req.logger.error(
          `Method: ${req.method}, url: ${
            req.url
          } - time: ${new Date().toLocaleTimeString()}`
        );
        return res.send("¡Prueba realizada. Revisar logger error!");  
    });
    this.router.get(`${this.path}/warning`, 
    [passportCall("jwt"), handlePolicies(["USER"])],    
    (req, res) =>{    
        req.logger.warning(
          `Method: ${req.method}, url: ${
            req.url
          } - time: ${new Date().toLocaleTimeString()}`
        );
        return res.send("¡Prueba realizada. Revisar logger warning!");  
    });
    this.router.get(`${this.path}/info`, 
    [passportCall("jwt"), handlePolicies(["USER"])],    
    (req, res) =>{    
        req.logger.info(
          `Method: ${req.method}, url: ${
            req.url
          } - time: ${new Date().toLocaleTimeString()}`
        );
        return res.send("¡Prueba realizada. Revisar logger info!");  
    });
    this.router.get(`${this.path}/http`, 
    [passportCall("jwt"), handlePolicies(["USER"])],    
    (req, res) =>{    
        req.logger.http(
          `Method: ${req.method}, url: ${
            req.url
          } - time: ${new Date().toLocaleTimeString()}`
        );
        return res.send("¡Prueba realizada. Revisar logger http!");  
    });
    this.router.get(`${this.path}/debug`, 
    [passportCall("jwt"), handlePolicies(["USER"])],    
    (req, res) =>{    
        req.logger.debug(
          `Method: ${req.method}, url: ${
            req.url
          } - time: ${new Date().toLocaleTimeString()}`
        );
        return res.send("¡Prueba realizada. Revisar logger debug!");  
    });
    
    this.router.get(
        `${this.path}/fatal`, 
        [passportCall("jwt"), handlePolicies(["USER"])],
        async (req, res) =>{        
        try{
            throw new Error(" - Error Fatal en GET , NOS TUMBA LA API");
      } catch (error) {
        req.logger.fatal(
          `Method: ${req.method}, url: ${
            req.url
          } - time: ${new Date().toLocaleTimeString()
          } con ERROR: ${error.message}`);          
      } finally {  
        return res.send("¡Prueba realizada. Revisar logger fatal!");
       }
    });
  }  
}
export default LoggerTestRoutes;

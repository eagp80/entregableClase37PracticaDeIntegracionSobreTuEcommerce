import { Router } from "express";
import { API_VERSION,EMAIL, PSW_MAIL } from "../config/config.js";
import passport from "passport";
import { passportCall } from "../utils/jwt.js";
import handlePolicies from "../middleware/handle-policies.middleware.js";
import nodemailer from "nodemailer";
import { HttpResponse } from "../middleware/error-handler.js";
const httpResp  = new HttpResponse;


const transporter = nodemailer.createTransport ({
    service: "gmail",
    user: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: EMAIL,
        pass: PSW_MAIL
    },
  })

class EmailRoutes {
  //algo
  path = "/mail";
  router = Router();

  constructor() {
    this.initEmailRoutes();
  }
  initEmailRoutes(){
    // ****** rutas directas ejemplo http://localhost:8000/api/v1/mail

    this.router.post(`${this.path}/send`, async (req, res) =>{
        const body = req.body;
        console.log("🚀 ~ file: email.routes.js:34 ~ EmailRoutes ~ this.router.post ~ body:", body)
        try {
            let result = await transporter.sendMail({
                from: EMAIL,
                to: body.email,
                subject: "sending mail with nodemail Efren",
                html: `
                <div> 
                    <h1>Email prueba Efren desde nodejs con nodemailer imagen de marketing</h1>
                    <img src = "cid:marketing" />
                </div>
                `,
                attachments: [
                  {
                    filename: "marketing.jpeg",
                    path: `${process.cwd()}` + `/src/public/img/marketing.jpeg`,
                    cid: "marketing",
                  },
                  {
                    filename: "products.json",
                    path: `${process.cwd()}` + `/files/products.json`,
                  },
                  {
                    filename: "rutas y vistas login.png",
                    path: `${process.cwd()}` + `/imagenes explicativas/rutas y vistas login.png`,
                  },
                ],
            })
            console.log("🚀 ~ file: email.routes.js:46 ~ EmailRoutes ~ this.router.post ~ result:", result)
            return res.send({ok: true, message: `email  send to ${body.email}`})
        } catch (error) {
          req.logger.fatal(
            `Method: ${req.method}, url: ${
              req.url
            } - time: ${new Date().toLocaleTimeString()
            } con ERROR: ${error.message}`);             
        }
    })
  }
}
export default EmailRoutes;

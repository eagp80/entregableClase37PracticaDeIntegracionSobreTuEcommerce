import jwt from "jsonwebtoken";
import passport from "passport";
import { SECRET_JWT } from "../config/config.js";


const generateJWT = (user) => {
  return new Promise((resolve, reject) => {
    jwt.sign({ user }, SECRET_JWT, { expiresIn: "30m" }, (err, token) => {
      if (err) {
        console.log(err);
        reject("can not generate jwt token");
      }
      resolve(token);
    });
  });
};

const cookieExtractor = (req) => {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies["token"];
  }

  return token;
};

const passportCall = (strategy) => {
  return async (req, res, next) => {
    passport.authenticate(strategy, { session: false }, function (err, user, info) {
      if (err) return next(err);

      if (!user) {
        return res.status(401).json({
          error: info.messages ? info.messages : info.toString(),
          message: `error in jwt***`,//ojo...
        });
      }
      req.user = user;
      next();
    })(req, res, next);
  };
};

export {
  generateJWT,
  SECRET_JWT,
  cookieExtractor,
  passportCall,
};

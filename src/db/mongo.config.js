import { connect } from "mongoose";

import { DB_HOST, DB_PORT, DB_NAME, DB_CNN } from "../config/config.js";

const configConnection = {  
  //url: `mongodb://127.0.0.1:27017/estudiantes`,
  url: DB_CNN ?? `mongodb://${DB_HOST}:${DB_PORT}/${DB_NAME}`,
  options: {
    useNewUrlParser: true,//parseo de la url automaticamente
    useUnifiedTopology: true,//topologia como son los nodos
  },
};

const mongoDBConnection = async () => {
  try {
    await connect(configConnection.url, configConnection.options);
    console.log(`==========CONNECCION CON MONGO REALIZADA=========== `);
    console.log(
      `=========== URL: ${configConnection.url.substring(0, 20)} =============`
    );
    console.log(`===================================================`);
  } catch (err) {
    console.log("🚀 ~ file: mongo.config.js:14 ~ mongoDBConnection ~ err:", err);
  }
};

export {
  mongoDBConnection,
};
import multer from "multer";
import __dirname from "../utils.js";

//donde voy a almacenar mis archivos??
const storage = multer.diskStorage({
    //Carpeta
    destination:function(req,file,cb){
        cb(null,`${__dirname}/public/img`)
    },
    filename: function(req,file,cb){
        cb(null,`${Date.now()}-${file.originalname}`)//mide en nano seg cuando se sube el archivo para evitar que dos personas que carguen un archivo con mismo nombre
    }//originalname indica que se mantiene el nombre inicial
})

const uploader = multer({
    storage, 
    limits: { fileSize: 2000000 },
    fileFilter: (req, file, cb) => {
      const filetypes = /jpeg|jpg|png|gif|PNG/;
      const mimetype = filetypes.test(file.mimetype);
      const extname = filetypes.test(file.originalname);
      if (mimetype && extname) {
        return cb(null, true);
      }
      return cb(new Error('Error: El archivo no es una imagen válida'));
    },});

export default uploader;
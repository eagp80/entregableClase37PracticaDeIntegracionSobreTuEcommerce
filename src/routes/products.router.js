import {Router} from "express";
import uploader from "../services/uploader.js";//salgo atras de routes y entro a services
import ProductManager from '../dao/managers/productManager.js'//salgo de routes y estare en src
const productManager = new ProductManager("files/products.json");//instancia vacia

const products =productManager.getProducts();//cargo los productos actuales del archivo
productManager.products=products;//refrescamiento en caso de reinicio del servidor

const ids = products.map(product => product.id);

// console.log("Arreglo con todos los ids disponibles de productos usando file-system:");
// console.log(ids);

if(products.length!=0){
    ProductManager.contador = Math.max(...ids)+1;
} else {ProductManager.contador =1};
//console.log(ProductManager.contador);
const router= Router(); //mini aplicativo para redirigirme a otros lugares

router.get('/', (req,res)=>{
    let limit=req.query.limit;
    let productsX= productManager.getProducts();
    
    if(limit){
        //enviar cantidad de productos igual a limit
        let arr=[];
        for(let i=0; i<limit; i++){
            arr.push(productsX[i]);                         
        }
        res.send({products:arr});
    }
    else{
        //enviar arreglo de productos completo
        res.send({products:productsX}); 
    }
       
})


router.get('/:pid', (req,res)=>{
    const pid=req.params.pid;
    let producto= productManager.getProductById(pid); 
    if(!producto){
        res.send({error:"El producto no existe."});
    }   
    else {res.send({producto:producto})}; 
})
//al no existir el id del producto, debe devolver un objeto
// con un error indicando que el producto no existe.

router.post('/',uploader.single('image'), (req,res)=>{
    //con este metodo solicitamos crear producto
    const {title, description, code,price,status, stock, category, thumbnails, image} = req.body;       
    productManager.addProduct(title, description, code,price,status, stock, category, thumbnails);
    res.send({status:"ok", message :"Producto añadido" });

})// falta revisar si se guarda formatos de arreglo de thumbnails y formatos numnber, true y string
router.put('/:pid',uploader.single('image'), (req,res)=>{
    //con este metodo solicitamos actualizar producto
    const pid=req.params.pid;
    const {title, description, code,price,status, stock, category, thumbnails, image} = req.body; 

    productManager.updateProduct(pid,{title, description, code,price,status, stock, category, thumbnails});
    res.send({status:"ok", message :`Producto con id: ${pid}, actualizado`});  
})
router.delete('/:pid', (req,res)=>{
    //con este metodo solicitamos borrar producto
    const pid=req.params.pid;
    productManager.deleteProduct(pid);
    res.send({status:"ok", message :`Producto con id: ${pid}, eliminado`});
       
})


export default router; 
import {Router} from "express";
import uploader from "../services/uploader.js";
import CartManager from "../dao/managers/cartManager.js";
import { HttpResponse } from "../middleware/error-handler.js";
const httpResp  = new HttpResponse;

const cartManager = new CartManager("files/carts.json");
const carts =cartManager.getCarts();
cartManager.carts=carts;

const ids = carts.map(cart => cart.id);

// console.log("Arreglo con todos los ids disponibles de carritos usando file-system:");
// console.log(ids);

if(carts.length!=0){
    CartManager.contador = Math.max(...ids)+1;
} else {CartManager.contador =1};

const router=Router();

router.get('/:cid', (req,res)=>{
    const cid=req.params.cid;
    let cart= cartManager.getCartById(cid); 
    if(!cart){
        return httpResp.Error(res,{error:"El carrito no existe."} , cid);

       // res.send({error:"El carrito no existe."});
    }   
    else {    
        return httpResp.OK(res,`Productos en carrito con id: ${cid}`, {productos:cart.products});    
        //res.send({productos:cart.products})};//envia productos dentro de carrito con id especificado 
    }
})


router.post('/',(req,res)=>{//si son varios archivos uploader.array('nombre de campos') se almacena en req.files
    const result= cartManager.addCart();
    return httpResp.OK(res,"Carrito añadido (con array de productos vacío)", {result:result});    

    //res.send({status:"ok", message :"Carrito añadido (con array de productos vacío)" });

})

router.post('/:cid/product/:pid', (req,res)=>{
        //con este metodo solicitamos agregar producto pid a carrito cid
        const cid = req.params.cid;
        const pid = req.params.pid;       
       
        const result = cartManager.updateCart(cid,pid);
        return httpResp.OK(res,`Producto ${pid} añadido al carrito ${cid}`, {result:result}); 
        //res.send({status:"ok", message :`Producto ${pid} añadido al carrito ${cid}`});    
    })

router.put('/:cid', (req,res)=>{
    //este metodo no se utiliza
       
})
router.delete('/', (req,res)=>{
    //este metodo no se utiliza
       
})

export default router; 
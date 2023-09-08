import {Router} from "express";
import ProductManager from '../dao/managers/productManager.js';


const productManager = new ProductManager("files/products.json");
const products =productManager.getProducts();
productManager.products=products;


const router= Router();

router.get('/',(req,res)=>{
    res.render('home', {products})
});

router.get('/realtimeproducts', (req, res) => {
    res.render('realTimeProducts', {products})
})

export default router;


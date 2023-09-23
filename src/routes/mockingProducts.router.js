import { Router } from "express";
import { generateProduct } from "../utils/generate-products.js";


class MockingProductsRoutes {
path= "/mockingproducts";
router = Router();

constructor() {
  this.initMockingProductsRoutes();
}
initMockingProductsRoutes(){
  this.router.get(`${this.path}`, async (req, res) => {
    let products = [];
    for (let index = 0; index < 50; index++) {
      products.push(generateProduct());
    }
  
    return res.json({
      message: `generate products`,
      products,
    });
  });
}

}

// router.get("/", async (req, res) => {
//   let products = [];
//   for (let index = 0; index < 50; index++) {
//     products.push(generateProduct());
//   }

//   return res.json({
//     message: `generate products`,
//     products,
//   });
// });

export default MockingProductsRoutes;
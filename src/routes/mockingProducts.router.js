import { Router } from "express";
import { generateProduct } from "../utils/generate-products.js";

const router = Router();

router.get("/", async (req, res) => {
  let products = [];
  for (let index = 0; index < 50; index++) {
    products.push(generateProduct());
  }

  return res.json({
    message: `generate products`,
    products,
  });
});

export default router;
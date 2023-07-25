import { Router } from "express";
import { createProductMock } from "../mocks/ProductMock.js";

const mocksRouter = Router()

async function getProductMocksController(req,res) {
    try {
        const products = []
        for (let index = 0; index < 100; index++) {
            let product = createProductMock()
            products.push(product)
        }
        res.json(products)
    } catch (error) {
        throw new Error(` ${error.message} --> getProductsController -- mocks.router.js`)
    }
}

mocksRouter.get("/", getProductMocksController)
export default mocksRouter;
import { Router } from "express";
import { addProductController, deleteProductController, productsController, updateProductController } from "../controllers/api/products.controller.js";
import { autenticacionJwtApi } from "../middlewares/passport.js";
import { RoleAuth, RoleAuthMany } from "../middlewares/soloLogueados.js";

//se crea un Router
const routerProducts = Router();


routerProducts.get("/", autenticacionJwtApi,  productsController); // Devuelve La lista de productos existentes en la coleccion products

// routerProducts.get("/:pid", productByIdController); //devuelve un producto Seleccionado mediante su id

routerProducts.post("/", autenticacionJwtApi, RoleAuthMany(["admin", "premium"]), addProductController); //agrega un producto a la coleccion de "products"

routerProducts.put("/:pid", autenticacionJwtApi, RoleAuth(["admin"]), updateProductController); // actualiza un producto de la coleccion de "products" de la base de datos

routerProducts.get("/:pid", 
autenticacionJwtApi, 
RoleAuth(["admin", "premium"]), 
deleteProductController); // Elimina un producto de la coleccion "products"

export default routerProducts;

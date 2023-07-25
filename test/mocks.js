import { createProductMock } from "../src/mocks/ProductMock.js";

const products = []


for (let index = 0; index < 50; index++) {
    let product = createProductMock()
    products.push(product)
}

console.log(products);
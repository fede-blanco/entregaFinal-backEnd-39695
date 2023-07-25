import Product from "../models/Product.js";
import { faker } from "@faker-js/faker";

export function createProductMock() {
    return new Product({
        title: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        price: faker.number.int({min: 1000, max: 100000}),
        thumbnails: [],
        code: faker.string.alphanumeric(8),
        stock: faker.number.int({max: 1000}),
        category: faker.commerce.department(),
        //status inicializa true
        status: true,
    })
}


export class AddProductError extends Error {
    constructor(product) {
        const mensaje = `Error al agregar producto en la base de datos.
        List of required properties:
        * title: needs to be a String, recieved ${product.title}
        * description: needs to be a String, recieved ${product.description}
        * price: needs to be a String, recieved ${product.price}
        * thumbnails: needs to be a String, recieved ${product.thumbnails}
        * code: needs to be a String, recieved ${product.code}
        * stock: needs to be a String, recieved ${product.stock}
        * category: needs to be a String, recieved ${product.category}
        * status: needs to be a String, recieved ${product.status}
        `
        super(mensaje);
        this.tipo = 'ADD_PROD_ERROR';
    }
}
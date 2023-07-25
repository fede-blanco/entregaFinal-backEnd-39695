//Modelo de cart

export default class Cart {
  products;
  cartOwner;

  constructor( cartOwner, products) {
    this.cartOwner = cartOwner
    if (products === undefined) {
      this.products = [];
    } else {
      this.products = products;
    }
    }
}
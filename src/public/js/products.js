const productsAddToCartButtons2 = document.querySelectorAll(
  ".products-add-to-cart-btn"
)
if (productsAddToCartButtons2) {
  productsAddToCartButtons2.forEach((button) => {
    // Agrega un evento click a cada boton
    button.addEventListener("click", async () => {
      // Obtiene el id del producto desde el boton
      const productId = button.id
      const cartId = document.querySelector(".products-cart").id

      // se hace fetch a la api que crea productos
      fetch(`/api/carts/${cartId}/products/${productId}`, {
        method: "POST",
      }).then((response) => {
        if (response.status === 201) {
          const savedProduct = response.json()
        }
      })
    })
  })
}

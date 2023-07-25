
const cartDeleteFromCartButtons = document.querySelectorAll(
    ".cart-delete-from-cart-btn"
  )
  if (cartDeleteFromCartButtons.length > 0) {
    cartDeleteFromCartButtons.forEach((button) => {
        button.addEventListener("click", async () => {
        const cart = document.querySelector(".cart-cart")
        const cartId = cart.id
        const productId = button.id

        // se hace fetch a la api que crea productos
        fetch(`/api/carts/${cartId}/products/${productId}`, {
            method: 'DELETE',
        })
        .then(response => {
          if (response.status === 201) {
            const savedProduct = response.json()
        }
        })
      })
    })
  }


const purchaseCartButton = document.querySelector(".purchase-button")
if (purchaseCartButton){
    purchaseCartButton.addEventListener("click",async  (e) => {
        const cartId = e.target.id

        try {

            const response = await fetch(`/api/carts/${cartId}/purchase`, {
                method: 'POST',
            });

            if (response.status === 201) {
                const payload = await response.json()
                window.location.replace(`/carts/${cartId}`)
            } else {
                console.log("Hubo un error en el fetch a 'purchase'");
            }
        } catch (error) {
            throw new Error(`Error en  - cartview.js + ${error}`)
        }
    })
}
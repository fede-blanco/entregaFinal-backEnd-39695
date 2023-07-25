
//por defecto io toma como parametro la misma ruta que la pagina que esta cargando
// const socket = io("http://localhost:8080/");
const socket = io()

const buttonAdd = document.querySelector("#btn-add")
if (buttonAdd) {
  buttonAdd.addEventListener("click", (e) => {
    // ----- VALIDACIONES
    let actualStatus = false
    if (document.querySelector("#status-add").checked) {
      actualStatus = true
    }
    let thumbnails = []
    if (!document.querySelector("#thumbnails-add").value === "") {
      thumbnails = thumbnails.push(
        document.querySelector("#thumbnails-add").value
      )
    }

    //---Objeto obtenido del formulario
    const prod = {
      title: document.querySelector("#title-add").value,
      description: document.querySelector("#description-add").value,
      price: parseFloat(document.querySelector("#price-add").value),
      thumbnails: thumbnails,
      code: document.querySelector("#code-add").value,
      stock: parseInt(document.querySelector("#stock-add").value),
      category: document.querySelector("#category-add").value,
      status: actualStatus,
    }

    // se hace fetch a la api que crea productos
    fetch('/api/products/', {
        method: 'POST',
        body: JSON.stringify(prod),
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
      if (response.status === 201) {
        const savedProduct = response.json()
    }
    })


    //se resetean los inputs del formulario
    document.querySelector("#title-add").value = ""
    document.querySelector("#description-add").value = ""
    document.querySelector("#price-add").value = ""
    document.querySelector("#code-add").value = ""
    document.querySelector("#stock-add").value = ""
    document.querySelector("#category-add").value = ""

    // ---se envia el producto obtenido del formulario
    // Se en via prod pero no se usa
    socket.emit("addProduct", prod)
  })
}

const buttonUpdate = document.querySelector("#btn-update")
if (buttonUpdate) {
  buttonUpdate.addEventListener("click", (e) => {
    //validamos que si no se ingresa un id de algun producto para identificarlo te alerta
    if (!document.querySelector("#id-update").value) {
      alert("No se ingreso ningun id de producto a modificar")
    } else {
      // ----- VALIDACIONES
      let actualStatus = false
      if (document.querySelector("#status-update").checked) {
        actualStatus = true
      }
      //inicializamos el producto que se obtendrá del formulario para luego ir completándolo dinámicamente
      let prod = {}

      if (document.querySelector("#id-update").value) {
        prod = { ...prod, id: document.querySelector("#id-update").value }
      }
      if (document.querySelector("#title-update").value) {
        prod = { ...prod, title: document.querySelector("#title-update").value }
      }
      if (document.querySelector("#description-update").value) {
        prod = {
          ...prod,
          description: document.querySelector("#description-update").value,
        }
      }
      if (document.querySelector("#price-update").value) {
        prod = { ...prod, price: document.querySelector("#price-update").value }
      }
      if (document.querySelector("#thumbnails-update").value) {
        prod = {
          ...prod,
          thumbnails: document.querySelector("#thumbnails-update").value,
        }
      }
      if (document.querySelector("#code-update").value) {
        prod = { ...prod, code: document.querySelector("#code-update").value }
      }
      if (document.querySelector("#stock-update").value) {
        prod = { ...prod, stock: document.querySelector("#stock-update").value }
      }
      if (document.querySelector("#category-update").value) {
        prod = {
          ...prod,
          category: document.querySelector("#category-update").value,
        }
      }
      if (document.querySelector("#status-update").checked) {
        prod = { ...prod, status: actualStatus }
      }

      //se resetean los inputs del formulario
      document.querySelector("#id-update").value = ""
      document.querySelector("#title-update").value = ""
      document.querySelector("#description-update").value = ""
      document.querySelector("#price-update").value = ""
      document.querySelector("#thumbnails-update").value = ""
      document.querySelector("#code-update").value = ""
      document.querySelector("#stock-update").value = ""
      document.querySelector("#category-update").value = ""

      // ---se envia el producto obtenido edel formulario
      socket.emit("updateProduct", prod.id, prod)
    }
  })
}

const buttonDelete = document.querySelector("#btn-delete")
const currentUserId = document.querySelector("#id-current-user")
if (buttonDelete) {
  buttonDelete.addEventListener("click", (e) => {
    //validamos que si no se ingresa un id de algun producto para identificarlo te alerta
    if (!document.querySelector("#id-delete").value) {
      alert("ingresar el id de un producto existente para Eliminarlo")
    } else {
      const productId = document.querySelector("#id-delete").value
      socket.emit("deleteProduct", {productId, currentUserId})
      document.querySelector("#id-delete").value = ""
    }
  })
}

const deleteFromCartButtons = document.querySelectorAll(".delete-from-cart-btn")
if (deleteFromCartButtons) {
  deleteFromCartButtons.forEach((button) => {
      button.addEventListener("click", async (e) => {
          const productId = e.target.id
          const cartId = document.querySelector(".cart").id
        //   console.log("********  linea 135 - index.js ********");
        //   console.log(cartId);
        //   console.log(productId);
        //   console.log("********  linea 138 - index.js ********");
      socket.emit("deleteProductFromCart", {cartId: cartId,  productId: productId})
    })
  })
}

const addToCartButtons = document.querySelectorAll(".realtime-products-add-to-cart-btn")
if (addToCartButtons) {
  addToCartButtons.forEach((button) => {
    // Agrega un evento click a cada boton
    button.addEventListener("click", async () => {
    // Obtiene el id del producto desde el boton
    const productId = button.id
    const cartId = document.querySelector(".cart").id

    // se hace fetch a la api que crea productos
    fetch(`/api/carts/${cartId}/products/${productId}`, {
        method: 'POST',
    })
    .then(response => {
      if (response.status === 201) {
        const savedProduct = response.json()
    }
    })

      // ---se envia el producto obtenido edel formulario
      socket.emit("addProductToCart", {cartId: cartId,  productId: productId})
    })
  })
}

socket.on("updateProductsList", (prodListItems) => {
  const productList = document.getElementById("product-list")
  const viewProductList = document.getElementById("view-product-list")

  // Se crea una variable donde se ira guardando el código HTML de la vista de la lista de los productos
  let htmlList = ""

  // Por cada producto se crea un item y se agrega a la lista
  prodListItems.forEach((product) => {
    const item = `<li id=${product._id}>
    <div>
    <strong class="prod-title">${product.title}</strong>
    <br />
    <strong>Price:</strong> $${product.price}
    <br />
    <strong>Description:</strong> ${product.description}
    <br />
    <strong>Category:</strong> ${product.category}
    <br />
    <strong>Id:</strong> ${product._id}
    </div>
    <div class="add-to-cart-btn-container">
    <button id=${product._id} class="add-to-cart-btn realtime-products-add-to-cart-btn">Agregar al carrito</button>
    </div>
    </li>`
    htmlList = htmlList + item
  })

  // Se agrega toda la vista de la lista de los productos al innerHTML
  productList.innerHTML = htmlList
  viewProductList.innerHTML = htmlList

  const productsAddToCartButtons = document.querySelectorAll(".realtime-products-add-to-cart-btn")

  if (productsAddToCartButtons.length > 0) {
    addToCartButtons.forEach((button) => {
      // Agrega un evento click a cada boton
      button.addEventListener("click", async () => {
        // Obtiene el id del producto desde el boton
        const productId = button.id
        const cartId = document.querySelector(".cart").id

        // ---se envia el producto obtenido del formulario
        socket.emit("addProductToCart", {cartId: cartId,  productId: productId})
      })
    })
  }
})

socket.on("updateCartList", (cartResponse) => {
  const cartList = document.getElementById("cart-list")
  // Se crea una variable donde se ira guardando el código HTML de la vista de la lista de los productos
  let htmlList = ""

  // Por cada producto se crea un item y se agrega a la lista
  cartResponse.payload.forEach((product) => {
    const item = `<li id=${product.product._id}>
    <div>
    <strong class="prod-title">${product.product.title}</strong>
    <br />
    <strong>Price:</strong> $${product.product.price}
    <br />
    <strong>Description</strong>: ${product.product.description}
    <br />
    <strong>Category</strong>: ${product.product.category}
    <br />
    <strong>Id</strong>: ${product.product._id}
    <br />
    <strong>Quantity</strong>: ${product.quantity}
    </div>
    <div class="delete-from-cart-btn-container">
    <button id=${product.product._id} 
    class="delete-from-cart-btn">Eliminar</button>
    </div>
    </li>`
    htmlList = htmlList + item
  })

    // Se agrega toda la vista de la lista de los productos al innerHTML
    cartList.innerHTML = htmlList

  const deleteFromCartButtons = document.querySelectorAll(
    ".delete-from-cart-btn"
  )
  if (deleteFromCartButtons.length > 0) {
    deleteFromCartButtons.forEach((button) => {
        button.addEventListener("click", async (e) => {
        const cartId = button.dataset.cartId;
        const productId = button.id
        socket.emit("deleteProductFromCart", {cartId: cartId,  productId: productId})
      })
    })
  }
})

//--------------------  CHAT  ------------------------
socket.on("messageLogs", data => {
  let log = document.getElementById("messageLogs");
  let messages = "";
  data.forEach(message => {
    messages = messages +`<span style="line-height:1.5rem"><strong>${message.user}</strong> dice:  ${message.message}</span></br>`
  })
  log.innerHTML = messages;
})





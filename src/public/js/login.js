const loginForm = document.getElementById("login-form")

if (loginForm instanceof HTMLFormElement) {
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault()
        //Forma rapida de crear un objeto con los datos clave/valor que se obtienen de un formulario. //| improtante que los inputs tengan atributo "name" que es el que utilizará para darle la clave a la propiedad del objeto creado
        const data = new FormData(loginForm)
        const obj = {}
        data.forEach((value, key) => (obj[key] = value))

        fetch('/api/sessions/login', {
            method: 'POST',
            body: JSON.stringify(obj),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        
        .then(response => {
          if (response.status === 201) {
            window.location.replace('/products')
        }
        })
    })
}


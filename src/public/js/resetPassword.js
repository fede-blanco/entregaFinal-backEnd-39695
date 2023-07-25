const resetPasswordEmailForm = document.getElementById("reset_email_form")

// "instanceof" es un operador de javascript que me dice si una variable tiene un valor que es "instancia" de alguna clase en particular. En este caso queremos saber si esto que encontro es una instancia de HTMLFormElement.
if (resetPasswordEmailForm instanceof HTMLFormElement) {
    resetPasswordEmailForm.addEventListener("submit", (e) => {
        e.preventDefault()

        const data = new FormData(resetPasswordEmailForm)
        const obj = {}

        //Porcada objeto /key/value que se crea dentro de la instancia de "FormData" se agrega una propiedad con el nombre de la "key" y el valor del "value" obtenido
        data.forEach((value, key) => (obj[key] = value))

        // Hago la peticion fetch "post" con los datos del formulario a la ruta /api/usuarios
        fetch("api/users/resetPassword", {
            method: "POST",
            body: JSON.stringify(obj),
            headers: {
                "content-type": "application/json"
            }
        })
        .then(result => {
            if (result.status === 201) {
                window.location.replace("/login")
            }
        })
    })
}


const resetPasswordForm = document.getElementById("reset_password_form")
const token = document.querySelector(".form-token").id
const email = document.querySelector(".reset-pass-user-email").id

// En este caso queremos saber si esto que encontro es una instancia de HTMLFormElement.
if (resetPasswordForm instanceof HTMLFormElement) {
    resetPasswordForm.addEventListener("submit", (e) => {
        e.preventDefault()
        const data = new FormData(resetPasswordForm)
        const obj = {}

        //Porcada objeto /key/value que se crea dentro de la instancia de "FormData" se agrega una propiedad con el nombre de la "key" y el valor del "value" obtenido
        data.forEach((value, key) => (obj[key] = value))
        

        // Hago la peticion fetch "post" con los datos del formulario a la ruta /api/usuarios
        fetch(`api/users/resetPasswordConfirm?token=${token}&email=${email}`, {
            method: "POST",
            body: JSON.stringify(obj),
            headers: {
                "content-type": "application/json"
            }
        })
        .then(result => {
            if (result.status === 201) {
                window.location.replace("/login")
            }
        })
    })
}

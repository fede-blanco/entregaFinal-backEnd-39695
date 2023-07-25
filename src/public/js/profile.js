const endSession = document.getElementById("end-session-btn")

if(endSession) {
  endSession.addEventListener("click", (e) => {
          e.preventDefault()

          fetch('/api/sessions/logout')
            .then(result => {
                if (result.status === 200) {
                    window.location.replace('/login')
                }
            })
    })
}

// En este caso se repite la misma funcionalidad solo cambiando el selector al boton de "cerrar sesión" que esta en la vista products en vez de el que esta en profile para tenerlos separados por si hay que hacer algun cambio
const endSession2 = document.getElementById("end-session-btn-products")

if(endSession2) {
  endSession2.addEventListener("click", (e) => {
          e.preventDefault()
          
          fetch('/api/sessions/logout')
            .then(result => {
                if (result.status === 200) {
                    window.location.replace('/login')
                }
            })
    })
}



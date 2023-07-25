

// --------------------   CHAT   ---------------------
let chatBox = document.getElementById("chatbox");
let user;

Swal.fire({
  title: "Identificate",
  input: "text",
  text: "Ingrtesa tu nombre para el chat",
  inputValidator: (value) => {
    return !value && "¡Necesitas elegir un nombre para continuar!"
  },
  allowOutsideClick:false
}).then(result => {
  // La notificacion captura el nombre y lo guarda en "user"
  user = result.value
  let userNikName = document.getElementById("userNikName");
  userNikName.innerText = user;
})

chatBox.addEventListener('keyup', evt => {
  if(evt.key === "Enter"){
    if(chatBox.value.trim().length>0){
      socket.emit("message", {user:user, message:chatBox.value});
      chatBox.value = "";
    }
  }
})

//-----------------------------------------------------
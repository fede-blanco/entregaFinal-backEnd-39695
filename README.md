# entregaFinal-backEnd-39695
Este repositorio contiene el proyecto completo para la entrega final del curso de Back-End de Coderhouse, camada 39695

## Descripción
Servidor de una aplicación estilo E-commerce, desarrollado con **"express"** y complementado con un front simple con **"handlebars"**.

Utiliza tecnologías como **"bcrypt", "cookie-parser", "jsonWebToken" y "passport"** para el manejo y seguridad de usuarios y sesiones y cookies.

Se utilizar **"socket.io"** para la vista de formularios y el chat general y **nodemailer** para el servicio de mensajería.

La persistencia persistencia esta realizada con **"MongoDb"** y **Mongoose**.

### cuenta con:
- Cuenta con autenticación de usuario con diferenciación de roles.
- Vista de productos disponibles.
- Vista con formularios para agregar, modificar y eliminar productos. (solo rol "Admin")
- Carrito de compras.
- Chat general para la comunidad de usuarios que este simultáneamente conectada.
- Servicio de mansajería con notificaciones vía E-mail para cuestiones puntuales de la aplicación.
- Sistema de reestablecimiento de contraseña.
- Documentación parcial dce la API con **Swagger**
- Sistema de Logs persistente con **Winston**


## Link al despliegue
https://entregafinal-backend-39695-production.up.railway.app/login

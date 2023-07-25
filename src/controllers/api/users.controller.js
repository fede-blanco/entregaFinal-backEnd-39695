import { User } from "../../models/User.js"
import { cartsService } from "../../services/carts.service.js"
import { emailService } from "../../services/email.service.js"
import { usersService } from "../../services/users.service.js"
import { createHash, encriptarJWT } from "../../utils.js"


//Funcion que Controla la acción de la url (POST) "/api/users/register"
export async function registerUserController(req, res, next) {
  const {
    first_name,
    last_name,
    email,
    age,
    password,
    role = "user",
  } = req.body
  //Luego le vendria bien agregar una capa mas de seguridad con capa de "services" y manager
  const exists = await usersService.getUserByEmail(email)

  if (exists)
    return res
      .status(400)
      .send({ status: "error", error: "User already exists" })
      .redirect("/login")

  //Si el email y la pass coinciden con los indicados se crea una propiedad con valor "admin", sino se crea con valor "user"
  let userRole
  if (email === "adminCoder@coder.com" && password === "adminCod3r123") {
    userRole = "admin"
  } else {
    userRole = "user"
  }
  //se crea el objeto tipo User
  const user = new User({
    first_name,
    last_name,
    email,
    age,
    password: createHash(password),
    role: userRole,
  })

  let addedUser = await usersService.addUser(user)

  let createUserCart = await cartsService.addCart(addedUser._id)

  let savedUserCart = await cartsService.getCartByOwnerId(addedUser._id)

  //Es importante que la guardar con el mismo nombre (jwt_authorization) que despues la vamos a buscar
  res.cookie("jwt_authorization", encriptarJWT(addedUser), {
    signed: true,
    httpOnly: true,
  })

//   Se envia un email de bienvenida
  await emailService.send({
    receiver: addedUser.email,
    message: `Hola ${first_name} ${last_name}!! \n\nBienvenido a la aplicación de federico Blanco!! \n\nEste mail es solo una notificación de que el usuario con el mail ${email} se registró exitosamente.`,
  })

  res.status(201).json(addedUser)
}


//Funcion que Controla la acción de la url (GET) "/api/users"
export async function getUsersController(req, res, next) {
  const usersDtos = []
  try {
    const users = await usersService.getUsers()
    users.map((user) => {
        //Por cada usuario se crea un DTO
      {
        const userDto = {
          _id: user?._id,
          first_name: user?.first_name,
          last_name: user?.last_name,
          email: user?.email,
          age: user?.age,
          last_connection: user?.last_connection || "not-registered",
          role: user?.role,
        }
        usersDtos.push(userDto)
      }
    })
    console.log(usersDtos)
  } catch (error) {
    throw new Error("Error en 'api/users/' -- GET")
  }
//   se devuelven los dto's de los usuarios
  res.json(usersDtos)
}


//Funcion que Controla la acción de la url (GET) "/api/users/premium/:uid"
export async function getPremiumUserController(req, res, next) {
    const userId = req.params.uid
    // se busca el usuario a modificar
    const user = await usersService.getUserById(userId)
    //se le invierte el rol
    if (user.role == "user") {
      user.role = "premium"
    } else if (user.role == "premium") {
      user.role = "user"
}
    // Se modifica el usuario en la base de datos
  await usersService.updateUserById(userId, user)

  res.json(user)
}

//Funcion que Controla la acción de la url (POST) "/api/users/resetPassword"
export async function resetPasswordController(req, res, next) {
  const userEmail = req.body.email
  const user = await usersService.getUserByEmail(userEmail)
  const userId = user._id
  const resetTokenObtained = await usersService.obtainTokenForPassUpdate(userId)
  return resetTokenObtained
}

//Funcion que Controla la acción de la url (POST) "/api/users/resetPasswordConfirm"
export async function resetPasswordconfirmController(req, res, next) {
  const token = req.query.token
  const password = req.body.password
  const email = req.query.email

//   Se obtiene el usuario
  const user = await usersService.getUserByEmail(email)
  const userId = user._id

    
  const userWithUpdatedPassword = await usersService.updateUserPassword(
    userId,
    password,
    token
  )

  return res.status(201).json(userWithUpdatedPassword)
}


//Funcion que Controla la acción de la url (DELETE) "/api/users/pruebaDelete"
export async function deleteUsersController(req, res, next) {

  try {
    const now = new Date()
    // const now = new Date('2023-07-15');
    
    const dias = 2
    const diasEnMilisegundos = dias * 24 * 60 * 60 * 1000
    const fechaLimite = now - diasEnMilisegundos

    const allUsers = await usersService.getUsers()
    // Se crea una lista con todos los usuarios inactivos
    const inactiveUsers = allUsers.filter((user) => {
        if (user.last_connection < fechaLimite) {
            return user
        }
    })
    // por cada usuario en la lista de inactivos se envia un mail y se elimina el mismo
    inactiveUsers.forEach(async (inactiveUser) => {
        const userId = inactiveUser?._id
        // console.log(userId);
        const emailOptions = {
            receiver: inactiveUser?.email,
            subject: "CUENTA ELIMINADA POR INACTIVIDAD",
            message: `Usuario "${inactiveUser?.email}", Su cuenta ha sido eliminada por inactividad`,
        }
        await emailService.send(emailOptions)
        await usersService.deleteUserById(userId)
    })
    res.status(201).json({
        allUsers: allUsers,
        inactiveUsers: inactiveUsers,
      })
  } catch (error) {
    throw new Error("Error en 'api/users/' -- DELETE")
  }

  
}

//Funcion que Controla la acción de la url (DELETE) "/api/users/:uid"
export async function deleteUserByIdController(req,res,next) {
    try {
        const userId = req.params.uid
        const deletedUser = await usersService.deleteUserById(userId)
        res.json(deletedUser)
    } catch (error) {
        throw new Error("Error en 'api/users/:uid' -- DELETE")
    }
}

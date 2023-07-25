import { v4 as uuidv4 } from "uuid";

// Obtener la fecha y hora actual
const fechaHoraActual = new Date();

// Obtener los componentes de la fecha y hora
const dia = fechaHoraActual.getDate();
const mes = fechaHoraActual.getMonth() + 1; // Los meses comienzan desde 0 (enero = 0)
const anio = fechaHoraActual.getFullYear();
const hora = fechaHoraActual.getHours();
const minutos = fechaHoraActual.getMinutes();
const segundos = fechaHoraActual.getSeconds();

// Función auxiliar para agregar un cero a la izquierda si el número es de un solo dígito
function padLeft(numero) {
  return numero.toString().padStart(2, '0');
}

// Formatear los componentes en un string con el formato deseado
const DateNHourString = `${padLeft(dia)}/${padLeft(mes)}/${padLeft(anio.toString().slice(-2))}-${padLeft(hora)}:${padLeft(minutos)}:${padLeft(segundos)}`;

export default class Ticket {
  constructor(amount, purchaserEmail) {
    this.code = uuidv4()
    this.purchase_datetime = DateNHourString
    this.amount = amount
    this.purchaser = purchaserEmail
  }
}
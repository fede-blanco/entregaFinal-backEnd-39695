import { winstonLogger } from "../middlewares/winstonLogger.js";
import Ticket from "../models/Ticket.js";
import { ticketsRepository } from "../repositories/tickets.repository.js";
import { cartsService } from "./carts.service.js";
import { productsService } from "./products.service.js";


class TicketsService {

  async addTicket(cartId, userEmail){
    try {
        const cart = await cartsService.getCartById(cartId)
        let amount = 0;
        let productsIds = []
        cart.products.forEach(async (p) => {
            // console.log(p);
            if (p.quantity <= p.product.stock) {
              let finalStock = p.product.stock - p.quantity

              let totalPrice = p.quantity * p.product.price
              amount = amount + totalPrice;

              let updatedProduct = await productsService.updateProduct(p.product._id, {stock: finalStock})

              let updatedCart = await cartsService.deleteFullProductFromCart(cartId,p.product._id)

            } else {
                const productId = p.product._id
                productsIds.push(productId)
            }
        });
        
        if (amount > 0) {
          const ticket = new Ticket(amount, userEmail)
          const addedTicket = await ticketsRepository.addTicket(ticket)
          winstonLogger.info(`Ticket creado: ${addedTicket.code} -- - ${new Date().toLocaleTimeString()}`)
          return {productsIds, addedTicket};
        } else {
            winstonLogger.warning(`Se intento hacer una compra sin productos`)
          return {productsIds, addedTicket};
        }
    
    } catch (error) {
        winstonLogger.error(`Error en addTicket -- tickets.service.js ---> ${error}`)
      throw new Error(`Error en addTicket -- tickets.service.js ---> ${error}`)
    }
  }

  async getTicketByEmail(email){
    try {
        const ticketFound = await ticketsRepository.getTicketByEmail(email);
        return ticketFound;
    } catch (error) {
        winstonLogger.error(`Error en getTicketByEmail -- tickets.service.js ---> ${error}`)
        throw new Error(`Error en getTicketByEmail -- tickets.service.js ---> ${error}`)
    }
  }

  async getTickets(){
    try {
      const tickets = await ticketsRepository.getTickets()
      return tickets;
    } catch (error) {
      winstonLogger.error(`Error en getTickets -- tickets.service.js ---> ${error}`)
      throw new Error (`Error en getTickets -- tickets.service.js ---> ${error}`)
    }
  }

  async deleteTicketById(ticketId){
    try {
      return await ticketsRepository.deleteTicketById(ticketId)
    } catch (error) {
      winstonLogger.error(`Error en deleteTickerByEmail -- tickets.service.js ---> ${error}`)
      throw new Error(`Error en deleteTickerByEmail -- tickets.service.js ---> ${error}`)
    }
  }
}

export const ticketsService = new TicketsService()
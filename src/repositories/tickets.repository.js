import { ticketManager } from "../managers/TicketManager.js";

class TicketsRepository {

  async addTicket(ticket){
    try {
       const addedTicket = await ticketManager.addTicket(ticket)
          return addedTicket;
        } catch(err) {
          throw new Error(`Error en addTicket - ticketRepository -- ${err}`);
        }
  }

  async getTicketByEmail(email){
    try {
        const ticketFound = await ticketManager.getTicketByEmail(email);
        return ticketFound;
    } catch (error) {
        throw new Error(`Error en getTicketByEmail -- tickets.repository.js ---> ${error}`)
    }
  }

  async getTickets(){
    try {
      const tickets = await ticketManager.getTickets()
      return tickets;
    } catch (error) {
      throw new Error (`Error en getTickets -- tickets.repository.js ---> ${error}`)
    }
  }

  async deleteTicketById(ticketId){
    try {
      return await ticketManager.deleteTicketById(ticketId)
    } catch (error) {
      throw new Error(`Error en deleteTickerByEmail -- tickets.repository.js ---> ${error}`)
    }
  }

}

export const ticketsRepository = new TicketsRepository()
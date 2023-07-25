import ticketModel from "../models/Ticket.model.js"


class TicketManager {
  constructor(ticketModel) {
    this.collection = ticketModel
  }

  async addTicket(ticket) {
    try {
      return await this.collection.create(ticket)
    } catch (error) {
      throw new Error(`Error en addTicket - TicketManager.js --> ${error}`)
    }
  }

  async getTicketByEmail(email){
    try {
      return await this.collection.findOne({ purchaser: email}).lean()
    } catch (error) {
      throw new Error(`Error en getTicketByEmail - TicketManager.js --> ${error}`)
    }
  }

  async getTickets() {
    try {
      return await this.collection.find().lean()
    } catch (error) {
      throw new Error(`Error en getTickets - TicketManager.js --> ${error}`)
    }
  }

  async deleteTicketById(ticketId){
    try {
      return await this.collection.deleteOne({ _id: ticketId})
    } catch (error) {
      throw new Error(`Error en deleteTicketById -- TicketManager.js ---> ${error}`)
    }
  }

}

export const ticketManager = new TicketManager(ticketModel)
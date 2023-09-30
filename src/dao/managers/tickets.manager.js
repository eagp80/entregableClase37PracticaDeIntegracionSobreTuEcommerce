import { ticketModel } from "../models/ticket.model.js";

class TicketManager {

  async createTicket(purchaser, amount) {
    try {
      const newTicket = await ticketModel.create({
        purchaser,
        amount,
      })
  
      return {
        message: 'Ticket created',
        ticket: newTicket,
      }
    } catch (error) {
      throw new Error('Error while emiting ticket')
    }
  }

}

export default new TicketManager();
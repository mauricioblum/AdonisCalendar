'use strict'

const Event = use('App/Models/Event')
const User = use('App/Models/User')
const Mail = use('Mail')
const moment = require('moment')

class ShareEventController {
  async create ({ request, response, params, auth }) {
    try {
      const event = await Event.findOrFail(params.id)
      const user = await User.findOrFail(auth.user.id)
      const { to } = request.get()

      if (to) {
        await Mail.send(
          ['emails.share_event'],
          {
            title: event.title,
            location: event.location,
            date: event.date.toLocaleString('pt-BR')
          },
          message => {
            message
              .to(to)
              .from(user.email, user.username)
              .subject(`${user.username} compartilhou um evento com você!`)
          }
        )
      } else {
        return response
          .status(401)
          .send({ error: { message: 'Nao posso enviar email sem destinatario!' } })
      }
    } catch (err) {
      console.log(err.message)
      return response
        .status(401)
        .send({ error: { message: 'Algo nao deu certo!' } })
    }
  }
}

module.exports = ShareEventController

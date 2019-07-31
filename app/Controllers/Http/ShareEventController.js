'use strict'

const Event = use('App/Models/Event')
const User = use('App/Models/User')
const Kue = use('Kue')
const Job = use('App/Jobs/ShareEvent')
class ShareEventController {
  async create ({ request, response, params, auth }) {
    try {
      const event = await Event.findOrFail(params.id)
      const user = await User.findOrFail(auth.user.id)
      const { to } = request.get()

      if (to) {
        Kue.dispatch(Job.key, { email: to, username: user.username, event })
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

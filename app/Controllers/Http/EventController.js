'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const Event = use('App/Models/Event')
const moment = require('moment')

/**
 * Resourceful controller for interacting with events
 */
class EventController {
  /**
   * Show a list of all events.
   * GET events
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index ({ request, response }) {
    const { page, date } = request.get()

    let query = Event.query().with('user')

    if (date) {
      query = query.whereRaw(`date like ?`, date + '%')
    }

    const events = await query.paginate(page)

    return events
  }

  /**
   * Create/save a new event.
   * POST events
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store ({ request, auth }) {
    const data = request.only(['title', 'location', 'date'])

    const event = await Event.create({ ...data, user_id: auth.user.id })

    return event
  }

  /**
   * Display a single event.
   * GET events/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show ({ params, response, auth }) {
    const event = await Event.findOrFail(params.id)

    if (auth.user.id !== event.user_id) {
      return response
        .status(401)
        .send({ error: { message: 'Erro! Voce nao tem permissao para ver este evento!' } })
    }

    await event.load('user')

    return event
  }

  /**
   * Update event details.
   * PUT or PATCH events/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update ({ params, request, response, auth }) {
    const event = await Event.findOrFail(params.id)
    const data = request.only(['title', 'location', 'date'])

    if (auth.user.id !== event.user_id) {
      return response
        .status(401)
        .send({ error: { message: 'Erro! Voce nao tem permissao para editar este evento!' } })
    } else if (moment(event.date).isBefore(Date.now())) {
      return response
        .status(401)
        .send({ error: { message: 'Erro! Voce nao pode editar um evento que já passou!' } })
    }

    event.merge(data)

    await event.save()

    return event
  }

  /**
   * Delete a event with id.
   * DELETE events/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy ({ params, auth, response }) {
    const event = await Event.findOrFail(params.id)

    if (auth.user.id !== event.user_id) {
      return response
        .status(401)
        .send({ error: { message: 'Erro! Voce nao tem permissao para remover este evento!' } })
    } else if (moment(event.date).isBefore(Date.now())) {
      return response
        .status(401)
        .send({ error: { message: 'Erro! Voce nao pode remover um evento que já passou!' } })
    } else {
      event.delete()
    }
  }
}

module.exports = EventController

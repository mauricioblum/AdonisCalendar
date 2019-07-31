'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Event extends Model {
  static boot () {
    super.boot()

    this.addHook('afterCreate', 'EventHook.sendShareEventMail')
    this.addHook('beforeUpdate', 'EventHook.sendShareEventMail')
  }

  user () {
    return this.belongsTo('App/Models/User')
  }
}

module.exports = Event

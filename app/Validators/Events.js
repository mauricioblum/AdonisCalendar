'use strict'

const Antl = use('Antl')

class Events {
  get validateAll () {
    return true
  }

  get rules () {
    return {
      title: 'required',
      date: 'date|required|unique:events'
    }
  }

  get messages () {
    return Antl.list('validation')
  }
}

module.exports = Events

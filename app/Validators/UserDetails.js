'use strict'

const Antl = use('Antl')

class UserDetails {
  get validateAll () {
    return true
  }

  get rules () {
    return {
      // validation rules
      username: 'unique:users',
      password: 'required',
      newPassword: 'confirmed'
    }
  }

  get messages () {
    return Antl.list('validation')
  }
}

module.exports = UserDetails

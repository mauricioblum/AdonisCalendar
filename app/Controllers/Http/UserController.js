'use strict'

const User = use('App/Models/User')
const Hash = use('Hash')

class UserController {
  async index () {
    const users = await User.all()

    return users
  }

  async store ({ request }) {
    const data = request.only(['username', 'email', 'password'])

    const user = await User.create(data)

    return user
  }

  async update ({ params, request, response }) {
    try {
      const { password, newPassword, username } = request.all()
      const userId = params.id

      const user = await User.findByOrFail('id', userId)
      const isSame = await Hash.verify(password, user.password)

      if (isSame) {
        user.password = newPassword
        user.username = username
        user.save()
        return user
      } else {
        return response
          .status(403)
          .send({ error: { message: 'Senha antiga incorreta.' } })
      }
    } catch (err) {
      return response
        .status(err.status)
        .send({ error: { message: 'Algo deu errado ao alterar sua senha.' } })
    }
  }
}

module.exports = UserController

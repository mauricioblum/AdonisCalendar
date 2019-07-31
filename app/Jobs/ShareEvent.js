'use strict'

const Mail = use('Mail')

class ShareEvent {
  // If this getter isn't provided, it will default to 1.
  // Increase this number to increase processing concurrency.
  static get concurrency () {
    return 1
  }

  // This is required. This is a unique key used to identify this job.
  static get key () {
    return 'ShareEvent-job'
  }

  // This is where the work is done.
  async handle ({ email, username, event }) {
    console.log('ShareEvent-job started')
    await Mail.send(
      ['emails.share_event'],
      {
        title: event.title,
        location: event.location,
        date: event.date
      },
      message => {
        message
          .to(email)
          .from('sistema@mau.com', 'Administrador Mau')
          .subject(`${username} compartilhou um evento com você!`)
      }
    )
  }
}

module.exports = ShareEvent

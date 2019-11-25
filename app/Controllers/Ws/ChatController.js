'use strict'

const Event = use('Event')

class ChatController {
  constructor ({ socket, request }) {
    this.socket = socket
    this.request = request

    console.log('Nueva suscripcion al topic', socket.topic)
        
  }


  onMessage (message) {

        console.log('Mensaje: ', message)
  }

  onClose () {
 
    console.log('Cerrado el room topic', this.socket.id)
    this.socket.on(this.socket.topic)

  }
}

module.exports = ChatController



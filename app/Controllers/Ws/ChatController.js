'use strict'

const Event = use('Event')

class ChatController {
  constructor ({ socket, request }) {
    this.socket = socket
    this.request = request

    console.log('Nueva suscripcion al topic', socket.topic)
  }

  

  onMessage (message) {

    this.socket.emit('message', 'Hola Mundo')
    console.log('Mensaje: ', message)


    Event.on('add::boleta', async (boleta) => {
      boleta.id
      console.log("Desde el evento" + boleta.id)
      this.socket.emit('message', "Desde el evento" + boleta.id)

    })
  }

  disconnected(socket){
    console.log("Desconectado del Socket ID %s",socket.id)
  }

  onClose () {
    console.log('Cerrado el room topic', this.socket.topic)
  }
}

module.exports = ChatController

'use strict'

const { LogicalException } = require('@adonisjs/generic-exceptions')

class InvalidoAccesoException extends LogicalException {
  handle (error, { response }) {
    response.status(500).send('Error Invalido Usuario Exepcion')
  }
}

module.exports = InvalidoAccesoException

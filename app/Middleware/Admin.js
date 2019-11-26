'use strict'
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const InvalidoAccesoException = use("App/Exceptions/InvalidoAccesoException");

class Admin {
  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Function} next
   */
  async handle ({ request, auth  }, next) {
    const user = await auth.getUser();

    if (!user.roles || user.roles != "admin")
      throw new InvalidoAccesoException();

    await next()
  }
}

module.exports = Admin

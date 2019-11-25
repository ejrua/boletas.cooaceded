'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class BoletaSchema extends Schema {
  up () {
    this.create('boletas', (table) => {
      table.increments()
      table.integer('user_id').unsigned().references('id').inTable('users')
      table.string('cedula', 20).notNullable()
      table.string('nombre', 80).notNullable()
      table.string('responsable', 20).notNullable()
      table.boolean('is_habil').defaultTo(0)
      table.boolean('is_active').defaultTo(0)
      table.unique(['cedula', 'is_habil'])
      table.timestamps()
    })
  }

  down () {
    this.drop('boletas')
  }
}

module.exports = BoletaSchema

'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class MovimientoSchema extends Schema {
  up () {
    this.create('movimientos', (table) => {
      table.increments()
      table.integer('user_id').unsigned().references('id').inTable('users')
      table.string('cedula', 20).notNullable()
      table.string('nombre', 80).notNullable()
      table.string('responsable', 20).notNullable()
      table.string('observacion', 255)
      table.boolean('is_habil').defaultTo(0)
      table.timestamps()
    })
  }

  down () {
    this.drop('movimientos')
  }
}

module.exports = MovimientoSchema

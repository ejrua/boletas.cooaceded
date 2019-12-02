'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ExcepcionSchema extends Schema {
  up () {
    this.create('excepcions', (table) => {
      table.increments()
      table.integer('user_id').unsigned().references('id').inTable('users')
      table.string('cedula', 20).notNullable()
      table.string('observacion', 255)    
      table.boolean('is_habil').defaultTo(1)      
      table.timestamps()
    })
  }

  down () {
    this.drop('excepcions')
  }
}

module.exports = ExcepcionSchema

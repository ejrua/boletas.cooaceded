'use strict'

class FormatearBoleta {
    constructor (dato,caracter, numero=4,alineacion = 'a') {
      this.dato = dato
      this.numero = numero
      this.caracter = caracter
      this.alineacion = alineacion
    }
    // Getter
    get   formato  ()   {
       return this.formatear()
     }
    // Método
    formatear () {
        tamano = this.dato.trim().length
        if(this.alineacion){
            if(tamano < this.numero ){
            return this.caracter.repeat(this.numero-tamano) + this.dato     
            }
        }    
     
    }
  }

  module.exports = FormatearBoleta
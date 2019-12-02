'use strict'

const axios = use('axios')

const Boleta = use('App/Models/Boleta')
const Excepcion = use('App/Models/Excepcion')
const Database = use('Database')

const { validate } = use('Validator')

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with excepcions
 */
class ExcepcionController {
  /**
   * Show a list of all excepcions.
   * GET excepcions
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index ({ view }) {
     const exc = await Database.select('*').from('excepcions')
  //   console.log(excepciones)
     return view.render('excepcion.index',{   
      excepcion:exc  
})
  }

  /**
   * Render a form to be used for creating a new excepcion.
   * GET excepcions/create
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async create ({ request, response, view }) {
    return view.render('excepcion.create')
  }

  async query ({ request,response,session,view}) {
    //console.log("Si pasa")
    const { cedula } = request.all()
    //console.log(cedula)
    const boleta = await Boleta.findBy('cedula',cedula)
    if(!boleta){
      const resp = await axios.get('http://api.cooaceded.coop/estado/personaRegistro/' + cedula)
              .then((response) => {
              //   console.log(response)
              return response
          })
          return view.render('excepcion.create',{
            // boletas:boletas.toJSON()
            excepcion:resp  
          })
        }else{
        //  console.log("Pasa.")
              session.flash({
                notification:{
                    type:'danger',
                    message:'Ya tiene boleta, ' +  cedula
                }
              })
              return response .redirect('back')
    }      
    // console.log(resp.data[0].fields.estado_Actual)   
    
    
  }
  /**
   * Create/save a new excepcion.
   * POST excepcions
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store ({auth,session, request, response }) {
  
    const user = await auth.getUser();

    const { cedula } = request.all()

    const rules = {
      cedula: 'required|unique:excepcions'
    }

    const messages = {
      required: 'Digite una cedula',
      unique: 'Ya existe una boleta para la cedula:' + cedula,
      
    }

    const validation = await validate(request.all(), rules, messages)

       
    if (validation.fails()) {
      session
          .withErrors(validation.messages())
  
      return response.redirect('back')
      }

    
  
    const excepcion = await new Excepcion()
    excepcion.cedula = cedula,
    excepcion.observacion= request.input('observacion')   
  
    await user.excepcion().save(excepcion)

    
   
    session.flash({
      notification:{
          type:"success",
          message:'Autorizada la cedula:' +cedula
      }
    })
  return response .redirect('/excepcion/create') 
  }

  /**
   * Display a single excepcion.
   * GET excepcions/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show ({ params, request, response, view }) {
  }

  /**
   * Render a form to update an existing excepcion.
   * GET excepcions/:id/edit
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async edit ({ params, request, response, view }) {
  }

  /**
   * Update excepcion details.
   * PUT or PATCH excepcions/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update ({ params, request, response }) {
  }

  /**
   * Delete a excepcion with id.
   * DELETE excepcions/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy ({ params, request, response }) {
  }
}

module.exports = ExcepcionController

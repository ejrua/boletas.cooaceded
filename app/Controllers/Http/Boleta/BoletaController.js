'use strict'

const Mail = use('Mail')
const Ws = use('Ws')
const Database = use('Database')

const Boleta = use('App/Models/Boleta')
const Movimiento = use('App/Models/Movimiento')

const axios = use('axios')
const { validate } = use('Validator')


class BoletaController {
    async index({view,session}){
        //const boletas = await Boleta.all()
        const boletas = await Database
                                .table('boletas')
                                .where({ is_active: 0 })
                                .orderBy('id', 'asc')

        // const test = await Mail.send('boletas.index', "Bienvenido", (message) => {
        //     message
        //         .from('ejruaa@gmail.com')
        //         .to('ejrua@hotmail.com')
        //     })
        // console.loog(test)    
      //  console.log("bol:"+boletas.length)
        if(!boletas.length){
            session.flash({
                notification:{
                    type:'warning',
                    message:'No hay boletas por entregar',
                }
            })
        }

        return view.render('boletas.index',{
           // boletas:boletas.toJSON()
              boletas:boletas  
        })
    }
   

    async add({view}){
        return view.render('boletas.add')
	}

    async movimiento(user,cedula,responsable,obs){
           // Intento de usar cedula para otra boleta
           
           const movimiento = await new Movimiento()
           movimiento.cedula = cedula,
           movimiento.nombre = cedula,
           movimiento.responsable = responsable,
           movimiento.observacion = obs
           await user.movimiento().save(movimiento)
    }

	async store({request, auth,session, response}){
       
        const user = await auth.getUser();
        
        const rules = {
            cedula: 'required|unique:boletas'
        }
        
        const { cedula } = request.all()

        const messages = {
            required: 'Digite una cedula',
            unique: 'Ya existe una boleta para la cedula: ' + cedula,
            
          }

        const validation = await validate(request.all(), rules, messages)
      
        if (validation.fails()) {
        session
            .withErrors(validation.messages())
           
            //OJO CUando el responsable debe almacenar este dato
            this.movimiento(user,cedula,cedula, 'Cedula usada en otra boleta')

    
        return response.redirect('back')
        }

        const resp = await axios.get('http://api.cooaceded.coop/estado/personaRegistro/' + cedula)
            .then((response) => {
              
                return response;
        });

        //console.log("Cedula:"+resp.data[0].fields.deudaaporte+','+resp.data[0].fields.sinaporte+','+resp.data[0].fields.deudacredito+','+resp.data[0].fields.afiliacion)    
        var tipo = ""
        var mensaje=""
       
        if (!resp.data[0]){
           
           tipo = "danger"
           mensaje = 'No es existe, ' +  cedula
            
        } else if(( resp.data[0].fields.estado_Actual!= 'A' || resp.data[0].fields.deudaaporte>0 || resp.data[0].fields.sinaporte  > 0 || resp.data[0].fields.deudacredito>0 || resp.data[0].fields.afiliacion>0)){
        
            tipo = "danger"
            mensaje = 'No es Habil, ' + resp.data[0].fields.empleado
        } 



        if(tipo){
            this.movimiento(user,cedula,cedula, 'No es existe')
        
            session.flash({
                notification:{
                    type:tipo,
                    message:mensaje
                }
            })
            return response .redirect('back')
        }
      
      // OOOOOOO jjjj OOOOOOOOO  
      //  hay que habilitar y desahibiltar un usuario para registrar boletas
      // OOOOOOO jjjj OOOOOOOOO  


      //  console.log("Cedula:"+resp.data[0].pk)    
     
        const boleta = await new Boleta()
        boleta.cedula = resp.data[0].pk,
        boleta.responsable = resp.data[0].pk,
        boleta.nombre = resp.data[0].fields.empleado,
        boleta.is_habil = 1 
        
        await user.boleta().save(boleta)
     //   Event.fire('add::boleta', boleta)

        Ws.getChannel('chat').topic('chat').broadcast('nuevo',boleta.id)

                 
        session.flash({
            notification:{
                type:'success',
                message:resp.data[0].fields.empleado,
                message2:'Boleta Nro., ' + boleta.id
            }
        })
        return response .redirect('back')

	}


	async update({params, session, response }){
        const boleta = await Boleta.find(params.id)

       
        
        boleta.is_active = 1

		await boleta.save()
         //Event.fire('add::boleta', boleta)
      
        // Mensaje Socket
        Ws.getChannel('chat').topic('chat').broadcast('message',boleta.id)
      
        session.flash({
            notification:{
                type:'success',
                message:'Boleta ' + boleta.id +' entregada...',
                
            }
        })
		return response.redirect('/boletas')
	}
}

module.exports = BoletaController

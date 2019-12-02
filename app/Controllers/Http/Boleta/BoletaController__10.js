'use strict'

//const Mail = use('Mail')
const Ws = use('Ws')
const Database = use('Database')

const Boleta = use('App/Models/Boleta')
const Movimiento = use('App/Models/Movimiento')

//const FormatearBoleta = use('App/Controllers/Boleta/FormatearBoleta')


const axios = use('axios')
const { validate } = use('Validator')



class FormatearBoleta {
    constructor (dato,caracter, numero=4,alineacion = 'a') {
      this.dato = dato.toString()
      this.numero = numero
      this.caracter = caracter
      this.alineacion = alineacion
    //   console.log("dato:"+typeof this.dato)
    //   console.log("d_l:"+this.dato.length)
    }
    // Getter
    get   formato  ()   {
       return this.formatear()
     }
    // Método
    formatear () {
        const tamano = this.dato.length
        if(this.alineacion=='a'){
            // console.log("t:"+tamano+','+'n:'+this.numero)
            // console.log("f:"+this.caracter.repeat(this.numero-tamano) + this.dato)
            if(tamano < this.numero ){
                
            return this.caracter.repeat(this.numero-tamano) + this.dato                 
            }
        }    
     
    }
  }



class BoletaController {
    async index({view,session}){
        //const boletas = await Boleta.all()
        const boletas = await Database
                                .select('idformateada','id','nombre')
                                .table('public.boletasformateada')
                                .where({ is_active: 0 })
                                .orderBy('id', 'asc')

        // const test = await Mail.send('boletas.index', "Bienvenido", (message) => {
        //     message
        //         .from('ejruaa@gmail.com')
        //         .to('ejrua@hotmail.com')
        //     })
        // console.loog(test)    
       

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
   
    async entregadas({view,session}){
        //const boletas = await Boleta.all()
        const boletas = await Database
                               // raw no genera un JSON adeacuado, la logica del query esta en la vista de la BD 
                               //.raw("select id,nombre,repeat('0',3- length(cast(id as CHARACTER))) || cast(id as CHARACTER) idFormateada from boletas where is_active=true order by id desc" )
                                .select('idformateada','id','nombre')
                                .table('public.boletasformateada')
                                 .where({ is_active: 1 })
                                 .orderBy('id', 'desc')
                                 .limit(8)


     //   console.log(boletas)
        if(!boletas.length){
            session.flash({
                notification:{
                    type:'warning',
                    message:'No hay boletas por entregar',
                }
            })
        }

        return view.render('boletas.entregadas',{   
              boletas:boletas  
        })
    }
   

    async add({view}){
        return view.render('boletas.add')
	}

    
    async excepcion({view}){
        return view.render('boletas.excepcion')
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

	async store({request,params, auth,session, response}){
       
        const user = await auth.getUser();
        
        const rules = {
            cedula: 'required|unique:boletas'
        }
        
        const { cedula } = request.all()

        
       // console.log("excepcion:"+params.excepcion)

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
                console.log(response)
                return response;
        });

        //console.log("Cedula:"+resp.data[0].fields.deudaaporte+','+resp.data[0].fields.sinaporte+','+resp.data[0].fields.deudacredito+','+resp.data[0].fields.afiliacion)    
        var tipo = ""
        var mensaje=""
        var is_habil = 1
       
        if(!params.excepcion){
            if (!resp.data[0]){
            
            tipo = "danger"
            mensaje = 'No es existe, ' +  cedula
                
            } else if(( resp.data[0].fields.estado_Actual!= 'A' || resp.data[0].fields.deudaaporte>0 || resp.data[0].fields.sinaporte  > 0 || resp.data[0].fields.deudacredito>0 || resp.data[0].fields.afiliacion>0)){
            
                tipo = "danger"
                mensaje = 'No es Habil, ' + resp.data[0].fields.empleado
            }             
        } else if(!resp.data[0]){
                    
                    tipo = "danger"
                    mensaje = 'No es existe, ' +  cedula
                    is_habil = 0
                    this.movimiento(user,cedula,'6757270', 'No existe')
                }else {
                        is_habil = 0
                        this.movimiento(user,cedula,'6757270', 'Autorizada por el Gerente')
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
     
        /*
        Cuando hay excepciones debemos asegurardos que pertenezca a la BD
        */ 

        const boleta = await new Boleta()
        boleta.cedula = resp.data[0].pk,
        boleta.responsable = resp.data[0].pk,
        boleta.nombre = resp.data[0].fields.empleado,
        boleta.is_habil = is_habil 
        
        await user.boleta().save(boleta)
     //   Event.fire('add::boleta', boleta)

        
        /*
        OJO hay que validar que hay un suscripcion, es decir una pagina que consuma el socket
        para este caso /boletas/index, esta pagina consume el socket
        */

        try {
            Ws.getChannel('chat').topic('chat').broadcast('nuevo',boleta.id)    
        } catch (error) {
            console.log(error)
        }

        

        const formatoBoleta = new FormatearBoleta(boleta.id,'0')
                 
        //console.log("bol:"+ boleta.id + ',' +formatoBoleta.formato)

        session.flash({
            notification:{
                type:'success',
                message:resp.data[0].fields.empleado,
                message2:'Boleta Nro., ' + formatoBoleta.formato
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
        Ws.getChannel('chat').topic('chat').broadcast('entregada',boleta.id)

        const formatoBoleta = new FormatearBoleta(boleta.id,'0')
      
        session.flash({
            notification:{
                type:'success',
                message:'Boleta ' + formatoBoleta.formato +' entregada...',
                
            }
        })
		return response.redirect('/boletas')
	}
}

module.exports = BoletaController

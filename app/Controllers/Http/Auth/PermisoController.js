'use strict'
const Database = use('Database')
const User = use('App/Models/User')

class PermisoController {

    async index({ view }){
        const users = await Database.table('users')
        
        return view.render('auth.permisos.index',{
               users:users  
         })
    }

    async store({params, request,session, response }){
       
        const user = await User.find(params.id)

        //console.log('p:'+user.id)
      //  console.log(request)
        const { is_active,roles } = request.all()

        //console.log('a:'+is_active+','+'r:'+roles)


        user.is_active = (is_active==undefined ? false : true) 
        user.roles = roles

		await user.save()
        
        // session.flash({
        //     notification:{
        //         type:'success',
        //         message:'Boleta ' + formatoBoleta.formato +' entregada...',
                
        //     }
        // })
		return response.redirect('/permisos')
	}
}

module.exports = PermisoController

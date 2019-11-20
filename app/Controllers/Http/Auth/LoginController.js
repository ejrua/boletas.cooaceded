'use strict'

const User = use('App/Models/User')
const Hash = use('Hash')

class LoginController {
    showLoginForm({ view }){
        return view.render('auth.login')
    }
    async login({ request, auth, session, response}){
        //Pidiendo datos
        const { email, password, remember} = request.all()
        // recuperado el usuario de la BD 
        const user = await User.query()
            .where('email',email)
            .where('is_active',true)
            .first()
        //Verificando el password
        if(user){
            const passwordVerified =  await Hash.verify(password, user.password)

            if(passwordVerified){
                //logieando el usuario
                await auth.remember(!!remember).login(user)
                return response.route('/')
            }
        }
        // Mostrando mensaje de errores 
        session.flash({
            notification:{
                type:'danger',
                message:'Confirme su credenciales, verifica tu email'
            }
        })
        return response .redirect('back')
        
    }
}

module.exports = LoginController

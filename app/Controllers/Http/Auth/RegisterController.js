'use strict'

const { validateAll } = use('Validator')
const User = use('App/Models/User')

const randomstring = require('random-string')
const Mail = use('Mail')

class RegisterController {
    showRegisterForm({ view }){
        return view.render('auth.register')
    }
    async register ({ request, session, response }){
        // Validando las entradas del formulario
        const validation  = await validateAll(request.all(),{
            username: 'required|unique:users,username',
            email: 'required|email|unique:users,email',
            password: 'required'
        })
        if(validation.fails()){
           session.withErrors(validation.messages()).flashExcept(['password'])
           return response.redirect('back')
        }
        // Crear Usuario

        const user = await User.create({
            username: request.input('username'),
            email: request.input('email'),
            password: request.input('password'),
            confirmation_token: randomstring({ lenght: 40 })
        })
        // enviando email de confirmacion 
        const test = await Mail.send('auth.emails.confirm_email',user.toJSON(),(message) => {
            message
            .to(user.email,'ejruaa@gmail.com','ejrua@cooaceded.coop')
            .from('ejrua@cooaceded.coop')
            .subject(' Por favor confirma tu email')

        })
        console.log(test)
        // Mostrando mensaje de Satisfación
        session.flash({
            notifaction: {
                type:'success',
                message: 'Registro correcto, se envio un eamil a su direccion de correo'
            }
        })

        return response.redirect('back')

    }
}

module.exports = RegisterController

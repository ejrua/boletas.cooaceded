'use strict'

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URL's and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')


Route.on('/').render('home').as('home')
Route.get('register','Auth/RegisterController.showRegisterForm')
Route.post('register','Auth/RegisterController.register').as('register')
Route.get('login','Auth/LoginController.showLoginForm')
Route.post('login','Auth/LoginController.login').as('login')
Route.get('logout','Auth/AuthenticatedController.logout')

Route.get('boletas','Boleta/BoletaController.index').middleware(["auth", "admin"]);
Route.get('boletas/add','Boleta/BoletaController.add').middleware('auth')
Route.post('boletas','Boleta/BoletaController.store').as('boletas').middleware('auth')
Route.post('boletas/:id', 'Boleta/BoletaController.update').middleware(["auth", "admin"]);


Route.on('/ws').render('chat/welcome').middleware(["auth", "admin"]);
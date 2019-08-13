const express = require('express');
const routes = express.Router();

const controllers = require('./controllers');

//Rotas Boards
routes.get('/', controllers.boardController.index);
routes.post('/', controllers.boardController.store);
routes.put('/:id', controllers.boardController.update);

//Rotas Tasks
routes.put('/task/:id', controllers.taskController.update);
routes.get('/task/:id', controllers.taskController.delete);

//Rotas users
routes.post('/register', controllers.userController.register);
routes.post('/auth', controllers.userController.auth);

module.exports = routes;
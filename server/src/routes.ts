//request.params => Parametros na propria rota, necessários, nao sobrevive sem ela
//request.query => pode sobreviver sem,usado para filtros, geralmente opcionais, paginação.. etc
//request.body => Parametros para todo resto, criação/atualizacao de infos..

import express from 'express';

import MechanicalsController from './controllers/MechanicalsController';
import ItemController from './controllers/ItemsController';
import multer from 'multer';
import multerConfig from './config/multer';

const routes = express.Router();
const upload = multer(multerConfig);

const mechanicalsController = new MechanicalsController();
const itemController = new ItemController();

routes.get('/items', itemController.index);

routes.post('/mechanicals', upload.single('image') ,mechanicalsController.create);//upload para poder enviar a foto.

routes.get('/mechanicals', mechanicalsController.index);   //index quando listar todos
routes.get('/mechanicals/:id', mechanicalsController.show); //show quando listar um item unico

export default routes;
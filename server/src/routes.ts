//request.params => Parametros na propria rota, necessários, nao sobrevive sem ela
//request.query => pode sobreviver sem,usado para filtros, geralmente opcionais, paginação.. etc
//request.body => Parametros para todo resto, criação/atualizacao de infos..

import express from 'express';

import MechanicalsController from './controllers/MechanicalsController';
import ItemController from './controllers/ItemsController';
import LoginController from './controllers/LoginController';
import multer from 'multer';
import multerConfig from './config/multer';
import { celebrate, Joi} from 'celebrate';

const routes = express.Router();
const upload = multer(multerConfig);

const mechanicalsController = new MechanicalsController();
const itemController = new ItemController();
const loginController = new LoginController();

routes.get('/items', itemController.index);

routes.get('/mechanicals', mechanicalsController.index);   //index quando listar todos
routes.get('/mechanicals/:id', mechanicalsController.show); //show quando listar um item unico

routes.post(
    '/mechanicals',
    upload.single('image'), //upload para poder enviar a foto.
    celebrate({  //validação dos campos no back
        body: Joi.object().keys({
            name: Joi.string().required(),
            email: Joi.string().required().email(),
            whatsapp: Joi.string().required(),
            latitude: Joi.number().required(),
            longitude: Joi.number().required(),
            city: Joi.string().required(),
            uf: Joi.string().required().max(2),
            items: Joi.string().required(),
        })
    },{
        abortEarly: false, //valida todos de uma vez (nao trava no primeiro)
    }),
    mechanicalsController.create
);

routes.post('/login', loginController.update);

export default routes;
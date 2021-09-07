//request.params => Parametros na propria rota, necessários, nao sobrevive sem ela
//request.query => pode sobreviver sem,usado para filtros, geralmente opcionais, paginação.. etc
//request.body => Parametros para todo resto, criação/atualizacao de infos..

import express from 'express';

const routes = express.Router();

routes.get('/', (request, response)=> {

    return response.json({message: "herllo worlds"});
});

export default routes;
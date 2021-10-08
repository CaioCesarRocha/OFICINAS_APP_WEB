import {Request, Response} from 'express';
import knex from '../database/connection';

class LoginController{

    async update(request: Request, response: Response){
      const {id} = request.query;
      console.log(id)
    }
}

export default LoginController;
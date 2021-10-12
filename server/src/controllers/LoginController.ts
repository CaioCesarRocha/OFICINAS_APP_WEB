import {Request, Response} from 'express';
import knex from '../database/connection';
import{OAuth2Client} from 'google-auth-library';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)

interface Payload{
  sub: string;
  email: string;
  name: string;
  picture: string;
}

class LoginController{
    //VALIDATION OF USER 
    async update(request: Request, response: Response){
      const tokens = request.body;
      const token_id = tokens[0].id

      const ticket = await client.verifyIdToken({
        idToken: token_id,
        audience: process.env.GOOGLE_CLIENT_ID
      });
      const payload = ticket.getPayload();
      console.log(`${payload?.name} verified`)
      const {sub, email, name, picture} = payload as Payload;
      console.log(sub, email, name, picture)
      
      return response.json({
        sub: sub,
        email: email,
        name: name,
        picture: picture
      });
    }
}

export default LoginController;
import {Request, Response} from 'express';
import knex from '../database/connection';
import{OAuth2Client} from 'google-auth-library';
import crypto from 'crypto'; //gerar um hash aleatorio de dados

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)

interface Payload{
  sub: string;
  email: string;
  name: string;
  picture: string;
}


const algorithm = 'aes-256-ctr';
const secret = 'ansheinzaiuca';

let key = crypto.createHash('sha256').update(String(secret)).digest('base64').substr(0, 32);
//let iv = crypto.randomBytes(16);


class LoginController{
    //VALIDATION OF USER GOOGLE 
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
      
      return response.json({
        sub: sub,
        email: email,
        name: name,
        picture: picture
      });
    }

    //VALIDATION OF USER NORMAL
    async enter(request: Request, response: Response){
      let { email, senha} = request.body;
      
      const user = await knex('users').where('email', email).first()

      const password = user.senha
      
      if(!user){
        return response.status(400).json({message: "User not found!"});
      }
      else{      
          
        try{
          
          let textParts = password.split(':');
          console.log(textParts)
          let iv = Buffer.from(textParts.shift(), 'hex');
          let encryptedText = Buffer.from(textParts.join(':'), 'hex');
          //const cipher = crypto.createCipheriv(algorithm, key, iv);
          let decipher = crypto.createDecipheriv(algorithm, key, iv);
          let decrypted = decipher.update(encryptedText);
          decrypted = Buffer.concat([decrypted, decipher.final()]);
          console.log(decrypted.toString());

          return response.status(400).json(password);         
        } 
        catch{
          return response.status(400).json({message: "Password not found!"});
        }
      }

      return response.json(user);
    }

   
}

export default LoginController;
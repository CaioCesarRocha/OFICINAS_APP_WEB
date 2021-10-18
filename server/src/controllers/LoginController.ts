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


class LoginController{
    //VALIDATION OF USER GOOGLE 
    async update(request: Request, response: Response){
      console.log("entrei no user google")
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
      console.log("entrei no user normal")
      const userData =  request.body
      const email = userData[0].email
      let senha = userData[0].senha
    
      const user = await knex('users').where('email', email).first()

      const name = user.name
      let password = user.senha
      
      if(!user){
        return response.json({wrongPass: true})
      }
      else{                
        try{         
          let textParts = password.split(':');
          let iv = Buffer.from(textParts.shift(), 'hex');
          let encryptedText = Buffer.from(textParts.join(':'), 'hex');
          let decipher = crypto.createDecipheriv(algorithm, key, iv);
          let decrypted = decipher.update(encryptedText);
          decrypted = Buffer.concat([decrypted, decipher.final()]);
          password = decrypted.toString();
          if(senha === password){
            return response.json({name: name, wrongPass: false})
          }
          else{
            return response.json({wrongPass: true})
          }   
        } 
        catch{
          return response.status(400).json({message: "Password not found!"});
        }
      }
    }
  
}

export default LoginController;
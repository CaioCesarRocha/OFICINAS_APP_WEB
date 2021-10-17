import {Request, Response} from 'express';
import knex from '../database/connection';
import crypto from 'crypto'; //gerar um hash aleatorio de dados


const algorithm = 'aes-256-ctr';
const secret = 'ansheinzaiuca';

let key = crypto.createHash('sha256').update(String(secret)).digest('base64').substr(0, 32);
let iv = crypto.randomBytes(16);


class UsersController{

    async create (request: Request, response: Response){
        const dataUser = request.body;

        const name = dataUser[0].name
        const email = dataUser[0].email
        let senha = dataUser[0].senha 


        const trx = await knex.transaction();
             
        const cipher = crypto.createCipheriv(algorithm, key, iv);
        let encrypted = cipher.update(senha);
        encrypted = Buffer.concat([encrypted, cipher.final()]);
        senha = iv.toString('hex') + ':' + encrypted.toString('hex');
        console.log(senha)

        const user = {
            name,
            email,
            senha,
        }
        console.log(user)

        
        try{
            const insertedIds = await trx('users').insert(user); 
            console.log(insertedIds)
            const user_id = insertedIds[0];          
            await trx.commit(); //finaliza a criaçao
            return response.json({
                id: user_id,
                errorEmail: false,
                ...user,
            });
        }
        catch{
            await trx.commit(); //finaliza a criaçao
            return response.json({errorEmail: true})
        }     
    }    
}


/*function decrypt(text) {
    let textParts = text.split(':');
    let iv = Buffer.from(textParts.shift(), 'hex');
    let encryptedText = Buffer.from(textParts.join(':'), 'hex');
    let decipher = crypto.createDecipheriv(algorithm, Buffer.from(ENCRYPTION_KEY, 'hex'), iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
}*/

export default UsersController;



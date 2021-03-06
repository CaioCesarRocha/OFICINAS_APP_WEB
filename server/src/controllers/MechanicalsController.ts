//  CRIADO PARA DESACOPLAR O CODIGO DAS ROUTES

import {Request, Response} from 'express';
import knex from '../database/connection';

class MechanicalsController{
    async create (request: Request, response: Response){
        // recurso de destruturação = msm que escrever name = request.body.name 
        
        console.log(response)
        const {
            name,
            email,
            whatsapp,
            latitude,
            longitude,
            city,
            uf,
            items
        } = request.body;

        console.log(uf, city, name)

        //evitar que caso a segunda operação de errado, por nao ter vinculo com a outra, insera dados errados no banco
        const trx = await knex.transaction();

        const mechanical = {
            image: request.file?.filename,
            name,
            email,
            whatsapp,
            latitude,
            longitude,
            city,
            uf
        }
        const insertedIds = await trx('mechanicals').insert(mechanical);

        const mechanical_id = insertedIds[0];

        const mechanicalItems = items
        .split(',')
        .map((item: string) => Number(item.trim()))
        .map((item_id:number)=>{
            return{
                item_id,
                mechanical_id
            };
        })
        await trx('mechanical_items').insert(mechanicalItems);

        await trx.commit();
    
        return response.json({
            id: mechanical_id,
            ...mechanical,
        });
    }



    async index(request: Request, response: Response){//filtro por items, city e uf
        const { city, uf, items} = request.query;

        const parsedItems = String(items) //converter os items do formato string para array
        .split(',')
        .map(item => Number(item.trim()))

        const mechanicals = await knex('mechanicals')
        .join('mechanical_items', 'mechanicals.id', '=', 'mechanical_items.mechanical_id')
        .whereIn('mechanical_items.item_id', parsedItems) //se tem id dentro do parsedItems
        .where('city', String(city))
        .where('uf', String(uf))
        .distinct()         //retornar somente ids distintos
        .select('mechanicals.*')

        const serializedMechanicals = mechanicals.map(mechanical =>{ //retornar no formato correto
            return {
                ...mechanical,
                image_url: `http://192.168.100.2:3333/uploads/${mechanical.image}`,
            };
        });

        return response.json(serializedMechanicals);
    }



    async show(request: Request, response: Response){ //listagem unico mechanical
        const {id} = request.params;
        const mechanical = await knex('mechanicals').where('id', id).first()

        if(!mechanical){
            return response.status(400).json({message: "Mechanical not found"});
        }

        const serializedMechanical ={
            ...mechanical,
             image_url: `http://192.168.100.2:3333/uploads/${mechanical.image}`,
        };

        const items = await knex('items')
        .join('mechanical_items', 'items.id', '=' , 'mechanical_items.item_id')
        .where('mechanical_items.mechanical_id', id)
        .select('items.title');

        return response.json({mechanical: serializedMechanical, items});
    }
}

export default MechanicalsController;
//  CRIADO PARA DESACOPLAR O CODIGO DAS ROUTES

import {Request, Response} from 'express';
import knex from '../database/connection';

class MechanicalsController{
    async create (request: Request, response: Response){
        // recurso de destruturação = msm que escrever name = request.body.name       
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
    
        //evitar que caso a segunda operação de errado, por nao ter vinculo com a outra, insera dados errados no banco
        const trx = await knex.transaction();

        const mechanical = {
            image: 'https://images.unsplash.com/photo-1517524206127-48bbd363f3d7?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=60',
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

        const mechanicalItems = items.map((item_id:number)=>{
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

    async index(request: Request, response: Response){
        const { city, uf, items} = request.query;

        const parsedItems = String(items)
        .split(',')
        .map(item => Number(item.trim()))

        const mechanicals = await knex('mechanicals')
        .join('mechanical_items', 'mechanicals.id', '=', 'mechanical_items.mechanical_id')
        .whereIn('mechanical_items.item_id', parsedItems)
        .where('city', String(city))
        .where('uf', String(uf))
        .distinct()
        .select('mechanicals.*')

        return response.json(mechanicals);
    }


    async show(request: Request, response: Response){
        const {id} = request.params;
        const mechanical = await knex('mechanicals').where('id', id).first()

        if(!mechanical){
            return response.status(400).json({message: "Mechanical not found"});
        }
        const items = await knex('items')
        .join('mechanical_items', 'items.id', '=' , 'mechanical_items.item_id')
        .where('mechanical_items.mechanical_id', id)
        .select('items.title');

        return response.json({mechanical, items});
    }
}

export default MechanicalsController;
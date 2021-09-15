import {Request, Response} from 'express';
import knex from '../database/connection';

class ItemController{
    //function chama index por ser referente a listagem
    async index(request: Request, response: Response) {
        const items = await knex('items').select('*');
        const serializedItems = items.map(item =>{
            return {
                id: item.id,
                title: item.title,
                image_url: `http://192.168.100.2:3333/uploads/${item.image}`,
            };
        });
        return response.json(serializedItems);  
    }
}

export default ItemController;

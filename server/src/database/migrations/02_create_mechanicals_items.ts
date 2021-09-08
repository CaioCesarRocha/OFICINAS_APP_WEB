import {Knex} from "knex";

export async function up(knex: Knex ){ //passa qual o formato da váriavel para ter acesso aos recursos pelo knex.
    //criar a tabela
    return knex.schema.createTable('mechanical_items', table =>{
        table.increments('id').primary();
        table.integer('mechanical_id').notNullable().references('id').inTable('mechanicals');
        table.integer('item_id').notNullable().references('id').inTable('items');       
    });
}

export async function down(knex: Knex){
    //voltar atrás, deletar a tabela
   return knex.schema.dropTable('mechanical_items');
}